import React from "react";
import { IconHotel, IconMapPin, IconPhone, IconMail, IconSparkles } from "./Icons";

export const Footer = ({ onNavigate }) => {
  return (
    <footer className="site-footer">
      <div className="container footer-content-grid">
        {/* Col 1: Brand Info */}
        <div className="footer-col brand-col">
          <div className="footer-brand" onClick={() => onNavigate("home")}>
            <div className="brand-icon-wrap">
              <IconHotel size={20} />
            </div>
            <div className="brand-text">
              <span className="brand-name">AURA LUXE</span>
              <span className="brand-tagline">Cloud Hospitality Platform</span>
            </div>
          </div>
          <p className="footer-desc">
            A state-of-the-art cloud reservation system designed for effortless hotel booking,
            room telemetry, and modern guest experiences.
          </p>
          <div className="footer-pill-note">
            <IconSparkles size={14} />
            <span>Built on AWS Cloud & MySQL Stack</span>
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div className="footer-col">
          <h4 className="footer-heading">Explore</h4>
          <ul className="footer-nav-list">
            <li><button onClick={() => onNavigate("home")}>Home</button></li>
            <li><button onClick={() => onNavigate("rooms")}>Rooms & Suites</button></li>
            <li><button onClick={() => onNavigate("amenities")}>Hotel Amenities</button></li>
            <li><button onClick={() => onNavigate("reviews")}>Guest Reviews</button></li>
          </ul>
        </div>

        {/* Col 3: Room Suites */}
        <div className="footer-col">
          <h4 className="footer-heading">Suites Catalog</h4>
          <ul className="footer-nav-list">
            <li><button onClick={() => onNavigate("rooms")}>Presidential Luxury</button></li>
            <li><button onClick={() => onNavigate("rooms")}>Executive Suite</button></li>
            <li><button onClick={() => onNavigate("rooms")}>Deluxe Horizon</button></li>
            <li><button onClick={() => onNavigate("rooms")}>Double Garden View</button></li>
          </ul>
        </div>

        {/* Col 4: Contact & Location */}
        <div className="footer-col">
          <h4 className="footer-heading">Connect</h4>
          <div className="contact-list">
            <div className="contact-item">
              <IconMapPin size={16} />
              <span>45 Oceanview Boulevard, Marine Drive, Mumbai</span>
            </div>
            <div className="contact-item">
              <IconPhone size={16} />
              <span>+91 (022) 8900 1200</span>
            </div>
            <div className="contact-item">
              <IconMail size={16} />
              <span>reservations@auraluxehotel.com</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <div className="container footer-bottom-inner">
          <p>© {new Date().getFullYear()} Aura Luxe Smart Hotel Reservation Platform. All rights reserved.</p>
          <div className="footer-bottom-links">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Cloud API Specs</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
