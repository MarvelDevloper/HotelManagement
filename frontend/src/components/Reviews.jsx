import React from "react";
import { GUEST_REVIEWS } from "../data/roomData";
import { IconStar, IconCheckCircle } from "./Icons";

export const Reviews = () => {
  return (
    <section className="reviews-section" id="reviews">
      <div className="container">
        <div className="section-header-centered">
          <span className="section-eyebrow">VERIFIED EXPERIENCES</span>
          <h2 className="section-title">Loved by Travelers Worldwide</h2>
          <p className="section-subtitle">
            Read authentic feedback from guests who booked their luxury stay through our cloud platform.
          </p>
        </div>

        <div className="reviews-grid">
          {GUEST_REVIEWS.map((rev, index) => (
            <div className="review-card" key={index}>
              <div className="review-stars">
                {[...Array(rev.rating)].map((_, i) => (
                  <IconStar key={i} size={16} fill="#f59e0b" className="star-filled" />
                ))}
              </div>
              <p className="review-text">"{rev.comment}"</p>
              <div className="review-author">
                <div className="author-avatar">
                  {rev.name.charAt(0)}
                </div>
                <div className="author-info">
                  <div className="author-name-row">
                    <strong>{rev.name}</strong>
                    <span className="verified-badge">
                      <IconCheckCircle size={13} /> Verified
                    </span>
                  </div>
                  <span className="author-location">{rev.location}</span>
                  <span className="stay-meta">{rev.stayed}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
