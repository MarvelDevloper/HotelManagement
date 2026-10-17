import React from "react";
import { IconCalendar, IconCheckCircle, IconArrowRight } from "./Icons";
import { ROOM_TYPE_META } from "../data/roomData";

export const MyBookings = ({ bookings, user, onExploreRooms, onCancelBooking }) => {
  // Filter bookings for the logged-in user
  const userBookings = bookings.filter(
    (b) => b.email && user?.email && b.email.toLowerCase() === user.email.toLowerCase()
  );

  return (
    <section className="my-bookings-page container">
      <div className="page-header-row">
        <div>
          <span className="section-eyebrow">GUEST RESERVATION PORTAL</span>
          <h1 className="page-title">My Hotel Bookings</h1>
          <p className="page-subtitle">
            Welcome back, <strong>{user?.name}</strong>. Here are your past and upcoming reservations.
          </p>
        </div>
        <button className="btn-primary" onClick={onExploreRooms}>
          Book Another Room
        </button>
      </div>

      {userBookings.length === 0 ? (
        <div className="empty-bookings-card">
          <div className="empty-icon-wrap">
            <IconCalendar size={36} />
          </div>
          <h3>No Active Reservations Found</h3>
          <p>
            You haven't reserved any rooms with <strong>{user?.email}</strong> yet.
            Discover our luxury suites and book your getaway now.
          </p>
          <button className="btn-primary" onClick={onExploreRooms}>
            Explore Available Suites <IconArrowRight size={16} />
          </button>
        </div>
      ) : (
        <div className="bookings-list-grid">
          {userBookings.map((b) => {
            const meta = ROOM_TYPE_META[b.room_type] || ROOM_TYPE_META.Deluxe;
            return (
              <div className="user-booking-card" key={b.id}>
                <div className="booking-card-media">
                  <img src={meta.image} alt={b.room_type || "Room"} />
                  <span className="booking-id-pill">ID #{b.id}</span>
                </div>
                <div className="booking-card-body">
                  <div className="booking-card-top">
                    <div>
                      <span className="booking-room-label">
                        Room {b.room_number || b.room_id} • {b.room_type || "Deluxe"}
                      </span>
                      <h3 className="booking-guest-title">{b.guest_name}</h3>
                    </div>
                    <span className={`booking-status-badge ${b.status?.toLowerCase()}`}>
                      <IconCheckCircle size={14} />
                      {b.status || "Confirmed"}
                    </span>
                  </div>

                  <div className="booking-date-range">
                    <div className="date-block">
                      <span className="date-label">Check-In</span>
                      <span className="date-val">
                        {b.check_in ? new Date(b.check_in).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "N/A"}
                      </span>
                    </div>
                    <div className="date-arrow">➔</div>
                    <div className="date-block">
                      <span className="date-label">Check-Out</span>
                      <span className="date-val">
                        {b.check_out ? new Date(b.check_out).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="booking-card-footer">
                    <div className="booking-fare">
                      <span className="fare-sub">Rate per night</span>
                      <span className="fare-amt">₹{(b.price || 3000).toLocaleString("en-IN")}</span>
                    </div>

                    {b.status !== "Cancelled" && (
                      <button
                        className="btn-cancel-reservation"
                        onClick={() => onCancelBooking(b.id)}
                      >
                        Cancel Stay
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
