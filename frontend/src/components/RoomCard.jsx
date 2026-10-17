import React from "react";
import { IconBed, IconUser, IconCheckCircle, IconEye } from "./Icons";
import { ROOM_TYPE_META } from "../data/roomData";

export const RoomCard = ({ room, onBook }) => {
  const meta = ROOM_TYPE_META[room.room_type] || ROOM_TYPE_META.Deluxe;
  const isAvailable = room.status === "Available";

  // Use DB data if present, otherwise fallback to category metadata
  const cardImage = room.image || meta.image;
  const cardDesc = room.description || meta.description;
  const cardBed = room.bed_type || meta.bed;
  const cardCapacity = room.capacity || meta.capacity;
  const cardView = room.view_type || meta.view;
  
  // Amenities from DB (can be comma-separated string or array) or meta
  const cardAmenities = room.amenities
    ? (Array.isArray(room.amenities)
        ? room.amenities
        : room.amenities.split(",").map((s) => s.trim()).filter(Boolean))
    : meta.amenities;

  return (
    <div className={`room-card-modern ${!isAvailable ? "is-booked" : ""}`}>
      {/* Card Image */}
      <div className="card-image-wrapper">
        <img
          src={cardImage}
          alt={`Room ${room.room_number} - ${room.room_type}`}
          loading="lazy"
          onError={(e) => {
            e.target.src = meta.image; // Safe image fallback
          }}
        />
        <span className="room-category-pill">{room.badge || meta.badge}</span>
        <div className={`availability-pill ${isAvailable ? "available" : "booked"}`}>
          <span className="status-dot"></span>
          <span>{isAvailable ? "Available" : "Occupied"}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="card-body">
        <div className="card-header-row">
          <div>
            <span className="room-tag">Suite #{room.room_number}</span>
            <h3 className="room-title">{room.room_type} Room</h3>
          </div>
          <div className="price-tag">
            <span className="price-val">₹{Number(room.price || 0).toLocaleString("en-IN")}</span>
            <span className="price-unit">/ night</span>
          </div>
        </div>

        <p className="room-desc">{cardDesc}</p>

        {/* Feature Specs */}
        <div className="room-specs">
          <div className="spec-item" title="Bed Type">
            <IconBed size={15} />
            <span>{cardBed}</span>
          </div>
          <div className="spec-item" title="Capacity">
            <IconUser size={15} />
            <span>{cardCapacity}</span>
          </div>
          <div className="spec-item" title="View">
            <IconEye size={15} />
            <span>{cardView}</span>
          </div>
        </div>

        {/* Amenities pills */}
        <div className="room-amenities-tags">
          {cardAmenities.slice(0, 3).map((amenity, idx) => (
            <span key={idx} className="amenity-tag">
              <IconCheckCircle size={12} />
              {amenity}
            </span>
          ))}
          {cardAmenities.length > 3 && (
            <span className="amenity-tag more-tag">+{cardAmenities.length - 3} more</span>
          )}
        </div>

        {/* Action Button */}
        <div className="card-footer-actions">
          {isAvailable ? (
            <button className="btn-book-room" onClick={() => onBook(room)}>
              Book Room #{room.room_number}
            </button>
          ) : (
            <button className="btn-book-room disabled" disabled>
              Currently Unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
