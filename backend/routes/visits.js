const express = require("express");
const router = express.Router();
const { Visit, Property, User } = require("../models");
const { authenticateToken } = require("../middleware/auth");

// Schedule a new visit (for buyers/tenants)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      property_id,
      visit_date,
      visit_time,
      visitor_name,
      visitor_phone,
      visitor_email,
      notes,
    } = req.body;
    const visitor_id = req.user.id;

    // Get the property to find the owner
    const property = await Property.findByPk(property_id);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Create the visit
    const visit = await Visit.create({
      property_id,
      visitor_id,
      owner_id: property.owner_id,
      visit_date,
      visit_time,
      visitor_name,
      visitor_phone,
      visitor_email,
      notes,
      status: "pending",
    });

    res.status(201).json({
      message: "Visit scheduled successfully",
      visit,
    });
  } catch (error) {
    console.error("Error scheduling visit:", error);
    res.status(500).json({ error: "Failed to schedule visit" });
  }
});

// Get visits for property owner (all visits to their properties)
router.get("/owner", authenticateToken, async (req, res) => {
  try {
    const owner_id = req.user.id;

    const visits = await Visit.findAll({
      where: { owner_id },
      include: [
        {
          model: Property,
          as: "property",
          attributes: ["id", "title", "address"],
        },
        {
          model: User,
          as: "visitor",
          attributes: ["id", "name", "email", "phone"],
        },
      ],
      order: [
        ["visit_date", "ASC"],
        ["visit_time", "ASC"],
      ],
    });

    res.json(visits);
  } catch (error) {
    console.error("Error fetching owner visits:", error);
    res.status(500).json({ error: "Failed to fetch visits" });
  }
});

// Get visits for a buyer (visits they scheduled)
router.get("/my-visits", authenticateToken, async (req, res) => {
  try {
    const visitor_id = req.user.id;

    const visits = await Visit.findAll({
      where: { visitor_id },
      include: [
        {
          model: Property,
          as: "property",
          attributes: ["id", "title", "address", "price", "listing_type"],
        },
      ],
      order: [
        ["visit_date", "DESC"],
        ["visit_time", "DESC"],
      ],
    });

    res.json(visits);
  } catch (error) {
    console.error("Error fetching my visits:", error);
    res.status(500).json({ error: "Failed to fetch visits" });
  }
});

// Update visit status (for owners)
router.patch("/:id/status", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const owner_id = req.user.id;

    const visit = await Visit.findOne({
      where: { id, owner_id },
    });

    if (!visit) {
      return res.status(404).json({ error: "Visit not found or unauthorized" });
    }

    visit.status = status;
    await visit.save();

    res.json({
      message: `Visit ${status} successfully`,
      visit,
    });
  } catch (error) {
    console.error("Error updating visit status:", error);
    res.status(500).json({ error: "Failed to update visit status" });
  }
});

// Cancel a visit (by visitor or owner)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const visit = await Visit.findOne({
      where: { id },
    });

    if (!visit) {
      return res.status(404).json({ error: "Visit not found" });
    }

    // Allow cancellation by visitor or owner
    if (visit.visitor_id !== user_id && visit.owner_id !== user_id) {
      return res
        .status(403)
        .json({ error: "Unauthorized to cancel this visit" });
    }

    visit.status = "cancelled";
    await visit.save();

    res.json({ message: "Visit cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling visit:", error);
    res.status(500).json({ error: "Failed to cancel visit" });
  }
});

module.exports = router;
