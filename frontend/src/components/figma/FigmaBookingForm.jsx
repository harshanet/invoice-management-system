import React, { useState } from "react";
import { X, Calendar, Clock, DollarSign } from "lucide-react";

export function FigmaBookingForm({
  slot,
  fidelityMode,
  onClose,
  onConfirm,
}) {
  const isLow = fidelityMode === "low";
  
  const [date, setDate] = useState("2026-06-10");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("13:00");

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({ date, startTime, endTime });
  };

  return (
    <div className={`fd-modal-overlay fd-w-full fd-h-full ${isLow ? "fidelity-low" : "fidelity-high"}`}
         style={{
           position: "absolute",
           top: 0,
           left: 0,
           zIndex: 100,
           display: "flex",
           alignItems: "center",
           justifyContent: "center",
           padding: "24px"
         }}>
      
      {/* Modal Container */}
      <div className="fd-modal fd-auto-layout-v fd-w-full" style={{ maxWidth: "480px" }}>
        
        {/* Wireframe inner dashed box helper */}
        <div className={isLow ? "fd-modal-inner fd-auto-layout-v fd-gap-md" : "fd-auto-layout-v"}>
          
          {/* Modal Header */}
          <div className="fd-auto-layout-h fd-justify-between fd-align-center fd-w-full"
               style={{
                 paddingBottom: "16px",
                 borderBottom: isLow ? "2px dashed #555" : "1px solid #e2e8f0",
                 marginBottom: "20px"
               }}>
            <h2 style={{ margin: 0, fontSize: isLow ? "18px" : "20px", fontWeight: 700 }}>
              {isLow ? "BOOK PARKING SLOT" : "Book Parking Slot"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isLow ? "#000" : "#64748b"
              }}
            >
              {isLow ? <div className="fd-icon-placeholder" /> : <X size={20} />}
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="fd-auto-layout-v fd-gap-md fd-w-full">
            
            {/* Slot Info Summary */}
            <div className="fd-auto-layout-v fd-gap-xs"
                 style={{
                   padding: "16px",
                   backgroundColor: isLow ? "#ffffff" : "#f0fdf4",
                   border: isLow ? "2px solid #555" : "1px solid #bbf7d0",
                   borderRadius: isLow ? "0" : "10px"
                 }}>
              <div className="fd-auto-layout-h fd-justify-between fd-align-center fd-w-full">
                <div className="fd-auto-layout-v fd-gap-xs">
                  <span style={{ fontWeight: 700, fontSize: isLow ? "15px" : "16px" }}>
                    {isLow ? `SLOT ${slot.slotNumber}` : `Slot ${slot.slotNumber}`}
                  </span>
                  
                  {isLow ? (
                    <div className="fd-text-placeholder w-lg" style={{ height: "8px" }} />
                  ) : (
                    <span style={{ fontSize: "13px", color: "#64748b" }}>{slot.location}</span>
                  )}
                </div>
                
                <div className="fd-auto-layout-v fd-align-end">
                  <span style={{ fontSize: isLow ? "16px" : "18px", fontWeight: 800, color: isLow ? "#000" : "#10b981" }}>
                    ${slot.pricePerHour}/hr
                  </span>
                </div>
              </div>
            </div>

            {/* Inputs Group */}
            <div className="fd-auto-layout-v fd-gap-sm fd-w-full">
              
              {/* Date Input */}
              <div className="fd-auto-layout-v fd-gap-xs fd-w-full">
                <label style={{ fontSize: "13px", fontWeight: 700, textTransform: isLow ? "uppercase" : "none" }}>
                  {isLow ? "SELECT DATE" : "Select Date"}
                </label>
                <div className="fd-auto-layout-h fd-align-center fd-w-full" style={{ position: "relative" }}>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="fd-input"
                    required
                  />
                  {!isLow && (
                    <Calendar size={16} style={{ position: "absolute", right: "16px", color: "#64748b", pointerEvents: "none" }} />
                  )}
                </div>
              </div>

              {/* Start & End Time Inputs */}
              <div className="fd-auto-layout-h fd-gap-sm fd-w-full">
                
                {/* Start Time */}
                <div className="fd-auto-layout-v fd-gap-xs fd-flex-1">
                  <label style={{ fontSize: "13px", fontWeight: 700, textTransform: isLow ? "uppercase" : "none" }}>
                    {isLow ? "START TIME" : "Start Time"}
                  </label>
                  <div className="fd-auto-layout-h fd-align-center fd-w-full" style={{ position: "relative" }}>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="fd-input"
                      required
                    />
                    {!isLow && (
                      <Clock size={16} style={{ position: "absolute", right: "16px", color: "#64748b", pointerEvents: "none" }} />
                    )}
                  </div>
                </div>

                {/* End Time */}
                <div className="fd-auto-layout-v fd-gap-xs fd-flex-1">
                  <label style={{ fontSize: "13px", fontWeight: 700, textTransform: isLow ? "uppercase" : "none" }}>
                    {isLow ? "END TIME" : "End Time"}
                  </label>
                  <div className="fd-auto-layout-h fd-align-center fd-w-full" style={{ position: "relative" }}>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="fd-input"
                      required
                    />
                    {!isLow && (
                      <Clock size={16} style={{ position: "absolute", right: "16px", color: "#64748b", pointerEvents: "none" }} />
                    )}
                  </div>
                </div>

              </div>

            </div>

            {/* Price Calculations */}
            <div className="fd-auto-layout-h fd-justify-between fd-align-center fd-w-full"
                 style={{
                   padding: "12px 0",
                   borderTop: isLow ? "2px dashed #555" : "1px solid #e2e8f0",
                   marginTop: "8px"
                 }}>
              <span style={{ fontSize: "14px", fontWeight: 600 }}>
                {isLow ? "ESTIMATED TOTAL" : "Estimated Total (4 Hours)"}
              </span>
              <span style={{ fontSize: "18px", fontWeight: 800 }}>
                ${slot.pricePerHour * 4}.00
              </span>
            </div>

            {/* Form Actions */}
            <div className="fd-auto-layout-h fd-gap-sm fd-w-full fd-align-center" style={{ marginTop: "12px" }}>
              <button
                type="submit"
                className="fd-btn-primary fd-flex-1 fd-hotspot"
              >
                {isLow ? "CONFIRM BOOKING" : "Confirm Booking"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="fd-btn-secondary"
              >
                {isLow ? "CANCEL" : "Cancel"}
              </button>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
}
