import React, { useState, useMemo } from "react";
import { IconClose, IconCalendar, IconUser, IconMail, IconShield } from "./Icons";
import { ROOM_TYPE_META } from "../data/roomData";

export const BookingModal = ({ room, user, onClose, onSubmitBooking, isSubmitting }) => {
  const meta = ROOM_TYPE_META[room.room_type] || ROOM_TYPE_META.Deluxe;

  const todayStr = useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);

  const [bookingData, setBookingData] = useState({
    guest_name: user ? user.name : "",
    email: user ? user.email : "",
    check_in: "",
    check_out: "",
    special_requests: ""
  });

  // Calculate nights and cost
  const calculation = useMemo(() => {
    if (!bookingData.check_in || !bookingData.check_out) {
      return { nights: 1, baseTotal: room.price, taxes: Math.round(room.price * 0.12), total: Math.round(room.price * 1.12) };
    }
    const d1 = new Date(bookingData.check_in);
    const d2 = new Date(bookingData.check_out);
    const diffTime = d2 - d1;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const nights = diffDays > 0 ? diffDays : 1;
    const baseTotal = room.price * nights;
    const taxes = Math.round(baseTotal * 0.12);
    const total = baseTotal + taxes;
    return { nights, baseTotal, taxes, total };
  }, [bookingData.check_in, bookingData.check_out, room.price]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (bookingData.check_in >= bookingData.check_out) {
      alert("Check-out date must be strictly after Check-in date.");
      return;
    }
    onSubmitBooking({
      guest_name: bookingData.guest_name,
      email: bookingData.email,
      check_in: bookingData.check_in,
      check_out: bookingData.check_out
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card booking-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <IconClose size={20} />
        </button>

        <div className="modal-header">
          <span className="modal-badge">{meta.badge}</span>
          <h2>Reserve Room {room.room_number}</h2>
          <p className="modal-subtitle">{room.room_type} Suite • Aura Cloud Hotel</p>
        </div>

        <div className="booking-modal-grid">
          {/* Room Summary Preview */}
          <div className="modal-room-preview">
            <div className="preview-image-wrap">
              <img
                src={room.image || meta.image}
                alt={room.room_type}
                onError={(e) => { e.target.src = meta.image; }}
              />
              <div className="preview-price-tag">
                <span className="preview-price">₹{Number(room.price || 0).toLocaleString("en-IN")}</span>
                <span className="preview-period">/ night</span>
              </div>
            </div>
            <div className="preview-details">
              <div className="spec-row">
                <span>Capacity</span>
                <strong>{room.capacity || meta.capacity}</strong>
              </div>
              <div className="spec-row">
                <span>Bed Type</span>
                <strong>{room.bed_type || meta.bed}</strong>
              </div>
              <div className="spec-row">
                <span>View</span>
                <strong>{room.view_type || meta.view}</strong>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="price-breakdown">
              <h4>Fare Breakdown</h4>
              <div className="price-row">
                <span>₹{room.price.toLocaleString("en-IN")} × {calculation.nights} {calculation.nights > 1 ? "nights" : "night"}</span>
                <span>₹{calculation.baseTotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="price-row">
                <span>Hotel Tax & Cloud Surcharge (12%)</span>
                <span>₹{calculation.taxes.toLocaleString("en-IN")}</span>
              </div>
              <div className="price-divider"></div>
              <div className="price-row price-total">
                <span>Total Payable</span>
                <span>₹{calculation.total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form className="modal-booking-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Guest Full Name</label>
              <div className="input-with-icon">
                <IconUser size={18} className="input-icon" />
                <input
                  type="text"
                  value={bookingData.guest_name}
                  onChange={(e) => setBookingData({ ...bookingData, guest_name: e.target.value })}
                  placeholder="e.g. John Doe"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Confirmation Email</label>
              <div className="input-with-icon">
                <IconMail size={18} className="input-icon" />
                <input
                  type="email"
                  value={bookingData.email}
                  onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Check-In Date</label>
                <div className="input-with-icon">
                  <IconCalendar size={18} className="input-icon" />
                  <input
                    type="date"
                    min={todayStr}
                    value={bookingData.check_in}
                    onChange={(e) => setBookingData({ ...bookingData, check_in: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Check-Out Date</label>
                <div className="input-with-icon">
                  <IconCalendar size={18} className="input-icon" />
                  <input
                    type="date"
                    min={bookingData.check_in || todayStr}
                    value={bookingData.check_out}
                    onChange={(e) => setBookingData({ ...bookingData, check_out: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="security-notice">
              <IconShield size={16} />
              <span>Instant cloud confirmation • Free cancellation up to 24h before check-in</span>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : `Confirm & Pay ₹${calculation.total.toLocaleString("en-IN")}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
