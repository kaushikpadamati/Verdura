// Mock API service for plants
// In production, replace this with actual API calls to your backend

import plantData from '../data/plants.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const plantsAPI = {
  // Get all plants
  getAllPlants: async () => {
    await delay(300); // Simulate network delay
    return plantData;
  },

  // Get plants by category
  getByCategory: async (category) => {
    await delay(300);
    if (category === 'All') return plantData;
    return plantData.filter(p => p.cat === category);
  },

  // Search plants
  searchPlants: async (query) => {
    await delay(300);
    const q = query.toLowerCase();
    return plantData.filter(
      p => p.name.toLowerCase().includes(q) || 
           p.cat.toLowerCase().includes(q) ||
           p.desc.toLowerCase().includes(q)
    );
  },

  // Get plant by ID
  getPlantById: async (id) => {
    await delay(300);
    return plantData.find(p => p.id === id);
  },

  // Get featured plants (with badge)
  getFeaturedPlants: async () => {
    await delay(300);
    return plantData.filter(p => p.badge).slice(0, 4);
  },

  // Get plants with pagination
  getPlantsPaginated: async (page = 1, limit = 12) => {
    await delay(300);
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      plants: plantData.slice(start, end),
      total: plantData.length,
      pages: Math.ceil(plantData.length / limit),
      currentPage: page,
    };
  },

  // Sort plants
  sortPlants: async (sortBy = 'default') => {
    await delay(300);
    const sorted = [...plantData];
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'reviews':
        return sorted.sort((a, b) => b.reviews - a.reviews);
      default:
        return sorted;
    }
  },
};

export default plantsAPI;
