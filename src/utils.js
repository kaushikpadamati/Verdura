export const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;

export const stars = (r) => "★".repeat(Math.round(r)) + "☆".repeat(5-Math.round(r));

