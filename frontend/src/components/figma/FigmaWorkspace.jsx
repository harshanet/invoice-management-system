import React, { useState, useEffect, useRef } from "react";
import { 
  Play, ZoomIn, ZoomOut, Maximize2, MousePointer, 
  Layers, Square, Type, Image as ImageIcon, CheckCircle, AlertCircle, Plus, Edit2, Trash2, X
} from "lucide-react";
import axiosInstance from "../../axiosConfig";
import { useAuth } from "../../context/AuthContext";
import { FigmaUserDashboard } from "./FigmaUserDashboard";
import { FigmaBookingForm } from "./FigmaBookingForm";
import { FigmaMyBookings } from "./FigmaMyBookings";
import { FigmaAdminPanel } from "./FigmaAdminPanel";

// Mock Fallback Data (used when not logged in to Node.js backend)
const initialMockSlots = [
  { id: "slot_1", slotNumber: "Slot A-101", location: "Ground Floor - North Wing", pricePerHour: 5, isAvailable: true },
  { id: "slot_2", slotNumber: "Slot A-102", location: "Ground Floor - North Wing", pricePerHour: 5, isAvailable: true },
  { id: "slot_3", slotNumber: "Slot B-201", location: "First Floor - South Wing", pricePerHour: 7, isAvailable: true },
  { id: "slot_4", slotNumber: "Slot B-202", location: "First Floor - South Wing", pricePerHour: 7, isAvailable: true },
];

const initialMockBookings = [
  { id: "b_1", slotNumber: "Slot A-103", location: "Ground Floor - North Wing", date: "2026-06-08", startTime: "09:00 AM", endTime: "05:00 PM", pricePerHour: 5, status: "active" },
  { id: "b_2", slotNumber: "Slot C-302", location: "Second Floor - Premium", date: "2026-06-09", startTime: "08:00 AM", endTime: "12:00 PM", pricePerHour: 10, status: "active" }
];

