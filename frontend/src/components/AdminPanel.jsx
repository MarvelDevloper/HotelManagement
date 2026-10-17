import React, { useState } from "react";
import {
  IconBed,
  IconCalendar,
  IconUser,
  IconPlus,
  IconEdit,
  IconTrash,
  IconShield,
  IconCheckCircle,
  IconClose,
  IconEye,
  IconSparkles
} from "./Icons";

const AVAILABLE_AMENITIES = [
  "High-speed Wi-Fi",
  "Smart 4K TV",
  "Espresso Machine",
  "Rain Shower",
  "Jacuzzi Tub",
  "Private Balcony",
  "Ergonomic Desk",
  "Mini Fridge",
  "Butler Service",
  "Living Lounge",
  "Pool View",
  "Bathtub",
  "Complimentary Breakfast"
];

const PHOTO_PRESETS = [
  { label: "Deluxe Suite", url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80" },
  { label: "Executive Suite", url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80" },
  { label: "Penthouse Luxury", url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80" },
  { label: "Double Queen", url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80" },
  { label: "Cozy Studio", url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80" }
];

export const AdminPanel = ({
  rooms,
  bookings,
  users,
  onAddRoom,
  onUpdateRoom,
  onDeleteRoom,
  onUpdateBookingStatus,
  onDeleteBooking,
  onUpdateUserRole,
  onDeleteUser,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState("rooms"); // 'rooms' | 'bookings' | 'users'

  // Add Room Modal State with All Detailed Attributes
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [newRoomData, setNewRoomData] = useState({
    room_number: "",
    room_type: "Deluxe",
    price: "",
    status: "Available",
    image: PHOTO_PRESETS[0].url,
    description: "Spacious contemporary room with acoustic soundproofing, luxury Egyptian cotton bedding, and modern smart room amenities.",
    capacity: "2 Guests",
    bed_type: "1 King Bed",
    room_size: "380 sq ft",
    view_type: "City Skyline",
    amenities: ["High-speed Wi-Fi", "Smart 4K TV", "Espresso Machine", "Rain Shower"]
  });

  // Edit Room Modal State
  const [editingRoom, setEditingRoom] = useState(null);

  // Quick stats calculation
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter((r) => r.status === "Available").length;
  const bookedRooms = totalRooms - availableRooms;
  const totalBookings = bookings.length;
  const totalUsers = users.length;
  const occupancyRate = totalRooms > 0 ? Math.round((bookedRooms / totalRooms) * 100) : 0;

  const handleToggleAmenity = (amenity, isEditing = false) => {
    if (isEditing) {
      const currentList = Array.isArray(editingRoom.amenities)
        ? editingRoom.amenities
        : (editingRoom.amenities || "").split(",").map((s) => s.trim()).filter(Boolean);
      const updated = currentList.includes(amenity)
        ? currentList.filter((a) => a !== amenity)
        : [...currentList, amenity];
      setEditingRoom({ ...editingRoom, amenities: updated });
    } else {
      const currentList = newRoomData.amenities;
      const updated = currentList.includes(amenity)
        ? currentList.filter((a) => a !== amenity)
        : [...currentList, amenity];
      setNewRoomData({ ...newRoomData, amenities: updated });
    }
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!newRoomData.room_number || !newRoomData.price) {
      alert("Please fill in room number and price.");
      return;
    }
    onAddRoom({
      ...newRoomData,
      room_number: Number(newRoomData.room_number),
      price: Number(newRoomData.price),
      amenities: Array.isArray(newRoomData.amenities)
        ? newRoomData.amenities.join(", ")
        : newRoomData.amenities
    });
    setNewRoomData({
      room_number: "",
      room_type: "Deluxe",
      price: "",
      status: "Available",
      image: PHOTO_PRESETS[0].url,
      description: "Spacious contemporary room with acoustic soundproofing, luxury Egyptian cotton bedding, and modern smart room amenities.",
      capacity: "2 Guests",
      bed_type: "1 King Bed",
      room_size: "380 sq ft",
      view_type: "City Skyline",
      amenities: ["High-speed Wi-Fi", "Smart 4K TV", "Espresso Machine", "Rain Shower"]
    });
    setShowAddRoomModal(false);
  };

  const handleOpenEdit = (room) => {
    const amenitiesList = Array.isArray(room.amenities)
      ? room.amenities
      : typeof room.amenities === "string"
      ? room.amenities.split(",").map((s) => s.trim()).filter(Boolean)
      : ["High-speed Wi-Fi", "Smart 4K TV"];

    setEditingRoom({
      ...room,
      image: room.image || PHOTO_PRESETS[0].url,
      description: room.description || "Refined accommodation with premium amenities and scenic views.",
      capacity: room.capacity || "2 Guests",
      bed_type: room.bed_type || "1 King Bed",
      room_size: room.room_size || "380 sq ft",
      view_type: room.view_type || "City Skyline",
      amenities: amenitiesList
    });
  };

  const handleSaveEditRoom = (e) => {
    e.preventDefault();
    onUpdateRoom(editingRoom.id, {
      ...editingRoom,
      price: Number(editingRoom.price),
      amenities: Array.isArray(editingRoom.amenities)
        ? editingRoom.amenities.join(", ")
        : editingRoom.amenities
    });
    setEditingRoom(null);
  };

  return (
    <section className="admin-panel container">
      {/* Admin Header */}
      <div className="admin-header-row">
        <div>
          <div className="admin-badge-pill">
            <IconShield size={14} />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="admin-title">Cloud Hotel Management</h1>
          <p className="admin-subtitle">
            Real-time management for detailed rooms, bookings, and user accounts synced to MySQL backend.
          </p>
        </div>
        <div className="admin-top-actions">
          <button className="btn-secondary" onClick={onRefreshData}>
            Sync / Refresh
          </button>
          <button className="btn-primary" onClick={() => setShowAddRoomModal(true)}>
            <IconPlus size={16} /> Add Room (Full Info)
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="admin-kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-wrap room-kpi">
            <IconBed size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Total Rooms</span>
            <span className="kpi-value">{totalRooms}</span>
            <span className="kpi-meta">{availableRooms} Available • {bookedRooms} Booked</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap booking-kpi">
            <IconCalendar size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Total Reservations</span>
            <span className="kpi-value">{totalBookings}</span>
            <span className="kpi-meta">Live Guest Bookings</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap user-kpi">
            <IconUser size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Registered Users</span>
            <span className="kpi-value">{totalUsers}</span>
            <span className="kpi-meta">Guests & Admins</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap occupancy-kpi">
            <IconCheckCircle size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Occupancy Rate</span>
            <span className="kpi-value">{occupancyRate}%</span>
            <span className="kpi-meta">Capacity Utilization</span>
          </div>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="admin-tab-bar">
        <button
          className={`admin-tab-btn ${activeTab === "rooms" ? "active" : ""}`}
          onClick={() => setActiveTab("rooms")}
        >
          <IconBed size={16} /> Rooms Directory ({rooms.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === "bookings" ? "active" : ""}`}
          onClick={() => setActiveTab("bookings")}
        >
          <IconCalendar size={16} /> Reservations ({bookings.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          <IconUser size={16} /> Registered Users ({users.length})
        </button>
      </div>

      {/* TAB 1: ROOMS TABLE */}
      {activeTab === "rooms" && (
        <div className="admin-table-card">
          <div className="table-card-header">
            <h3>Hotel Rooms Catalog</h3>
            <button className="btn-sm-primary" onClick={() => setShowAddRoomModal(true)}>
              <IconPlus size={14} /> Add Room (Full Info)
            </button>
          </div>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Room</th>
                  <th>Category</th>
                  <th>Capacity / Bed</th>
                  <th>Price / Night</th>
                  <th>Current Status</th>
                  <th className="text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id}>
                    <td>
                      <div className="table-room-cell">
                        <span className="room-num-badge">#{room.room_number}</span>
                        {room.image && (
                          <img
                            src={room.image}
                            alt=""
                            className="table-room-thumb"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        )}
                      </div>
                    </td>
                    <td>
                      <strong className="room-type-text">{room.room_type}</strong>
                      {room.view_type && <span className="table-sub-view">{room.view_type}</span>}
                    </td>
                    <td>
                      <span className="table-spec-text">
                        {room.capacity || "2 Guests"} • {room.bed_type || "1 King Bed"}
                      </span>
                    </td>
                    <td>
                      <span className="table-price">₹{Number(room.price || 0).toLocaleString("en-IN")}</span>
                    </td>
                    <td>
                      <button
                        className={`status-toggle-btn ${room.status === "Available" ? "status-avail" : "status-booked"}`}
                        onClick={() =>
                          onUpdateRoom(room.id, {
                            ...room,
                            status: room.status === "Available" ? "Booked" : "Available"
                          })
                        }
                        title="Click to toggle status"
                      >
                        <span className="status-dot"></span>
                        {room.status}
                      </button>
                    </td>
                    <td className="text-right table-action-cells">
                      <button
                        className="action-icon-btn edit-btn"
                        onClick={() => handleOpenEdit(room)}
                        title="Edit Full Details"
                      >
                        <IconEdit size={16} />
                      </button>
                      <button
                        className="action-icon-btn delete-btn"
                        onClick={() => onDeleteRoom(room.id)}
                        title="Delete Room"
                      >
                        <IconTrash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: BOOKINGS TABLE */}
      {activeTab === "bookings" && (
        <div className="admin-table-card">
          <div className="table-card-header">
            <h3>Guest Bookings & Reservations</h3>
            <span className="table-count-tag">{bookings.length} reservations</span>
          </div>
          {bookings.length === 0 ? (
            <div className="table-empty-notice">
              <p>No bookings found in database.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Guest</th>
                    <th>Room</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td>
                        <span className="booking-ref">#{b.id}</span>
                      </td>
                      <td>
                        <div className="guest-info-cell">
                          <strong>{b.guest_name}</strong>
                          <span className="guest-email">{b.email}</span>
                        </div>
                      </td>
                      <td>
                        <span className="room-ref">
                          Room {b.room_number || b.room_id} ({b.room_type || "Deluxe"})
                        </span>
                      </td>
                      <td>
                        {b.check_in ? new Date(b.check_in).toLocaleDateString("en-IN") : "N/A"}
                      </td>
                      <td>
                        {b.check_out ? new Date(b.check_out).toLocaleDateString("en-IN") : "N/A"}
                      </td>
                      <td>
                        <select
                          className={`status-select ${b.status?.toLowerCase()}`}
                          value={b.status || "Confirmed"}
                          onChange={(e) => onUpdateBookingStatus(b.id, e.target.value)}
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="text-right table-action-cells">
                        <button
                          className="action-icon-btn delete-btn"
                          onClick={() => onDeleteBooking(b.id)}
                          title="Delete Booking"
                        >
                          <IconTrash size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: USERS TABLE */}
      {activeTab === "users" && (
        <div className="admin-table-card">
          <div className="table-card-header">
            <h3>Registered Users Accounts</h3>
            <span className="table-count-tag">{users.length} accounts</span>
          </div>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <span className="booking-ref">#{u.id}</span>
                    </td>
                    <td>
                      <strong>{u.name}</strong>
                    </td>
                    <td>
                      <span className="guest-email">{u.email}</span>
                    </td>
                    <td>
                      <button
                        className={`role-pill-btn ${u.role === "admin" ? "role-admin" : "role-guest"}`}
                        onClick={() =>
                          onUpdateUserRole(u.id, {
                            name: u.name,
                            role: u.role === "admin" ? "guest" : "admin"
                          })
                        }
                        title="Click to toggle admin/guest role"
                      >
                        {u.role === "admin" ? "Admin" : "Guest"}
                      </button>
                    </td>
                    <td className="text-right table-action-cells">
                      <button
                        className="action-icon-btn delete-btn"
                        onClick={() => onDeleteUser(u.id)}
                        title="Delete User"
                      >
                        <IconTrash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD ROOM WITH FULL DETAILED INFO */}
      {showAddRoomModal && (
        <div className="modal-backdrop" onClick={() => setShowAddRoomModal(false)}>
          <div className="modal-card admin-modal-card detailed-room-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowAddRoomModal(false)}>
              <IconClose size={20} />
            </button>
            <div className="modal-header">
              <span className="modal-badge">
                <IconSparkles size={12} /> Database Record Creation
              </span>
              <h2>Add New Hotel Room</h2>
              <p className="modal-subtitle">Save complete specifications & media directly into MySQL</p>
            </div>

            <form onSubmit={handleCreateRoom} className="admin-detailed-form">
              {/* Top Row: Basic Info */}
              <div className="admin-form-section">
                <h4 className="form-subheading">1. Core Room Information</h4>
                <div className="form-grid-3">
                  <div className="form-group">
                    <label>Room Number *</label>
                    <input
                      type="number"
                      placeholder="e.g. 201"
                      value={newRoomData.room_number}
                      onChange={(e) => setNewRoomData({ ...newRoomData, room_number: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Room Category *</label>
                    <select
                      value={newRoomData.room_type}
                      onChange={(e) => setNewRoomData({ ...newRoomData, room_type: e.target.value })}
                    >
                      <option value="Deluxe">Deluxe Suite</option>
                      <option value="Suite">Executive Suite</option>
                      <option value="Luxury">Presidential Luxury</option>
                      <option value="Double">Double Room</option>
                      <option value="Single">Single Studio</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Price (₹ / night) *</label>
                    <input
                      type="number"
                      placeholder="e.g. 4500"
                      value={newRoomData.price}
                      onChange={(e) => setNewRoomData({ ...newRoomData, price: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Second Row: Specifications */}
              <div className="admin-form-section">
                <h4 className="form-subheading">2. Room Specifications</h4>
                <div className="form-grid-4">
                  <div className="form-group">
                    <label>Guest Capacity</label>
                    <input
                      type="text"
                      placeholder="e.g. 2 Guests"
                      value={newRoomData.capacity}
                      onChange={(e) => setNewRoomData({ ...newRoomData, capacity: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Bed Configuration</label>
                    <input
                      type="text"
                      placeholder="e.g. 1 King Bed"
                      value={newRoomData.bed_type}
                      onChange={(e) => setNewRoomData({ ...newRoomData, bed_type: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Room Size</label>
                    <input
                      type="text"
                      placeholder="e.g. 420 sq ft"
                      value={newRoomData.room_size}
                      onChange={(e) => setNewRoomData({ ...newRoomData, room_size: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Balcony / View</label>
                    <input
                      type="text"
                      placeholder="e.g. Ocean & Poolside"
                      value={newRoomData.view_type}
                      onChange={(e) => setNewRoomData({ ...newRoomData, view_type: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Third Row: Media & Photo */}
              <div className="admin-form-section">
                <h4 className="form-subheading">3. Room Photography & Description</h4>
                <div className="media-form-layout">
                  <div className="media-inputs-col">
                    <div className="form-group">
                      <label>Photo URL</label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={newRoomData.image}
                        onChange={(e) => setNewRoomData({ ...newRoomData, image: e.target.value })}
                      />
                    </div>
                    {/* Quick photo presets */}
                    <div className="photo-presets-row">
                      <span className="preset-title">Presets:</span>
                      {PHOTO_PRESETS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className="photo-preset-chip"
                          onClick={() => setNewRoomData({ ...newRoomData, image: p.url })}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>

                    <div className="form-group" style={{ marginTop: "12px" }}>
                      <label>Detailed Description</label>
                      <textarea
                        rows={3}
                        placeholder="Describe the room experience, ambiance, features..."
                        value={newRoomData.description}
                        onChange={(e) => setNewRoomData({ ...newRoomData, description: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Live Thumbnail Preview */}
                  <div className="photo-live-preview">
                    <label>Live Preview</label>
                    <div className="preview-box">
                      <img
                        src={newRoomData.image || PHOTO_PRESETS[0].url}
                        alt="Preview"
                        onError={(e) => { e.target.src = PHOTO_PRESETS[0].url; }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Fourth Row: Amenities Checkboxes */}
              <div className="admin-form-section">
                <h4 className="form-subheading">4. In-Room Amenities</h4>
                <div className="amenities-checkbox-grid">
                  {AVAILABLE_AMENITIES.map((amenity) => {
                    const isChecked = newRoomData.amenities.includes(amenity);
                    return (
                      <label key={amenity} className={`amenity-checkbox-label ${isChecked ? "checked" : ""}`}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleAmenity(amenity, false)}
                        />
                        <span>{amenity}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="modal-actions" style={{ padding: "16px 0 0" }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddRoomModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <IconPlus size={16} /> Save Room into MySQL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT ROOM WITH FULL DETAILED INFO */}
      {editingRoom && (
        <div className="modal-backdrop" onClick={() => setEditingRoom(null)}>
          <div className="modal-card admin-modal-card detailed-room-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setEditingRoom(null)}>
              <IconClose size={20} />
            </button>
            <div className="modal-header">
              <span className="modal-badge">Room #{editingRoom.room_number}</span>
              <h2>Edit Room Specifications</h2>
              <p className="modal-subtitle">Update pricing, description, photos, and amenities</p>
            </div>

            <form onSubmit={handleSaveEditRoom} className="admin-detailed-form">
              {/* Core Information */}
              <div className="admin-form-section">
                <h4 className="form-subheading">1. Core Info</h4>
                <div className="form-grid-3">
                  <div className="form-group">
                    <label>Room Category</label>
                    <select
                      value={editingRoom.room_type}
                      onChange={(e) => setEditingRoom({ ...editingRoom, room_type: e.target.value })}
                    >
                      <option value="Deluxe">Deluxe Suite</option>
                      <option value="Suite">Executive Suite</option>
                      <option value="Luxury">Presidential Luxury</option>
                      <option value="Double">Double Room</option>
                      <option value="Single">Single Studio</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Price (₹ / night)</label>
                    <input
                      type="number"
                      value={editingRoom.price}
                      onChange={(e) => setEditingRoom({ ...editingRoom, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Availability Status</label>
                    <select
                      value={editingRoom.status}
                      onChange={(e) => setEditingRoom({ ...editingRoom, status: e.target.value })}
                    >
                      <option value="Available">Available</option>
                      <option value="Booked">Booked</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="admin-form-section">
                <h4 className="form-subheading">2. Specifications</h4>
                <div className="form-grid-4">
                  <div className="form-group">
                    <label>Capacity</label>
                    <input
                      type="text"
                      value={editingRoom.capacity || ""}
                      onChange={(e) => setEditingRoom({ ...editingRoom, capacity: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Bed Configuration</label>
                    <input
                      type="text"
                      value={editingRoom.bed_type || ""}
                      onChange={(e) => setEditingRoom({ ...editingRoom, bed_type: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Room Size</label>
                    <input
                      type="text"
                      value={editingRoom.room_size || ""}
                      onChange={(e) => setEditingRoom({ ...editingRoom, room_size: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>View</label>
                    <input
                      type="text"
                      value={editingRoom.view_type || ""}
                      onChange={(e) => setEditingRoom({ ...editingRoom, view_type: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Media & Description */}
              <div className="admin-form-section">
                <h4 className="form-subheading">3. Photography & Description</h4>
                <div className="media-form-layout">
                  <div className="media-inputs-col">
                    <div className="form-group">
                      <label>Photo URL</label>
                      <input
                        type="url"
                        value={editingRoom.image || ""}
                        onChange={(e) => setEditingRoom({ ...editingRoom, image: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ marginTop: "12px" }}>
                      <label>Description</label>
                      <textarea
                        rows={3}
                        value={editingRoom.description || ""}
                        onChange={(e) => setEditingRoom({ ...editingRoom, description: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="photo-live-preview">
                    <label>Live Preview</label>
                    <div className="preview-box">
                      <img
                        src={editingRoom.image || PHOTO_PRESETS[0].url}
                        alt="Preview"
                        onError={(e) => { e.target.src = PHOTO_PRESETS[0].url; }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="admin-form-section">
                <h4 className="form-subheading">4. Amenities</h4>
                <div className="amenities-checkbox-grid">
                  {AVAILABLE_AMENITIES.map((amenity) => {
                    const isChecked = Array.isArray(editingRoom.amenities)
                      ? editingRoom.amenities.includes(amenity)
                      : (editingRoom.amenities || "").includes(amenity);
                    return (
                      <label key={amenity} className={`amenity-checkbox-label ${isChecked ? "checked" : ""}`}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleAmenity(amenity, true)}
                        />
                        <span>{amenity}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="modal-actions" style={{ padding: "16px 0 0" }}>
                <button type="button" className="btn-secondary" onClick={() => setEditingRoom(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Update Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
