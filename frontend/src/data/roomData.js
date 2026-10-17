// Curated metadata, photos, and amenities for room types
export const ROOM_TYPE_META = {
  Deluxe: {
    badge: "Most Popular",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
    capacity: "2 Guests",
    bed: "1 King Bed",
    size: "380 sq ft",
    view: "City Skyline",
    description: "Elegant contemporary space featuring premium Egyptian cotton bedding, marble bathroom, and panoramic city views.",
    amenities: ["High-speed Wi-Fi", "Smart 4K TV", "Espresso Machine", "Rain Shower", "Work Desk"]
  },
  Suite: {
    badge: "Executive Class",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    capacity: "3 Guests",
    bed: "1 King + 1 Sofa Bed",
    size: "560 sq ft",
    view: "Ocean & Garden",
    description: "Spacious master suite featuring a private lounge, luxury jacuzzi tub, and floor-to-ceiling glass balconies.",
    amenities: ["Private Balcony", "Jacuzzi Tub", "Living Lounge", "High-speed Wi-Fi", "Complimentary Breakfast"]
  },
  Single: {
    badge: "Cozy & Efficient",
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
    capacity: "1 Guest",
    bed: "1 Queen Bed",
    size: "260 sq ft",
    view: "Courtyard View",
    description: "Optimized for solo travelers and business professionals, offering serene soundproofing and ergonomic comfort.",
    amenities: ["High-speed Wi-Fi", "Ergonomic Desk", "Smart TV", "Mini Fridge", "En-suite Bath"]
  },
  Double: {
    badge: "Great for Couples",
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
    capacity: "2-3 Guests",
    bed: "2 Queen Beds",
    size: "420 sq ft",
    view: "Poolside View",
    description: "Generous twin or double configuration ideal for partners or friends seeking premium comfort and relaxation.",
    amenities: ["Twin Queen Beds", "Pool View", "High-speed Wi-Fi", "Bathtub", "Coffee Maker"]
  },
  Luxury: {
    badge: "Presidential Luxury",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80",
    capacity: "4 Guests",
    bed: "2 King Beds",
    size: "850 sq ft",
    view: "Panoramic Penthouse",
    description: "The ultimate in five-star opulence with private butler service, infinity plunge tub, and custom designer furnishings.",
    amenities: ["Butler Service", "Penthouse View", "Walk-in Wardrobe", "Cocktail Bar", "Sound System"]
  }
};

export const DEFAULT_FALLBACK_ROOMS = [
  { id: 1, room_number: 101, room_type: "Deluxe", price: 3000, status: "Available" },
  { id: 2, room_number: 102, room_type: "Suite", price: 5000, status: "Available" },
  { id: 3, room_number: 103, room_type: "Single", price: 2000, status: "Available" },
  { id: 4, room_number: 104, room_type: "Double", price: 3500, status: "Available" },
  { id: 5, room_number: 105, room_type: "Luxury", price: 7000, status: "Available" }
];

export const HOTEL_AMENITIES = [
  {
    title: "Infinity Sky Pool",
    desc: "Heated rooftop pool with sweeping city panoramas and private poolside cabanas.",
    tag: "Relaxation"
  },
  {
    title: "Le Ciel Gourmet Dining",
    desc: "Michelin-starred culinary experiences curated by world-class chefs with seasonal ingredients.",
    tag: "Fine Dining"
  },
  {
    title: "Smart Cloud Concierge",
    desc: "Digital room controls, keyless check-in, and instant cloud reservation management.",
    tag: "Tech & Cloud"
  },
  {
    title: "Serenity Wellness Spa",
    desc: "Holistic organic treatments, Swedish massages, Himalayan salt saunas, and steam rooms.",
    tag: "Wellness"
  },
  {
    title: "High-Speed Mesh Wi-Fi",
    desc: "Ultra-low-latency gigabit coverage throughout all rooms, suites, and public gardens.",
    tag: "Connectivity"
  },
  {
    title: "Chauffeur Airport Transfer",
    desc: "Complimentary luxury electric sedan transfers to and from the airport on demand.",
    tag: "Transport"
  }
];

export const GUEST_REVIEWS = [
  {
    name: "Aarav Sharma",
    location: "Mumbai, India",
    rating: 5,
    comment: "The room automation and cloud check-in was seamless. Beautiful light-filled suite, crisp linens, and stellar hospitality!",
    stayed: "Stayed in Deluxe Suite • Oct 2026"
  },
  {
    name: "Priya Nair",
    location: "Bengaluru, India",
    rating: 5,
    comment: "Stunning aesthetic! The design is so clean and modern. The food at Le Ciel was simply phenomenal. 10/10 recommendation.",
    stayed: "Stayed in Luxury Penthouse • Sep 2026"
  },
  {
    name: "Devendra Patel",
    location: "Ahmedabad, India",
    rating: 5,
    comment: "Fastest booking platform I have used. Clean, transparent pricing without hidden fees. Very impressed with the service.",
    stayed: "Stayed in Executive Suite • Oct 2026"
  }
];
