import React, { useState } from "react";
import "./InquiryInbox.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Mock inquiry data
const MOCK_INQUIRIES = [
  {
    id: 1,
    sender: "Rahul Sharma",
    email: "rahul.sharma@gmail.com",
    phone: "9876543210",
    property: "3 BHK Apartment in Koramangala",
    propertyId: 1,
    message:
      "Hi, I am interested in this property. Is it still available? I would like to schedule a visit this weekend if possible.",
    date: "2026-01-28T14:30:00",
    isRead: false,
    isArchived: false,
  },
  {
    id: 2,
    sender: "Priya Patel",
    email: "priya.patel@yahoo.com",
    phone: "9876543211",
    property: "2 BHK Flat in Indiranagar",
    propertyId: 2,
    message:
      "What is the best price you can offer? I am a serious buyer and can close the deal within 2 weeks.",
    date: "2026-01-28T10:15:00",
    isRead: false,
    isArchived: false,
  },
  {
    id: 3,
    sender: "Amit Kumar",
    email: "amit.kumar@outlook.com",
    phone: "9876543212",
    property: "4 BHK Villa in Whitefield",
    propertyId: 3,
    message:
      "Is the property near any IT parks? Also, is there a gym and swimming pool in the society?",
    date: "2026-01-27T16:45:00",
    isRead: true,
    isArchived: false,
  },
  {
    id: 4,
    sender: "Sneha Reddy",
    email: "sneha.reddy@gmail.com",
    phone: "9876543213",
    property: "3 BHK Apartment in Koramangala",
    propertyId: 1,
    message:
      "Can you share more photos of the kitchen and bathrooms? Also, what is the age of the building?",
    date: "2026-01-27T09:20:00",
    isRead: true,
    isArchived: false,
  },
  {
    id: 5,
    sender: "Vikram Singh",
    email: "vikram.singh@hotmail.com",
    phone: "9876543214",
    property: "2 BHK Flat in Indiranagar",
    propertyId: 2,
    message:
      "I visited the property yesterday. Very interested! Can we discuss the payment terms?",
    date: "2026-01-26T11:00:00",
    isRead: true,
    isArchived: false,
  },
];

const QUICK_REPLIES = [
  "Thank you for your interest! Yes, the property is still available. When would be a convenient time for you to visit?",
  "I appreciate your inquiry. I'll get back to you with more details shortly.",
  "The property has great connectivity to major IT parks. Would you like to schedule a visit?",
  "I can offer a 2% discount for a quick closure. Let me know if you're interested.",
];

