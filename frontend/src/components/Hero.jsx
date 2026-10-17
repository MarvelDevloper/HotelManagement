import React, { useState } from "react";
import { IconSearch, IconCalendar, IconBed, IconStar, IconShield, IconSparkles } from "./Icons";

export const Hero = ({ onSearchRooms }) => {
  const [filterType, setFilterType] = useState("All");
  const [filterCheckIn, setFilterCheckIn] = useState("");
  const [filterCheckOut, setFilterCheckOut] = useState("");

  const handleQuickSearch = (e) => {
    e.preventDefault();
    onSearchRooms({
      type: filterType,
      checkIn: filterCheckIn,
      checkOut: filterCheckOut
    });
  };

  return (
    <section className="hero-modern">
      {/* Background Decorative Elements */}
      <div className="hero-glow-1"></div>
      <div className="hero-glow-2"></div>

      <div className="container hero-layout">
        {/* Left Column: Text & Search Bar */}
        <div className="hero-text-content">
          <div className="hero-pill-badge">
            <IconSparkles size={14} />
            <span>Next-Generation Cloud Hospitality</span>
          </div>

          <h1 className="hero-main-title">
            Where Modern Luxury Meets <em>Intelligent Cloud</em> Living
          </h1>

          <p className="hero-subtext">
            Immerse yourself in effortless comfort. Reserve hand-crafted suites, 
            enjoy touchless smart room access, and experience world-class 5-star service.
          </p>

          {/* Quick Search Card */}
          <div className="hero-search-card">
            <form onSubmit={handleQuickSearch} className="search-card-form">
              <div className="search-field">
                <label>
                  <IconBed size={14} /> Room Category
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="search-select"
                >
                  <option value="All">All Categories</option>
                  <option value="Deluxe">Deluxe Suite</option>
                  <option value="Suite">Executive Suite</option>
                  <option value="Luxury">Presidential Luxury</option>
                  <option value="Double">Double Room</option>
                  <option value="Single">Single Studio</option>
                </select>
              </div>

              <div className="search-field">
                <label>
                  <IconCalendar size={14} /> Check In
                </label>
                <input
                  type="date"
                  value={filterCheckIn}
                  onChange={(e) => setFilterCheckIn(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="search-field">
                <label>
                  <IconCalendar size={14} /> Check Out
                </label>
                <input
                  type="date"
                  value={filterCheckOut}
                  onChange={(e) => setFilterCheckOut(e.target.value)}
                  className="search-input"
                />
              </div>

              <button type="submit" className="search-submit-btn">
                <IconSearch size={18} />
                <span>Search</span>
              </button>
            </form>
          </div>

          {/* Trust Highlights */}
          <div className="hero-trust-badges">
            <div className="trust-item">
              <div className="trust-icon star-icon">
                <IconStar size={16} fill="#f59e0b" />
              </div>
              <div>
                <strong>4.9 / 5.0</strong>
                <span>Guest Rating</span>
              </div>
            </div>
            <div className="trust-divider"></div>
            <div className="trust-item">
              <div className="trust-icon shield-icon">
                <IconShield size={16} />
              </div>
              <div>
                <strong>Instant API</strong>
                <span>Zero Latency</span>
              </div>
            </div>
            <div className="trust-divider"></div>
            <div className="trust-item">
              <div className="trust-icon eco-icon">
                <IconSparkles size={16} />
              </div>
              <div>
                <strong>100% Verified</strong>
                <span>Direct Booking</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual Collage */}
        <div className="hero-visual-col">
          <div className="hero-image-frame">
            <img
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80"
              alt="Aura Luxe Resort Facade"
              className="hero-main-img"
            />
            
            {/* Floating Info Pill 1 */}
            <div className="floating-badge badge-top-right">
              <div className="float-badge-icon">
                <IconStar size={16} fill="#f59e0b" />
              </div>
              <div>
                <p className="float-title">Best Cloud Resort</p>
                <p className="float-sub">Excellence Award 2026</p>
              </div>
            </div>

            {/* Floating Info Pill 2 */}
            <div className="floating-badge badge-bottom-left">
              <div className="pulse-circle"></div>
              <div>
                <p className="float-title">Live Availability</p>
                <p className="float-sub">Instant MySQL Sync</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
