import React from "react";
import { Car, Calendar, Shield, LogOut, MapPin, Clock } from "lucide-react";

export function FigmaMyBookings({
  bookings,
  fidelityMode,
  activeTab,
  onTabChange,
  onEditTime,
  onCancelBooking,
}) {
  const isLow = fidelityMode === "low";
  // Accept standard backend model names (slotNumber/location/pricePerHour might be nested inside booking.parkingSlot)
  const getBookingDetails = (b) => {
    const slot = b.parkingSlot || {};
    return {
      id: b._id || b.id,
      slotNumber: slot.slotNumber || b.slotNumber || "Unknown",
      location: slot.location || b.location || "Unknown Location",
      pricePerHour: slot.pricePerHour || b.pricePerHour || 0,
      date: b.date || (b.startTime ? new Date(b.startTime).toLocaleDateString() : "2026-06-10"),
      startTime: b.startTime ? (b.startTime.includes("T") ? new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : b.startTime) : "09:00",
      endTime: b.endTime ? (b.endTime.includes("T") ? new Date(b.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : b.endTime) : "13:00",
    };
  };

  return (
    <div className={`fd-auto-layout-h fd-w-full fd-h-full ${isLow ? "fidelity-low" : "fidelity-high"}`}>
      {/* PERSISTENT LEFT-HAND SIDEBAR NAVIGATION */}
      <aside className="fd-sidebar fd-auto-layout-v fd-justify-between fd-flex-none">
        <div className="fd-auto-layout-v fd-gap-md" style={{ width: "100%" }}>
          {/* Logo / Header block */}
          <div className="fd-sidebar-header fd-auto-layout-v fd-align-center fd-gap-xs" style={{ padding: "12px 0" }}>
            {isLow ? (
              <div className="fd-logo-icon" />
            ) : (
              <div className="fd-logo-icon">
                <Car size={16} />
              </div>
            )}
            <span className="fd-logo-text" style={{ fontSize: "10px" }}>{isLow ? "PARK" : "Park"}</span>
          </div>

          {/* Navigation Links */}
          <nav style={{ width: "100%" }}>
            <ul className="fd-auto-layout-v fd-gap-xs" style={{ listStyle: "none", padding: 0, margin: 0, alignItems: "center" }}>
              <li>
                <div
                  onClick={() => onTabChange("dashboard")}
                  className={`fd-nav-item ${activeTab === "dashboard" ? "active" : ""} fd-hotspot`}
                >
                  {isLow ? <div className="fd-icon-placeholder" /> : <Car size={18} />}
                  <span>{isLow ? "SLOTS" : "Slots"}</span>
                </div>
              </li>
              <li>
                <div
                  onClick={() => onTabChange("bookings")}
                  className={`fd-nav-item ${activeTab === "bookings" ? "active" : ""} fd-hotspot`}
                >
                  {isLow ? <div className="fd-icon-placeholder" /> : <Calendar size={18} />}
                  <span>{isLow ? "BOOK" : "Bookings"}</span>
                </div>
              </li>
              <li>
                <div
                  onClick={() => onTabChange("admin")}
                  className={`fd-nav-item ${activeTab === "admin" ? "active" : ""} fd-hotspot`}
                >
                  {isLow ? <div className="fd-icon-placeholder" /> : <Shield size={18} />}
                  <span>{isLow ? "ADMIN" : "Admin"}</span>
                </div>
              </li>
            </ul>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div style={{ borderTop: isLow ? "2px solid #555" : "1px solid #1e293b", width: "100%", display: "flex", justifyContent: "center", paddingTop: "12px" }}>
          <div className="fd-nav-item" style={{ color: isLow ? "#000" : "#ef4444", height: "auto" }}>
            {isLow ? <div className="fd-icon-placeholder" /> : <LogOut size={16} />}
            <span style={{ fontSize: "8px" }}>{isLow ? "EXIT" : "Exit"}</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="fd-flex-1 fd-auto-layout-v fd-p-md" style={{ overflowY: "auto", background: isLow ? "#fff" : "#f8fafc" }}>
        {/* Header Section */}
        <div className="fd-auto-layout-v fd-gap-xs" style={{ marginBottom: "16px" }}>
          <h1 style={{ margin: 0, fontSize: isLow ? "18px" : "20px", fontWeight: 700 }}>
            {isLow ? "MY BOOKINGS" : "My Bookings"}
          </h1>
          {isLow ? (
            <div className="fd-auto-layout-v fd-gap-xs" style={{ marginTop: "2px" }}>
              <span className="fd-text-placeholder w-lg" style={{ height: "8px" }} />
            </div>
          ) : (
            <p style={{ margin: 0, color: "#64748b", fontSize: "11px" }}>
              Manage active parking reservations.
            </p>
          )}
        </div>

        {/* Bookings List (Single Column Mobile Cards) */}
        <div className="fd-auto-layout-v fd-gap-md fd-w-full" style={{ paddingBottom: "24px" }}>
          {bookings.map((b, index) => {
            const booking = getBookingDetails(b);
            return (
              <div key={booking.id} className="fd-card fd-auto-layout-v fd-gap-sm">
                <div className="fd-auto-layout-h fd-justify-between fd-align-center fd-w-full">
                  <span style={{ fontWeight: 700, fontSize: "15px" }}>
                    {isLow ? `SLOT ${booking.slotNumber}` : `Slot ${booking.slotNumber}`}
                  </span>
                  <span style={{ fontWeight: 600, fontSize: "12px" }}>
                    ${booking.pricePerHour}/hr
                  </span>
                </div>

                {isLow ? (
                  <div className="fd-auto-layout-v fd-gap-xs" style={{ margin: "4px 0" }}>
                    <div className="fd-text-placeholder w-lg" style={{ height: "8px" }} />
                    <div className="fd-text-placeholder w-md" style={{ height: "8px" }} />
                  </div>
                ) : (
                  <div className="fd-auto-layout-v fd-gap-xs" style={{ fontSize: "11px", color: "#64748b", margin: "4px 0" }}>
                    <div className="fd-auto-layout-h fd-align-center fd-gap-xs">
                      <MapPin size={12} />
                      <span>{booking.location.replace("Floor - ", "")}</span>
                    </div>
                    <div className="fd-auto-layout-h fd-align-center fd-gap-xs">
                      <Calendar size={12} />
                      <span>{booking.date}</span>
                    </div>
                    <div className="fd-auto-layout-h fd-align-center fd-gap-xs">
                      <Clock size={12} />
                      <span>{booking.startTime} - {booking.endTime}</span>
                    </div>
                  </div>
                )}

                <div className="fd-auto-layout-h fd-gap-xs fd-w-full" style={{ marginTop: "4px" }}>
                  <button
                    onClick={() => onEditTime(b)}
                    className="fd-btn-secondary fd-flex-1"
                    style={{ padding: "8px 10px", fontSize: "11px" }}
                  >
                    {isLow ? "EDIT" : "Edit Time"}
                  </button>
                  <button
                    onClick={() => onCancelBooking(booking.id)}
                    className={`fd-btn-danger fd-flex-1 ${index === 0 ? "fd-hotspot" : ""}`}
                    style={{ padding: "8px 10px", fontSize: "11px" }}
                  >
                    {isLow ? "CANCEL" : "Cancel"}
                  </button>
                </div>
              </div>
            );
          })}

          {bookings.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "30px",
                color: "#64748b",
                border: isLow ? "2px dashed #555" : "1px dashed #e2e8f0",
                background: isLow ? "#f5f5f5" : "#ffffff",
                fontSize: "12px"
              }}
            >
              {isLow ? "NO ACTIVE RESERVATIONS" : "No active parking reservations."}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
