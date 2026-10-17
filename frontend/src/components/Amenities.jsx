import React from "react";
import { HOTEL_AMENITIES } from "../data/roomData";

export const Amenities = () => {
  return (
    <section className="amenities-section" id="amenities">
      <div className="container">
        <div className="section-header-centered">
          <span className="section-eyebrow">WORLD-CLASS HOSPITALITY</span>
          <h2 className="section-title">Designed for Your Ultimate Comfort</h2>
          <p className="section-subtitle">
            From seamless cloud-enabled smart suites to rejuvenating wellness retreats,
            explore the amenities curated for extraordinary stays.
          </p>
        </div>

        <div className="amenities-grid">
          {HOTEL_AMENITIES.map((item, index) => (
            <div className="amenity-card" key={index}>
              <div className="amenity-card-header">
                <span className="amenity-tag-pill">{item.tag}</span>
                <span className="amenity-number">0{index + 1}</span>
              </div>
              <h3 className="amenity-card-title">{item.title}</h3>
              <p className="amenity-card-desc">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Feature Banner */}
        <div className="cloud-features-banner">
          <div className="cloud-banner-content">
            <span className="cloud-pill">Cloud Architecture Integration</span>
            <h3>Powered by Secure REST APIs & Cloud SQL</h3>
            <p>
              Experience zero-friction room reservations, synchronized real-time availability across AWS EC2,
              and encrypted guest records.
            </p>
          </div>
          <div className="cloud-banner-stats">
            <div className="stat-box">
              <span className="stat-num">99.9%</span>
              <span className="stat-label">Uptime SLA</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">&lt; 50ms</span>
              <span className="stat-label">API Latency</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">256-bit</span>
              <span className="stat-label">Encryption</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
