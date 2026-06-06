import React from "react";
import { Car, Calendar, Shield, LogOut, Plus } from "lucide-react";

export function FigmaAdminPanel({
  slots,
  fidelityMode,
  activeTab,
  onTabChange,
  onAddSlot,
  onEditSlot,
  onDeleteSlot,
}) {
  const isLow = fidelityMode === "low";

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
        
        {/* Header Action Row */}
        <div className="fd-auto-layout-v fd-gap-sm fd-w-full" style={{ marginBottom: "20px" }}>
          <div className="fd-auto-layout-v fd-gap-xs">
            <h1 style={{ margin: 0, fontSize: isLow ? "18px" : "20px", fontWeight: 700 }}>
              {isLow ? "ADMIN PANEL" : "Admin Panel"}
            </h1>
            {isLow ? (
              <span className="fd-text-placeholder w-lg" style={{ height: "8px" }} />
            ) : (
              <p style={{ margin: 0, color: "#64748b", fontSize: "11px" }}>
                Manage system parking slots.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onAddSlot}
            className="fd-btn-primary fd-auto-layout-h fd-align-center fd-gap-xs fd-w-full fd-justify-center"
            style={{ padding: "8px 12px", fontSize: "12px" }}
          >
            {isLow ? <div className="fd-icon-placeholder" /> : <Plus size={14} />}
            <span>{isLow ? "ADD NEW SLOT" : "Add New Slot"}</span>
          </button>
        </div>

        {/* Slots Cards List (Mobile Layout) */}
        <div className="fd-auto-layout-v fd-gap-md fd-w-full" style={{ paddingBottom: "24px" }}>
          {slots.map((slot) => (
            <div key={slot._id || slot.id} className="fd-card fd-auto-layout-v fd-gap-sm">
              <div className="fd-auto-layout-h fd-justify-between fd-align-center fd-w-full">
                <span style={{ fontWeight: 700, fontSize: "15px" }}>
                  {isLow ? `SLOT ${slot.slotNumber}` : `Slot ${slot.slotNumber}`}
                </span>
                
                {slot.isAvailable ? (
                  <span className="fd-badge-available">
                    {isLow ? "AVAIL" : "Available"}
                  </span>
                ) : (
                  <span className="fd-badge-occupied">
                    {isLow ? "OCCUPIED" : "Occupied"}
                  </span>
                )}
              </div>

              {isLow ? (
                <div className="fd-text-placeholder w-lg" style={{ height: "8px", margin: "4px 0" }} />
              ) : (
                <div style={{ fontSize: "11px", color: "#64748b", margin: "4px 0" }}>
                  <span>Location: {slot.location.replace("Floor - ", "")}</span>
                  <span style={{ marginLeft: "12px", fontWeight: "bold" }}>${slot.pricePerHour}/hr</span>
                </div>
              )}

              <div className="fd-auto-layout-h fd-gap-xs fd-w-full" style={{ marginTop: "4px" }}>
                <button
                  type="button"
                  onClick={() => onEditSlot(slot)}
                  className="fd-btn-secondary fd-flex-1"
                  style={{ padding: "8px 10px", fontSize: "11px" }}
                >
                  {isLow ? "EDIT" : "Edit"}
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteSlot(slot._id || slot.id)}
                  className="fd-btn-danger fd-flex-1"
                  style={{ padding: "8px 10px", fontSize: "11px" }}
                >
                  {isLow ? "DELETE" : "Delete"}
                </button>
              </div>
            </div>
          ))}

          {slots.length === 0 && (
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
              {isLow ? "NO SLOTS DEFINED" : "No parking slots."}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
