/**
 * Biotry API Client
 * Interfaces with the Node.js/Express backend on Railway.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://biotry-production.up.railway.app/api';

export const apiClient = {
  // --- Posts ---
  getPosts: async () => {
    const res = await fetch(`${API_BASE_URL}/posts`);
    if (!res.ok) throw new Error('Failed to fetch posts');
    return res.json();
  },

  createPost: async (postData: any) => {
    const res = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });
    if (!res.ok) throw new Error('Failed to create post');
    return res.json();
  },

  // --- Hubs ---
  getHubs: async () => {
    const res = await fetch(`${API_BASE_URL}/hubs`);
    if (!res.ok) throw new Error('Failed to fetch hubs');
    return res.json();
  },

  // --- Editors ---
  getEditors: async () => {
    const res = await fetch(`${API_BASE_URL}/editors`);
    if (!res.ok) throw new Error('Failed to fetch editors');
    return res.json();
  },

  // --- Leaderboard ---
  getLeaderboard: async () => {
    const res = await fetch(`${API_BASE_URL}/leaderboard`);
    if (!res.ok) throw new Error('Failed to fetch leaderboard');
    return res.json();
  }
};
