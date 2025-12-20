// js/storage.js

// js/storage.js
// --------------------------------------------
// Handles saving and loading data for Goaltica
// Uses localStorage for now (simple & offline-first)
// Later can be replaced with IndexedDB or a backend API
// --------------------------------------------

import { Goal } from "./model.js";

const STORAGE_KEY = "goaltica-data-v1-0-0-alpha-1";

/**
 * Load all goals from localStorage
 * @returns {Goal[]} Array of Goal objects
 */
export function loadGoals() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!data || !Array.isArray(data)) return [];
    return data.map((g) => Goal.fromJSON(g));
  } catch (err) {
    console.error("Failed to load goals:", err);
    return [];
  }
}

/**
 * Save all goals to localStorage
 * @param {Goal[]} goals - Array of Goal objects
 */
export function saveGoals(goals) {
  try {
    const json = JSON.stringify(goals.map((g) => g.toJSON()));
    localStorage.setItem(STORAGE_KEY, json);
  } catch (err) {
    console.error("Failed to save goals:", err);
  }
}

/**
 * Clear all goals (used in Settings)
 */
export function clearAllGoals() {
  localStorage.removeItem(STORAGE_KEY);
}