export default function FigmaWorkspace() {
  const { user } = useAuth();
  
  // Shared States
  const [slots, setSlots] = useState(initialMockSlots);
  const [bookings, setBookings] = useState([]);
  
  // Design View States
  const [fidelityMode, setFidelityMode] = useState("high");
  const [viewMode, setViewMode] = useState("canvas");
  const [activeLayer, setActiveLayer] = useState("dashboard");
  const [showPrototypeWires, setShowPrototypeWires] = useState(false);
  const [zoomScale, setZoomScale] = useState(0.85);

  // Interaction States
  const [selectedSlotForBooking, setSelectedSlotForBooking] = useState(null);
  const [toastNotification, setToastNotification] = useState(null);
  
  // Admin Modals
  const [adminAddOpen, setAdminAddOpen] = useState(false);
  const [adminEditSlot, setAdminEditSlot] = useState(null);

  // Canvas Panning State (Figma Hand Tool)
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const canvasRef = useRef(null);

  // Headers for authenticated calls
  const getHeaders = () => {
    return user && user.token ? { headers: { Authorization: `Bearer ${user.token}` } } : {};
  };

  // Fetch Slots and Bookings from Backend (if user is logged in)
  const loadBackendData = async () => {
    if (!user) {
      setSlots(initialMockSlots);
      setBookings(initialMockBookings);
      return;
    }
    try {
      // Users read available slots, Admins read all slots
      const isAdmin = user.email && user.email.includes("admin"); // simple admin check for prototype
      const endpoint = isAdmin ? "/api/slots" : "/api/slots/available";
      const slotsRes = await axiosInstance.get(endpoint, getHeaders());
      
      // If admin endpoint returned occupied slots too, merge availability
      setSlots(slotsRes.data);

      const bookingsRes = await axiosInstance.get("/api/bookings", getHeaders());
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error("Error loading MERN data, falling back to memory:", error);
      setToastNotification({
        message: "Backend Offline",
        desc: "Falling back to local mock data. Please run your Node.js backend on Port 5001."
      });
    }
  };

  useEffect(() => {
    loadBackendData();
  }, [user]);

  // Auto-hide toast notification
  useEffect(() => {
    if (toastNotification) {
      const timer = setTimeout(() => {
        setToastNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toastNotification]);

  // Drag handlers
  const handleMouseDown = (e) => {
    const target = e.target;
    if (
      target.closest(".figma-frame-wrapper") || 
      target.closest(".figma-top-bar") || 
      target.closest(".figma-layers-sidebar") || 
      target.closest(".fd-modal") ||
      target.closest(".figma-pill-selector")
    ) {
      return;
    }
    setIsDragging(true);
    setStartX(e.pageX - (canvasRef.current?.offsetLeft || 0));
    setStartY(e.pageY - (canvasRef.current?.offsetTop || 0));
    setScrollLeft(canvasRef.current?.scrollLeft || 0);
    setScrollTop(canvasRef.current?.scrollTop || 0);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !canvasRef.current) return;
    e.preventDefault();
    const x = e.pageX - canvasRef.current.offsetLeft;
    const y = e.pageY - canvasRef.current.offsetTop;
    const walkX = (x - startX) * 1.5;
    const walkY = (y - startY) * 1.5;
    canvasRef.current.scrollLeft = scrollLeft - walkX;
    canvasRef.current.scrollTop = scrollTop - walkY;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle Book Now click
  const handleBookNow = (slot) => {
    setSelectedSlotForBooking(slot);
  };

  // Confirm booking
  const handleConfirmBooking = async (details) => {
    if (!selectedSlotForBooking) return;
    const slotId = selectedSlotForBooking._id || selectedSlotForBooking.id;

    if (!user) {
      // Local Memory mock fallback
      const newBooking = {
        id: "b_new_" + Date.now(),
        slotNumber: selectedSlotForBooking.slotNumber,
        location: selectedSlotForBooking.location,
        date: details.date,
        startTime: details.startTime,
        endTime: details.endTime,
        pricePerHour: selectedSlotForBooking.pricePerHour,
        status: "active",
      };
      setBookings([newBooking, ...bookings]);
      setSlots(slots.map(s => s.id === slotId ? { ...s, isAvailable: false } : s));
      setSelectedSlotForBooking(null);
      if (viewMode === "canvas") setActiveLayer("bookings");
      setToastNotification({
        message: fidelityMode === "low" ? "BOOKING CONFIRMED" : "Booking Confirmed Successfully!",
        desc: fidelityMode === "low" ? `SLOT ${selectedSlotForBooking.slotNumber}` : `Slot ${selectedSlotForBooking.slotNumber} reserved successfully (Local Sandbox Mode).`
      });
      return;
    }

    try {
      // Calculate Date ISO starts/ends
      const startDateTime = new Date(`${details.date}T${details.startTime}:00`);
      const endDateTime = new Date(`${details.date}T${details.endTime}:00`);

      await axiosInstance.post("/api/bookings", {
        parkingSlotId: slotId,
        startTime: startDateTime,
        endTime: endDateTime
      }, getHeaders());

      await loadBackendData();
      setSelectedSlotForBooking(null);
      if (viewMode === "canvas") setActiveLayer("bookings");

      setToastNotification({
        message: "Booking Saved",
        desc: `Slot ${selectedSlotForBooking.slotNumber} reserved successfully on MongoDB.`
      });
    } catch (error) {
      alert(error.response?.data?.message || "Booking failed.");
    }
  };

  // Cancel Booking
  const handleCancelBooking = async (bookingId) => {
    if (!user) {
      // Memory Fallback cancel
      const bookingToCancel = bookings.find(b => b.id === bookingId);
      if (!bookingToCancel) return;
      setBookings(bookings.filter(b => b.id !== bookingId));
      setSlots(slots.map(s => s.slotNumber === bookingToCancel.slotNumber ? { ...s, isAvailable: true } : s));
      if (viewMode === "canvas") setActiveLayer("dashboard");
      setToastNotification({
        message: "Booking Cancelled",
        desc: `Reservation removed from local memory.`
      });
      return;
    }

    try {
      await axiosInstance.delete(`/api/bookings/${bookingId}`, getHeaders());
      await loadBackendData();
      if (viewMode === "canvas") setActiveLayer("dashboard");
      setToastNotification({
        message: "Booking Cancelled",
        desc: "Reservation cancelled and slot released on MongoDB."
      });
    } catch (error) {
      alert("Failed to cancel booking.");
    }
  };

  // Edit Booking time
  const handleEditBookingTime = async (booking) => {
    const bookingId = booking._id || booking.id;
    const currentStart = booking.startTime ? (booking.startTime.includes("T") ? booking.startTime.split("T")[1].substring(0,5) : booking.startTime) : "09:00";
    const currentEnd = booking.endTime ? (booking.endTime.includes("T") ? booking.endTime.split("T")[1].substring(0,5) : booking.endTime) : "13:00";
    
    const newStartTime = prompt("Enter new Start Time (HH:MM):", currentStart);
    const newEndTime = prompt("Enter new End Time (HH:MM):", currentEnd);
    if (!newStartTime || !newEndTime) return;

    if (!user) {
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, startTime: newStartTime, endTime: newEndTime } : b));
      setToastNotification({
        message: "Booking Updated",
        desc: `Reservation times updated in local memory.`
      });
      return;
    }

    try {
      const dateStr = booking.startTime ? booking.startTime.split("T")[0] : "2026-06-10";
      const startDateTime = new Date(`${dateStr}T${newStartTime}:00`);
      const endDateTime = new Date(`${dateStr}T${newEndTime}:00`);

      await axiosInstance.put(`/api/bookings/${bookingId}`, {
        startTime: startDateTime,
        endTime: endDateTime
      }, getHeaders());

      await loadBackendData();
      setToastNotification({
        message: "Time Updated",
        desc: "Reservation times updated on MongoDB."
      });
    } catch (error) {
      alert("Failed to update booking time.");
    }
  };

  // Add Parking Slot (Admin)
  const handleAddSlot = async (newSlot) => {
    if (!user) {
      const slot = {
        ...newSlot,
        id: "slot_" + Date.now(),
      };
      setSlots([...slots, slot]);
      setAdminAddOpen(false);
      setToastNotification({
        message: "Slot Added",
        desc: `New slot created in local memory.`
      });
      return;
    }

    try {
      // Include admin default role headers
      await axiosInstance.post("/api/slots", newSlot, getHeaders());
      await loadBackendData();
      setAdminAddOpen(false);
      setToastNotification({
        message: "Slot Created",
        desc: `Parking slot ${newSlot.slotNumber} added to MongoDB.`
      });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create slot.");
    }
  };

  // Edit Parking Slot (Admin)
  const handleEditSlot = async (updatedSlot) => {
    const slotId = updatedSlot._id || updatedSlot.id;
    if (!user) {
      setSlots(slots.map(s => s.id === slotId ? updatedSlot : s));
      setAdminEditSlot(null);
      setToastNotification({
        message: "Slot Updated",
        desc: `Slot values saved to local memory.`
      });
      return;
    }

    try {
      await axiosInstance.put(`/api/slots/${slotId}`, updatedSlot, getHeaders());
      await loadBackendData();
      setAdminEditSlot(null);
      setToastNotification({
        message: "Slot Updated",
        desc: `Slot details saved on MongoDB.`
      });
    } catch (error) {
      alert("Failed to update slot.");
    }
  };

  // Delete Parking Slot (Admin)
  const handleDeleteSlot = async (slotId) => {
    if (!user) {
      setSlots(slots.filter(s => s.id !== slotId));
      setToastNotification({
        message: "Slot Deleted",
        desc: `Parking slot deleted from local memory.`
      });
      return;
    }

    try {
      await axiosInstance.delete(`/api/slots/${slotId}`, getHeaders());
      await loadBackendData();
      setToastNotification({
        message: "Slot Removed",
        desc: "Parking slot and associated bookings deleted from MongoDB."
      });
    } catch (error) {
      alert("Failed to delete slot.");
    }
  };

  const isLow = fidelityMode === "low";

  return (
    <div className="figma-app">
      {/* FIGMA TOP BAR */}
      <header className="figma-top-bar">
        <div className="figma-top-bar-left">
          <div className="figma-logo">
            <span style={{ color: "#f24e1e" }}>F</span>
            <span style={{ color: "#a259ff" }}>i</span>
            <span style={{ color: "#1abc9c" }}>g</span>
            <span style={{ color: "#0acf83" }}>m</span>
            <span style={{ color: "#ff7262" }}>a</span>
          </div>
          <div className="figma-tools">
            <button type="button" className="figma-tool-btn active">
              <MousePointer size={14} />
            </button>
            <button type="button" className="figma-tool-btn">
              <Layers size={14} />
            </button>
            <button type="button" className="figma-tool-btn">
              <Square size={14} />
            </button>
            <button type="button" className="figma-tool-btn">
              <Type size={14} />
            </button>
            <button type="button" className="figma-tool-btn">
              <ImageIcon size={14} />
            </button>
          </div>
        </div>

        <div className="figma-top-bar-center">
          <div className="figma-title">
            Parking Slot Booking System - Prototype Canvas
          </div>
        </div>

        <div className="figma-top-bar-right">
          {/* Fidelity Mode Toggle */}
          <div className="figma-pill-selector">
            <button 
              type="button"
              className={`figma-pill-btn ${fidelityMode === "high" ? "active" : ""}`}
              onClick={() => setFidelityMode("high")}
            >
              High-Fidelity
            </button>
            <button 
              type="button"
              className={`figma-pill-btn wireframe ${fidelityMode === "low" ? "active" : ""}`}
              onClick={() => setFidelityMode("low")}
            >
              Low-Fidelity (Wireframe)
            </button>
          </div>

          {/* Prototype Wires Toggle */}
          <div className="figma-pill-selector">
            <button 
              type="button"
              className={`figma-pill-btn ${showPrototypeWires ? "active" : ""}`}
              onClick={() => setShowPrototypeWires(!showPrototypeWires)}
            >
              Prototype Wires
            </button>
          </div>

          {/* View Mode Switcher */}
          <div className="figma-pill-selector">
            <button 
              type="button"
              className={`figma-pill-btn ${viewMode === "canvas" ? "active" : ""}`}
              onClick={() => {
                setViewMode("canvas");
                if (activeLayer === "bookingForm") setActiveLayer("dashboard");
              }}
            >
              Single Frame
            </button>
            <button 
              type="button"
              className={`figma-pill-btn ${viewMode === "showcase" ? "active" : ""}`}
              onClick={() => setViewMode("showcase")}
            >
              Showcase Board (All Screens)
            </button>
          </div>

          {/* Zoom Slider Controls */}
          <div className="figma-pill-selector" style={{ gap: "4px", padding: "3px 8px", alignItems: "center" }}>
            <span style={{ color: "#8c8c8c", fontSize: "10px", fontWeight: "700", marginRight: "2px" }}>ZOOM</span>
            <button 
              type="button"
              className="figma-pill-btn" 
              style={{ padding: "2px 6px", minWidth: "20px" }}
              onClick={() => setZoomScale(Math.max(0.25, zoomScale - 0.1))}
            >
              -
            </button>
            <span style={{ color: "#fff", fontSize: "11px", minWidth: "36px", textAlign: "center", fontWeight: "bold" }}>
              {Math.round(zoomScale * 100)}%
            </span>
            <button 
              type="button"
              className="figma-pill-btn" 
              style={{ padding: "2px 6px", minWidth: "20px" }}
              onClick={() => setZoomScale(Math.min(1.5, zoomScale + 0.1))}
            >
              +
            </button>
            <button 
              type="button"
              className="figma-pill-btn" 
              style={{ padding: "2px 4px", fontSize: "9px" }}
              onClick={() => setZoomScale(0.85)}
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      {/* WORKSPACE CONTENT AREA */}
      <div className="figma-workspace">
        
        {/* LAYERS EXPLORER (SIDEBAR) */}
        <aside className="figma-layers-sidebar">
          <div className="figma-sidebar-header">
            <span>Layers & Frames</span>
            <Layers size={12} />
          </div>
          
          <ul className="figma-layers-list">
            <li 
              className={`figma-layer-item ${viewMode === "canvas" && activeLayer === "dashboard" ? "active" : ""} ${isLow ? "wireframe" : ""}`}
              onClick={() => {
                setViewMode("canvas");
                setActiveLayer("dashboard");
              }}
            >
              <div className="figma-layer-icon">#</div>
              <span>User Dashboard</span>
            </li>
            <li 
              className={`figma-layer-item ${viewMode === "canvas" && activeLayer === "bookingForm" ? "active" : ""} ${isLow ? "wireframe" : ""}`}
              onClick={() => {
                setViewMode("canvas");
                setActiveLayer("bookingForm");
                if (!selectedSlotForBooking && slots.length > 0) setSelectedSlotForBooking(slots[0]);
              }}
            >
              <div className="figma-layer-icon">#</div>
              <span>Booking Form Modal</span>
            </li>
            <li 
              className={`figma-layer-item ${viewMode === "canvas" && activeLayer === "bookings" ? "active" : ""} ${isLow ? "wireframe" : ""}`}
              onClick={() => {
                setViewMode("canvas");
                setActiveLayer("bookings");
              }}
            >
              <div className="figma-layer-icon">#</div>
              <span>My Bookings</span>
            </li>
            <li 
              className={`figma-layer-item ${viewMode === "canvas" && activeLayer === "admin" ? "active" : ""} ${isLow ? "wireframe" : ""}`}
              onClick={() => {
                setViewMode("canvas");
                setActiveLayer("admin");
              }}
            >
              <div className="figma-layer-icon">#</div>
              <span>Admin Panel</span>
            </li>
          </ul>

          <div className="figma-sidebar-header" style={{ marginTop: "20px" }}>
            <span>MERN Status</span>
          </div>
          <div style={{ padding: "12px 16px", color: "#8c8c8c", lineHeight: "1.5" }}>
            <p style={{ margin: "0 0 8px 0" }}>
              <strong>User:</strong> {user ? user.name : "Guest (Sandbox)"}
            </p>
            <p style={{ margin: "0 0 8px 0" }}>
              <strong>Role:</strong> {user ? (user.email && user.email.includes("admin") ? "Admin" : "User") : "Guest"}
            </p>
            <p style={{ margin: 0, fontSize: "11px", color: user ? "#10b981" : "#eab308" }}>
              {user ? "Connected to Express Backend" : "Log in via Navbar for live DB"}
            </p>
          </div>
        </aside>

        {/* FIGMA EDITOR CANVAS WORKSPACE */}
        <main 
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`figma-canvas-area ${viewMode === "showcase" ? "showcase-mode fixed-layout" : ""} ${showPrototypeWires ? "figma-prototype-active" : ""}`}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          
          <div 
            className="figma-canvas-scaler"
            style={{ 
              transform: `scale(${zoomScale})`,
              width: viewMode === "showcase" ? "1750px" : "375px",
              height: viewMode === "showcase" ? "900px" : "800px"
            }}
          >
            {/* 1. SINGLE CANVAS PREVIEW VIEW */}
            {viewMode === "canvas" && (
              <div className="figma-frame-wrapper" style={{ margin: "50px auto" }}>
                <div className="figma-frame-label">
                  Frame: {activeLayer === "dashboard" ? "User Dashboard" :
                          activeLayer === "bookingForm" ? "Booking Form Modal" :
                          activeLayer === "bookings" ? "My Bookings" : "Admin Panel"} (375 x 800)
                </div>
              
              <div className="figma-frame-content">
                
                {/* RENDER CURRENT CANVAS LAYER */}
                {activeLayer === "dashboard" && (
                  <FigmaUserDashboard
                    slots={slots}
                    fidelityMode={fidelityMode}
                    activeTab="dashboard"
                    onTabChange={(tab) => {
                      if (tab === "bookings") setActiveLayer("bookings");
                      if (tab === "admin") setActiveLayer("admin");
                    }}
                    onBookNow={handleBookNow}
                  />
                )}

                {activeLayer === "bookingForm" && (
                  <div style={{ position: "relative", width: "100%", height: "100%" }}>
                    <FigmaUserDashboard
                      slots={slots}
                      fidelityMode={fidelityMode}
                      activeTab="dashboard"
                      onTabChange={() => {}}
                      onBookNow={() => {}}
                    />
                    <FigmaBookingForm
                      slot={selectedSlotForBooking || slots[0]}
                      fidelityMode={fidelityMode}
                      onClose={() => {
                        setActiveLayer("dashboard");
                        setSelectedSlotForBooking(null);
                      }}
                      onConfirm={handleConfirmBooking}
                    />
                  </div>
                )}

                {activeLayer === "bookings" && (
                  <FigmaMyBookings
                    bookings={bookings}
                    fidelityMode={fidelityMode}
                    activeTab="bookings"
                    onTabChange={(tab) => {
                      if (tab === "dashboard") setActiveLayer("dashboard");
                      if (tab === "admin") setActiveLayer("admin");
                    }}
                    onEditTime={handleEditBookingTime}
                    onCancelBooking={handleCancelBooking}
                  />
                )}

                {activeLayer === "admin" && (
                  <FigmaAdminPanel
                    slots={slots}
                    fidelityMode={fidelityMode}
                    activeTab="admin"
                    onTabChange={(tab) => {
                      if (tab === "dashboard") setActiveLayer("dashboard");
                      if (tab === "bookings") setActiveLayer("bookings");
                    }}
                    onAddSlot={() => setAdminAddOpen(true)}
                    onEditSlot={(slot) => setAdminEditSlot(slot)}
                    onDeleteSlot={handleDeleteSlot}
                  />
                )}

                {/* MODAL LAYER OVERLAYS (Dashboard booking click) */}
                {activeLayer === "dashboard" && selectedSlotForBooking && (
                  <FigmaBookingForm
                    slot={selectedSlotForBooking}
                    fidelityMode={fidelityMode}
                    onClose={() => setSelectedSlotForBooking(null)}
                    onConfirm={handleConfirmBooking}
                  />
                )}

              </div>
            </div>
          )}

          {/* 2. SHOWCASE BOARD VIEW (ALL 4 SCREENS SIDE-BY-SIDE) */}
          {viewMode === "showcase" && (
            <>
              {showPrototypeWires && (
                <svg className="figma-prototype-svg" style={{ position: "absolute", top: 0, left: 0, width: "1750px", height: "900px", pointerEvents: "none" }}>
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#0C8CE9" />
                    </marker>
                  </defs>
                  
                  {/* Wire 1: Dashboard Book Now (Frame 1) -> Booking Modal (Frame 2) */}
                  <path d="M 393 240 C 430 240, 450 420, 495 420" stroke="#0C8CE9" strokeWidth="2.5" strokeDasharray={isLow ? "6,6" : "none"} fill="none" markerEnd="url(#arrow)" />
                  <circle cx="393" cy="240" r="4" fill="#0C8CE9" />
                  <circle cx="393" cy="240" r="8" fill="none" stroke="#0C8CE9" strokeWidth="1.5" />
                  
                  {/* Wire 2: Bookings Sidebar Link (Frame 1) -> My Bookings Title (Frame 3) */}
                  <path d="M 122 244 C 300 244, 700 78, 988 78" stroke="#0C8CE9" strokeWidth="2.5" strokeDasharray={isLow ? "6,6" : "none"} fill="none" markerEnd="url(#arrow)" />
                  <circle cx="122" cy="244" r="4" fill="#0C8CE9" />
                  <circle cx="122" cy="244" r="8" fill="none" stroke="#0C8CE9" strokeWidth="1.5" />

                  {/* Wire 3: Confirm Booking (Frame 2) -> Bookings Sidebar (Frame 3) */}
                  <path d="M 810 600 C 850 600, 920 300, 972 244" stroke="#0C8CE9" strokeWidth="2.5" strokeDasharray={isLow ? "6,6" : "none"} fill="none" markerEnd="url(#arrow)" />
                  <circle cx="810" cy="600" r="4" fill="#0C8CE9" />
                  <circle cx="810" cy="600" r="8" fill="none" stroke="#0C8CE9" strokeWidth="1.5" />

                  {/* Wire 4: Cancel Button (Frame 3) -> Slots Sidebar (Frame 3) */}
                  <path d="M 1243 240 C 1150 240, 1050 178, 972 178" stroke="#0C8CE9" strokeWidth="2.5" strokeDasharray={isLow ? "6,6" : "none"} fill="none" markerEnd="url(#arrow)" />
                  <circle cx="1243" cy="240" r="4" fill="#0C8CE9" />
                  <circle cx="1243" cy="240" r="8" fill="none" stroke="#0C8CE9" strokeWidth="1.5" />

                  {/* Wire 5: Slots Sidebar (Frame 3) -> Slot A-101 Card (Frame 1) */}
                  <path d="M 972 178 C 800 178, 600 200, 409 200" stroke="#0C8CE9" strokeWidth="2.5" strokeDasharray={isLow ? "6,6" : "none"} fill="none" markerEnd="url(#arrow)" />
                  <circle cx="972" cy="178" r="4" fill="#0C8CE9" />
                  <circle cx="972" cy="178" r="8" fill="none" stroke="#0C8CE9" strokeWidth="1.5" />

                  {/* Wire 6: Admin Sidebar (Frame 3) -> Admin Panel Title (Frame 4) */}
                  <path d="M 972 310 C 1100 310, 1250 78, 1413 78" stroke="#0C8CE9" strokeWidth="2.5" strokeDasharray={isLow ? "6,6" : "none"} fill="none" markerEnd="url(#arrow)" />
                  <circle cx="972" cy="310" r="4" fill="#0C8CE9" />
                  <circle cx="972" cy="310" r="8" fill="none" stroke="#0C8CE9" strokeWidth="1.5" />

                  {/* Wire 7: Slots Sidebar (Frame 4) -> Dashboard Title (Frame 1) */}
                  <path d="M 1397 178 C 1100 178, 700 78, 138 78" stroke="#0C8CE9" strokeWidth="2.5" strokeDasharray={isLow ? "6,6" : "none"} fill="none" markerEnd="url(#arrow)" />
                  <circle cx="1397" cy="178" r="4" fill="#0C8CE9" />
                  <circle cx="1397" cy="178" r="8" fill="none" stroke="#0C8CE9" strokeWidth="1.5" />
                </svg>
              )}

              {/* Screen 1: User Dashboard */}
              <div className="figma-frame-wrapper fd-frame-1">
                <div className="figma-frame-label">Frame 1: User Dashboard (375 x 800)</div>
                <div className="figma-frame-content">
                  <FigmaUserDashboard
                    slots={slots}
                    fidelityMode={fidelityMode}
                    activeTab="dashboard"
                    onTabChange={() => {}}
                    onBookNow={handleBookNow}
                  />
                </div>
              </div>

              {/* Screen 2: Booking Form Modal Open */}
              <div className="figma-frame-wrapper fd-frame-2">
                <div className="figma-frame-label">Frame 2: Booking Form Modal & Success Toast (375 x 800)</div>
                <div className="figma-frame-content">
                  <div style={{ position: "relative", width: "100%", height: "100%" }}>
                    <FigmaUserDashboard
                      slots={slots}
                      fidelityMode={fidelityMode}
                      activeTab="dashboard"
                      onTabChange={() => {}}
                      onBookNow={() => {}}
                    />
                    
                    {/* Render modal open on top of dashboard */}
                    <FigmaBookingForm
                      slot={slots[0]}
                      fidelityMode={fidelityMode}
                      onClose={() => {}}
                      onConfirm={() => {}}
                    />
                  </div>
                </div>
              </div>

              {/* Screen 3: My Bookings */}
              <div className="figma-frame-wrapper fd-frame-3">
                <div className="figma-frame-label">Frame 3: My Bookings (375 x 800)</div>
                <div className="figma-frame-content">
                  <FigmaMyBookings
                    bookings={bookings}
                    fidelityMode={fidelityMode}
                    activeTab="bookings"
                    onTabChange={() => {}}
                    onEditTime={handleEditBookingTime}
                    onCancelBooking={handleCancelBooking}
                  />
                </div>
              </div>

              {/* Screen 4: Admin Panel */}
              <div className="figma-frame-wrapper fd-frame-4">
                <div className="figma-frame-label">Frame 4: Admin Panel (375 x 800)</div>
                <div className="figma-frame-content">
                  <FigmaAdminPanel
                    slots={slots}
                    fidelityMode={fidelityMode}
                    activeTab="admin"
                    onTabChange={() => {}}
                    onAddSlot={() => setAdminAddOpen(true)}
                    onEditSlot={(slot) => setAdminEditSlot(slot)}
                    onDeleteSlot={handleDeleteSlot}
                  />
                </div>
              </div>
            </>
          )}

          </div>
        </main>
      </div>

      {/* TOAST SUCCESS LAYER */}
      {toastNotification && (
        <div className={isLow ? "fidelity-low" : "fidelity-high"}
             style={{
               position: "fixed",
               bottom: "24px",
               right: "24px",
               zIndex: 999,
               pointerEvents: "auto",
               animation: "fadeIn 0.3s ease"
             }}>
          <div className="fd-toast fd-auto-layout-v fd-gap-xs">
            <div className="fd-auto-layout-h fd-align-center fd-gap-xs">
              {isLow ? (
                <div className="fd-icon-placeholder" />
              ) : (
                <CheckCircle size={16} style={{ color: "#10b981" }} />
              )}
              <span style={{ fontWeight: 800 }}>{toastNotification.message}</span>
              <button 
                type="button"
                onClick={() => setToastNotification(null)}
                style={{ marginLeft: "auto", background: "transparent", border: "none", color: isLow ? "#000" : "#94a3b8", cursor: "pointer" }}
              >
                <X size={14} />
              </button>
            </div>
            {toastNotification.desc && (
              <p style={{ margin: 0, fontSize: "12px", color: isLow ? "#555" : "#94a3b8", fontWeight: 400 }}>
                {toastNotification.desc}
              </p>
            )}
          </div>
        </div>
      )}

      {/* --- ADD SLOT MODAL (Overlay inside Figma Workspace for Admin actions) --- */}
      {adminAddOpen && (
        <div className={`fd-modal-overlay fd-w-full fd-h-full ${isLow ? "fidelity-low" : "fidelity-high"}`}
             style={{
               position: "fixed",
               top: 0,
               left: 0,
               zIndex: 999,
               display: "flex",
               alignItems: "center",
               justifyContent: "center",
               padding: "24px"
             }}>
          <div className="fd-modal fd-auto-layout-v fd-w-full" style={{ maxWidth: "440px" }}>
            <div className={isLow ? "fd-modal-inner fd-auto-layout-v fd-gap-md" : "fd-auto-layout-v fd-gap-md fd-p-md"}>
              
              {/* Header */}
              <div className="fd-auto-layout-h fd-justify-between fd-align-center fd-w-full"
                   style={{ borderBottom: isLow ? "2px dashed #555" : "1px solid #e2e8f0", paddingBottom: "12px" }}>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>
                  {isLow ? "ADD NEW PARKING SLOT" : "Add New Parking Slot"}
                </h3>
                <button type="button" onClick={() => setAdminAddOpen(false)} style={{ background: "transparent", border: "none", cursor: "pointer", color: isLow ? "#000" : "#64748b" }}>
                  {isLow ? <div className="fd-icon-placeholder" /> : <X size={18} />}
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleAddSlot({
                  slotNumber: formData.get("slotNumber"),
                  location: formData.get("location"),
                  pricePerHour: Number(formData.get("pricePerHour")),
                  isAvailable: formData.get("isAvailable") === "true",
                });
              }} className="fd-auto-layout-v fd-gap-sm">
                
                <div className="fd-auto-layout-v fd-gap-xs">
                  <label style={{ fontSize: "12px", fontWeight: 700 }}>{isLow ? "SLOT NUMBER" : "Slot Number"}</label>
                  <input type="text" name="slotNumber" defaultValue={`Slot D-${100 + slots.length}`} className="fd-input" required />
                </div>

                <div className="fd-auto-layout-v fd-gap-xs">
                  <label style={{ fontSize: "12px", fontWeight: 700 }}>{isLow ? "LOCATION" : "Location"}</label>
                  <input type="text" name="location" defaultValue="Ground Floor - East Wing" className="fd-input" required />
                </div>

                <div className="fd-auto-layout-v fd-gap-xs">
                  <label style={{ fontSize: "12px", fontWeight: 700 }}>{isLow ? "PRICE PER HOUR ($)" : "Price per Hour ($)"}</label>
                  <input type="number" name="pricePerHour" defaultValue="6" className="fd-input" required />
                </div>

                <div className="fd-auto-layout-v fd-gap-xs">
                  <label style={{ fontSize: "12px", fontWeight: 700 }}>{isLow ? "AVAILABILITY" : "Availability Status"}</label>
                  <select name="isAvailable" className="fd-input" defaultValue="true">
                    <option value="true">{isLow ? "AVAILABLE" : "Available"}</option>
                    <option value="false">{isLow ? "OCCUPIED" : "Occupied"}</option>
                  </select>
                </div>

                <div className="fd-auto-layout-h fd-gap-xs fd-justify-end fd-w-full" style={{ marginTop: "16px" }}>
                  <button type="submit" className="fd-btn-primary fd-flex-1">
                    {isLow ? "ADD SLOT" : "Add Slot"}
                  </button>
                  <button type="button" onClick={() => setAdminAddOpen(false)} className="fd-btn-secondary">
                    {isLow ? "CANCEL" : "Cancel"}
                  </button>
                </div>

              </form>

            </div>
          </div>
        </div>
      )}

      {/* --- EDIT SLOT MODAL --- */}
      {adminEditSlot && (
        <div className={`fd-modal-overlay fd-w-full fd-h-full ${isLow ? "fidelity-low" : "fidelity-high"}`}
             style={{
               position: "fixed",
               top: 0,
               left: 0,
               zIndex: 999,
               display: "flex",
               alignItems: "center",
               justifyContent: "center",
               padding: "24px"
             }}>
          <div className="fd-modal fd-auto-layout-v fd-w-full" style={{ maxWidth: "440px" }}>
            <div className={isLow ? "fd-modal-inner fd-auto-layout-v fd-gap-md" : "fd-auto-layout-v fd-gap-md fd-p-md"}>
              
              {/* Header */}
              <div className="fd-auto-layout-h fd-justify-between fd-align-center fd-w-full"
                   style={{ borderBottom: isLow ? "2px dashed #555" : "1px solid #e2e8f0", paddingBottom: "12px" }}>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>
                  {isLow ? "EDIT PARKING SLOT" : "Edit Parking Slot"}
                </h3>
                <button type="button" onClick={() => setAdminEditSlot(null)} style={{ background: "transparent", border: "none", cursor: "pointer", color: isLow ? "#000" : "#64748b" }}>
                  {isLow ? <div className="fd-icon-placeholder" /> : <X size={18} />}
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleEditSlot({
                  id: adminEditSlot._id || adminEditSlot.id,
                  slotNumber: formData.get("slotNumber"),
                  location: formData.get("location"),
                  pricePerHour: Number(formData.get("pricePerHour")),
                  isAvailable: formData.get("isAvailable") === "true",
                });
              }} className="fd-auto-layout-v fd-gap-sm">
                
                <div className="fd-auto-layout-v fd-gap-xs">
                  <label style={{ fontSize: "12px", fontWeight: 700 }}>{isLow ? "SLOT NUMBER" : "Slot Number"}</label>
                  <input type="text" name="slotNumber" defaultValue={adminEditSlot.slotNumber} className="fd-input" required />
                </div>

                <div className="fd-auto-layout-v fd-gap-xs">
                  <label style={{ fontSize: "12px", fontWeight: 700 }}>{isLow ? "LOCATION" : "Location"}</label>
                  <input type="text" name="location" defaultValue={adminEditSlot.location} className="fd-input" required />
                </div>

                <div className="fd-auto-layout-v fd-gap-xs">
                  <label style={{ fontSize: "12px", fontWeight: 700 }}>{isLow ? "PRICE PER HOUR ($)" : "Price per Hour ($)"}</label>
                  <input type="number" name="pricePerHour" defaultValue={adminEditSlot.pricePerHour} className="fd-input" required />
                </div>

                <div className="fd-auto-layout-v fd-gap-xs">
                  <label style={{ fontSize: "12px", fontWeight: 700 }}>{isLow ? "AVAILABILITY" : "Availability Status"}</label>
                  <select name="isAvailable" className="fd-input" defaultValue={adminEditSlot.isAvailable ? "true" : "false"}>
                    <option value="true">{isLow ? "AVAILABLE" : "Available"}</option>
                    <option value="false">{isLow ? "OCCUPIED" : "Occupied"}</option>
                  </select>
                </div>

                <div className="fd-auto-layout-h fd-gap-xs fd-justify-end fd-w-full" style={{ marginTop: "16px" }}>
                  <button type="submit" className="fd-btn-primary fd-flex-1">
                    {isLow ? "SAVE CHANGES" : "Save Changes"}
                  </button>
                  <button type="button" onClick={() => setAdminEditSlot(null)} className="fd-btn-secondary">
                    {isLow ? "CANCEL" : "Cancel"}
                  </button>
                </div>

              </form>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