function InquiryInbox() {
  const [inquiries, setInquiries] = useState(MOCK_INQUIRIES);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [filter, setFilter] = useState("all"); // all, unread, archived
  const [replyText, setReplyText] = useState("");

  // Fetch real inquiries from API
  React.useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    const token = localStorage.getItem("ResiDo_token");
    if (!token) {
      // Use mock data if no token
      setInquiries(MOCK_INQUIRIES);
      setLoading(false);
      return;
    }

    try {
      // First get owner's properties, then get inquiries for each
      const propsResponse = await fetch(
        `${API_BASE_URL}/users/my-properties`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (propsResponse.ok) {
        const properties = await propsResponse.json();

        // Fetch inquiries for all properties
        const allInquiries = [];
        for (const prop of properties) {
          const inqResponse = await fetch(
            `${API_BASE_URL}/inquiries/property/${prop.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          if (inqResponse.ok) {
            const propInquiries = await inqResponse.json();
            // Format inquiries for display
            propInquiries.forEach((inq) => {
              allInquiries.push({
                id: inq.id,
                sender: inq.sender?.name || "Unknown",
                email: inq.sender?.email || "",
                phone: inq.sender?.phone || "",
                property: prop.title,
                propertyId: prop.id,
                message: inq.message,
                date: inq.created_at,
                isRead: inq.status === "replied",
                isArchived: inq.status === "closed",
              });
            });
          }
        }
        // Sort by date descending
        allInquiries.sort((a, b) => new Date(b.date) - new Date(a.date));
        // If we got inquiries from API, use them; otherwise fallback to mock
        setInquiries(allInquiries.length > 0 ? allInquiries : MOCK_INQUIRIES);
      } else {
        // Fallback to mock data on error
        setInquiries(MOCK_INQUIRIES);
      }
    } catch (error) {
      console.error("Failed to fetch inquiries:", error);
      // Fallback to mock data on error
      setInquiries(MOCK_INQUIRIES);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = inquiries.filter(
    (i) => !i.isRead && !i.isArchived,
  ).length;

  const filteredInquiries = inquiries.filter((inquiry) => {
    if (filter === "unread") return !inquiry.isRead && !inquiry.isArchived;
    if (filter === "archived") return inquiry.isArchived;
    return !inquiry.isArchived;
  });

  const handleSelectInquiry = (inquiry) => {
    setSelectedInquiry(inquiry);
    // Mark as read
    if (!inquiry.isRead) {
      setInquiries((prev) =>
        prev.map((i) => (i.id === inquiry.id ? { ...i, isRead: true } : i)),
      );
    }
  };

  const handleArchive = (id) => {
    setInquiries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, isArchived: true } : i)),
    );
    if (selectedInquiry?.id === id) setSelectedInquiry(null);
  };

  const handleQuickReply = (reply) => {
    setReplyText(reply);
  };

  const [sending, setSending] = useState(false);

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedInquiry) return;

    const token = localStorage.getItem("ResiDo_token");
    if (!token) {
      alert("Please login to send a reply");
      return;
    }

    setSending(true);
    try {
      // First, we need to create an inquiry_id association
      // The inquiry object has an 'id' which we'll use
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          inquiry_id: selectedInquiry.id,
          content: replyText,
        }),
      });

      if (response.ok) {
        alert("Reply sent successfully!");
        setReplyText("");
        // Mark as replied
        setInquiries((prev) =>
          prev.map((i) =>
            i.id === selectedInquiry.id ? { ...i, isRead: true } : i,
          ),
        );
      } else {
        const error = await response.json();
        alert("Failed to send reply: " + (error.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Send reply error:", error);
      alert("Failed to send reply. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0)
      return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7)
      return date.toLocaleDateString("en-IN", { weekday: "short" });
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  };

  return (
    <div className="inquiry-inbox">
      {/* Inbox Header */}
      <div className="inbox-header">
        <div className="inbox-tabs">
          <button
            className={`tab ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All Inquiries
          </button>
          <button
            className={`tab ${filter === "unread" ? "active" : ""}`}
            onClick={() => setFilter("unread")}
          >
            Unread{" "}
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </button>
          <button
            className={`tab ${filter === "archived" ? "active" : ""}`}
            onClick={() => setFilter("archived")}
          >
            Archived
          </button>
        </div>
      </div>

      <div className="inbox-content">
        {/* Inquiry List */}
        <div className="inquiry-list">
          {filteredInquiries.length === 0 ? (
            <div className="empty-list">
              <span>✉</span>
              <p>No inquiries found</p>
            </div>
          ) : (
            filteredInquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className={`inquiry-item ${!inquiry.isRead ? "unread" : ""} ${selectedInquiry?.id === inquiry.id ? "selected" : ""}`}
                onClick={() => handleSelectInquiry(inquiry)}
              >
                <div className="inquiry-avatar">{inquiry.sender.charAt(0)}</div>
                <div className="inquiry-preview">
                  <div className="inquiry-header">
                    <span className="sender-name">{inquiry.sender}</span>
                    <span className="inquiry-date">
                      {formatDate(inquiry.date)}
                    </span>
                  </div>
                  <div className="inquiry-property">{inquiry.property}</div>
                  <div className="inquiry-snippet">
                    {inquiry.message.substring(0, 60)}...
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Inquiry Detail */}
        <div className="inquiry-detail">
          {selectedInquiry ? (
            <>
              <div className="detail-header">
                <div className="sender-info">
                  <div className="sender-avatar">
                    {selectedInquiry.sender.charAt(0)}
                  </div>
                  <div>
                    <h3>{selectedInquiry.sender}</h3>
                    <p>
                      {selectedInquiry.email} • {selectedInquiry.phone}
                    </p>
                  </div>
                </div>
                <div className="detail-actions">
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleArchive(selectedInquiry.id)}
                  >
                    Archive
                  </button>
                </div>
              </div>

              <div className="detail-property">
                <span className="property-label">Regarding:</span>
                <span className="property-name">
                  {selectedInquiry.property}
                </span>
              </div>

              <div className="detail-message">
                <p>{selectedInquiry.message}</p>
                <span className="message-date">
                  {new Date(selectedInquiry.date).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="quick-replies">
                <h4>Quick Replies</h4>
                <div className="reply-options">
                  {QUICK_REPLIES.map((reply, i) => (
                    <button
                      key={i}
                      className="quick-reply"
                      onClick={() => handleQuickReply(reply)}
                    >
                      {reply.substring(0, 50)}...
                    </button>
                  ))}
                </div>
              </div>

              <div className="reply-box">
                <textarea
                  placeholder="Type your reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={3}
                />
                <button
                  className="btn btn-primary"
                  onClick={handleSendReply}
                  disabled={sending || !replyText.trim()}
                >
                  {sending ? "Sending..." : "Send Reply"}
                </button>
              </div>
            </>
          ) : (
            <div className="no-selection">
              <span>✉</span>
              <p>Select an inquiry to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InquiryInbox;
