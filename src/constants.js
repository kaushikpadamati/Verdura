export const T = {
  white:   "#FFFFFF",
  offWhite:"#F8FAF7",
  surface: "#F1F6F0",
  border:  "#DDE8DB",
  green50: "#EBF4E9",
  green200:"#A8CFA1",
  green500:"#3D8B37",
  green700:"#265922",
  green900:"#152F12",
  accent:  "#5BA55A",
  text:    "#1A2E18",
  muted:   "#6B7F69",
  light:   "#9DB09B",
  danger:  "#E05252",
  // Dark mode tokens
  dark: {
    bg:      "#0A1411",
    surface: "#141F1A",
    card:    "#1A2921",
    border:  "#2A3A32",
    text:    "#E8F5E8",
    muted:   "#A8C5A8",
    light:   "#7A9A7A",
    nav:     "#0F1A15",
  }
};

export const CARE_GUIDES = [
  { icon:"W", title:"Watering Right",     body:"Most plants die from too much water, not too little. Feel the top inch of soil — dry means water, moist means wait. Always use pots with drainage holes and empty saucers after 30 minutes." },
  { icon:"S", title:"Reading the Light",  body:"'Bright indirect' means near a window but out of direct rays. A sheer curtain is your best friend. Rotate plants quarterly so all sides receive even light for upright, balanced growth." },
  { icon:"P", title:"Soil & Repotting",   body:"Repot every 1–2 springs into a pot just 2 inches larger. Use a mix matched to your plant — cacti need grit, tropicals need richness. Roots peeking from the drainage hole? Time to upgrade." },
  { icon:"H", title:"Humidity & Seasons", body:"Tropical plants thrive with humidity. Group plants together, use a pebble tray, or mist occasionally. Ease off watering in winter when growth naturally slows — plants rest too." },
];

export const REVIEWS = [
  { name:"Priya S.",  plant:"Monstera Deliciosa",  rating:5, text:"Arrived with new growth already showing. Packaged so well — not a single leaf damaged. Looks unreal in my living room.", avatar:"P" },
  { name:"James L.",  plant:"Bird of Paradise",    rating:5, text:"Much larger than expected. Customer service helped me pick the right spot. It's already unfurling a new leaf!", avatar:"J" },
  { name:"Meera K.",  plant:"Philodendron Brasil", rating:5, text:"So lush and bushy — I've bought three now as gifts. Everyone asks where I got it. Will always shop here.", avatar:"M" },
  { name:"Arjun T.",  plant:"Aloe Vera",           rating:4, text:"Sturdy, healthy, exactly as described. Delivery was prompt. Very happy with the packaging too.", avatar:"A" },
];

export const CATS = ["All","Indoor","Succulent","Outdoor","Rare"];

export const COUNTRIES = {
  "IN": { name: "India", code: "+91", pattern: /^[6-9]\d{9}$/ },
  "US": { name: "United States", code: "+1", pattern: /^\d{10}$/ },
  "UK": { name: "United Kingdom", code: "+44", pattern: /^[0-9]{10,11}$/ },
  "CA": { name: "Canada", code: "+1", pattern: /^\d{10}$/ },
  "AU": { name: "Australia", code: "+61", pattern: /^[2-9]\d{8}$/ },
  "SG": { name: "Singapore", code: "+65", pattern: /^[6-9]\d{7}$/ },
};

