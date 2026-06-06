import React from "react";
import { Car, Calendar, Shield, LogOut, MapPin, DollarSign } from "lucide-react";

export function FigmaUserDashboard({
  slots,
  fidelityMode,
  activeTab,
  onTabChange,
  onBookNow,
}) {
  const isLow = fidelityMode === "low";
  const availableSlots = slots.filter((slot) => slot.isAvailable);

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
            {isLow ? "AVAILABLE SLOTS" : "Available Slots"}
          </h1>
          {isLow ? (
            <div className="fd-auto-layout-v fd-gap-xs" style={{ marginTop: "2px" }}>
              <span className="fd-text-placeholder w-lg" style={{ height: "8px" }} />
            </div>
          ) : (
            <p style={{ margin: 0, color: "#64748b", fontSize: "11px" }}>
              Book parking spaces in real-time.
            </p>
          )}
        </div>

        {/* Slots List (Single Column) */}
        <div className="fd-auto-layout-v fd-gap-md fd-w-full" style={{ paddingBottom: "24px" }}>
          {availableSlots.map((slot, index) => (
            <div key={slot._id || slot.id} className="fd-card fd-auto-layout-v fd-gap-sm">
              {/* Card Title & Location */}
              <div className="fd-auto-layout-h fd-justify-between fd-align-start fd-w-full">
                <div className="fd-auto-layout-v fd-gap-xs">
                  <h3 style={{ margin: 0, fontSize: isLow ? "15px" : "16px", fontWeight: 700 }}>
                    {isLow ? `SLOT ${slot.slotNumber}` : `Slot ${slot.slotNumber}`}
                  </h3>
                  
                  {isLow ? (
                    <div className="fd-auto-layout-h fd-align-center fd-gap-xs">
                      <div className="fd-icon-placeholder" />
                      <div className="fd-text-placeholder w-md" style={{ height: "8px" }} />
                    </div>
                  ) : (
                    <div className="fd-auto-layout-h fd-align-center fd-gap-xs" style={{ color: "#64748b", fontSize: "11px" }}>
                      <MapPin size={12} />
                      <span>{slot.location.replace("Floor - ", "")}</span>
                    </div>
                  )}
                </div>

                {/* Status Badge */}
                <div>
                  <span className="fd-badge-available">
                    {isLow ? "AVAIL" : "Available"}
                  </span>
                </div>
              </div>

              {/* Price Details */}
              <div
                className="fd-auto-layout-h fd-align-center fd-gap-sm"
                style={{
                  padding: "8px 12px",
                  background: isLow ? "#ffffff" : "#f1f5f9",
                  border: isLow ? "2px solid #555" : "none",
                  borderRadius: isLow ? "0px" : "6px",
                }}
              >
                {isLow ? (
                  <>
                    <div className="fd-icon-placeholder" />
                    <span style={{ fontWeight: "bold", fontSize: "12px" }}>${slot.pricePerHour}/HR</span>
                  </>
                ) : (
                  <>
                    <DollarSign size={14} style={{ color: "#4f46e5" }} />
                    <span style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b" }}>
                      ${slot.pricePerHour}
                    </span>
                    <span style={{ color: "#64748b", fontSize: "12px" }}>/ hr</span>
                  </>
                )}
              </div>

              {/* Booking Action Button */}
              <button
                onClick={() => onBookNow(slot)}
                className={`fd-btn-primary fd-w-full ${index === 0 ? "fd-hotspot" : ""}`}
                style={{ marginTop: "8px" }}
              >
                {isLow ? "BOOK NOW" : "Book Now"}
              </button>
            </div>
          ))}

          {availableSlots.length === 0 && (
            <div
              className="fd-w-full fd-auto-layout-v fd-align-center fd-justify-center"
              style={{
                gridColumn: "1 / -1",
                padding: "60px",
                border: isLow ? "2px dashed #555" : "1px dashed #e2e8f0",
                background: isLow ? "#f5f5f5" : "#ffffff",
                borderRadius: isLow ? "0" : "12px",
                textAlign: "center",
              }}
            >
              {isLow ? (
                <>
                  <div className="fd-icon-placeholder" style={{ width: "40px", height: "40px", marginBottom: "16px" }} />
                  <div className="fd-text-placeholder w-lg" style={{ marginBottom: "8px" }} />
                  <div className="fd-text-placeholder w-md" />
                </>
              ) : (
                <>
                  <Car size={40} style={{ color: "#cbd5e1", marginBottom: "16px" }} />
                  <h3 style={{ margin: "0 0 8px 0", color: "#1e293b" }}>No Slots Available</h3>
                  <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
                    All parking spaces are currently occupied. Check back later!
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
