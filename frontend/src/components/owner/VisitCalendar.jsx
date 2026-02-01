import React, { useState, useEffect } from "react";
import "./VisitCalendar.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Mock scheduled visits (fallback)
const MOCK_VISITS = [
  {
    id: 1,
    visitorName: "Rahul Sharma",
    property: "3 BHK Apartment in Koramangala",
    date: "2026-01-29",
    time: "10:00 AM",
    status: "confirmed",
    phone: "9876543210",
    notes: "Interested buyer, first visit",
  },
  {
    id: 2,
    visitorName: "Priya Patel",
    property: "2 BHK Flat in Indiranagar",
    date: "2026-01-29",
    time: "02:30 PM",
    status: "confirmed",
    phone: "9876543211",
    notes: "Second visit, bringing family",
  },
  {
    id: 3,
    visitorName: "Amit Kumar",
    property: "4 BHK Villa in Whitefield",
    date: "2026-01-30",
    time: "11:00 AM",
    status: "pending",
    phone: "9876543212",
    notes: "Corporate relocation",
  },
  {
    id: 4,
    visitorName: "Sneha Reddy",
    property: "3 BHK Apartment in Koramangala",
    date: "2026-01-31",
    time: "04:00 PM",
    status: "confirmed",
    phone: "9876543213",
    notes: "Investment buyer",
  },
  {
    id: 5,
    visitorName: "Vikram Singh",
    property: "2 BHK Flat in Indiranagar",
    date: "2026-02-01",
    time: "10:30 AM",
    status: "pending",
    phone: "9876543214",
    notes: "First-time buyer",
  },
];

function VisitCalendar() {
  const [visits, setVisits] = useState(MOCK_VISITS);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState("week"); // week, month

  // Fetch visits from API
  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("ResiDo_token");
      if (!token) {
        console.log("No token found, using mock data");
        setVisits(MOCK_VISITS);
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/visits/owner`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch visits");
      }

      const data = await response.json();

      if (data && data.length > 0) {
        // Transform API data to match component format
        const transformedVisits = data.map((visit) => ({
          id: visit.id,
          visitorName: visit.visitor_name || visit.visitor?.name || "Unknown",
          property: visit.property?.title || "Property",
          date: visit.visit_date,
          time: visit.visit_time,
          status: visit.status,
          phone: visit.visitor_phone || visit.visitor?.phone || "",
          notes: visit.notes || "",
        }));
        setVisits(transformedVisits);
      } else {
        // Use mock data if no visits from API
        setVisits(MOCK_VISITS);
      }
    } catch (error) {
      console.error("Error fetching visits:", error);
      setVisits(MOCK_VISITS);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id) => {
    try {
      const token = localStorage.getItem("ResiDo_token");
      if (token) {
        await fetch(`${API_BASE_URL}/visits/${id}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "confirmed" }),
        });
      }
    } catch (error) {
      console.error("Error confirming visit:", error);
    }
    setVisits((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: "confirmed" } : v)),
    );
  };

  const handleCancel = async (id) => {
    try {
      const token = localStorage.getItem("ResiDo_token");
      if (token) {
        await fetch(`${API_BASE_URL}/visits/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Error cancelling visit:", error);
    }
    setVisits((prev) => prev.filter((v) => v.id !== id));
  };

  const today = new Date();
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  // Generate calendar days for month view
  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  // Generate week days
  const getWeekDays = () => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays();

  const getVisitsForDate = (dateStr) => {
    return visits.filter((v) => v.date === dateStr);
  };

  const formatDateStr = (date) => {
    return date.toISOString().split("T")[0];
  };

  const upcomingVisits = visits
    .filter((v) => new Date(v.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  return (
    <div className="visit-calendar">
      <div className="calendar-layout">
        {/* Calendar Panel */}
        <div className="calendar-panel">
          <div className="calendar-header">
            <button
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setMonth(newDate.getMonth() - 1);
                setSelectedDate(newDate);
              }}
            >
              ←
            </button>
            <h3>
              {selectedDate.toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric",
              })}
            </h3>
            <button
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setMonth(newDate.getMonth() + 1);
                setSelectedDate(newDate);
              }}
            >
              →
            </button>
          </div>

          <div className="calendar-view-toggle">
            <button
              className={view === "week" ? "active" : ""}
              onClick={() => setView("week")}
            >
              Week
            </button>
            <button
              className={view === "month" ? "active" : ""}
              onClick={() => setView("month")}
            >
              Month
            </button>
          </div>

          {/* Week View */}
          {view === "week" && (
            <div className="week-view">
              <div className="week-header">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <span key={day}>{day}</span>
                  ),
                )}
              </div>
              <div className="week-days">
                {weekDays.map((day) => {
                  const dateStr = formatDateStr(day);
                  const dayVisits = getVisitsForDate(dateStr);
                  const isToday = formatDateStr(today) === dateStr;

                  return (
                    <div
                      key={dateStr}
                      className={`week-day ${isToday ? "today" : ""}`}
                    >
                      <span className="day-number">{day.getDate()}</span>
                      <div className="day-visits">
                        {dayVisits.map((v) => (
                          <div key={v.id} className={`visit-chip ${v.status}`}>
                            {v.time}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Month View */}
          {view === "month" && (
            <div className="month-view">
              <div className="month-header">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <span key={day}>{day}</span>
                  ),
                )}
              </div>
              <div className="month-grid">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="month-day empty"></div>
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const dayVisits = getVisitsForDate(dateStr);
                  const isToday = formatDateStr(today) === dateStr;

                  return (
                    <div
                      key={day}
                      className={`month-day ${isToday ? "today" : ""} ${dayVisits.length > 0 ? "has-visits" : ""}`}
                    >
                      <span className="day-number">{day}</span>
                      {dayVisits.length > 0 && (
                        <div className="visit-indicator">
                          {dayVisits.length}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Upcoming Visits Panel */}
        <div className="visits-panel">
          <h3>Upcoming Visits</h3>
          <div className="visits-list">
            {upcomingVisits.length === 0 ? (
              <div className="no-visits">
                <span>✉</span>
                <p>No upcoming visits scheduled</p>
              </div>
            ) : (
              upcomingVisits.map((visit) => (
                <div key={visit.id} className="visit-card">
                  <div className="visit-header">
                    <div className="visit-datetime">
                      <span className="visit-date">
                        {new Date(visit.date).toLocaleDateString("en-IN", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                      <span className="visit-time">{visit.time}</span>
                    </div>
                    <span className={`status-badge ${visit.status}`}>
                      {visit.status}
                    </span>
                  </div>
                  <div className="visit-details">
                    <div className="visitor-name">{visit.visitorName}</div>
                    <div className="visit-property">{visit.property}</div>
                    <div className="visit-phone">{visit.phone}</div>
                    {visit.notes && (
                      <div className="visit-notes">{visit.notes}</div>
                    )}
                  </div>
                  <div className="visit-actions">
                    {visit.status === "pending" && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleConfirm(visit.id)}
                      >
                        Confirm
                      </button>
                    )}
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleCancel(visit.id)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VisitCalendar;
