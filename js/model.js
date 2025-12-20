// js/model.js

// ==========================================================
// model.js — Core data model for Goaltica
// Defines a single Goal class with serialization helpers
// ==========================================================

import { generateId } from "./utils.js";

/**
 * Goal class
 * Represents a single goal with a title, description, and priority
 */
export class Goal {
  /**
   * @param {string} title - Goal title
   * @param {string} description - Optional goal description
   * @param {"high"|"medium"|"low"} priority - Goal priority
   */
  constructor(title, description = "", priority = "medium") {
    this.id = generateId();
    this.title = title.trim();
    this.description = description.trim();
    this.priority = priority.trim().toLowerCase();
    this.createdAt = new Date().toISOString();
    this.isCompleted = false;
  }

  /**
   * Update method
   */
  update({ title, description, priority }) {
    if (title !== undefined) this.title = title.trim();
    if (description !== undefined) this.description = description.trim();
    if (priority !== undefined) this.priority = priority.trim().toLowerCase();
    // Preserve other properties (like id, isCompleted, etc.)
  }

  /**
   * Toggle completion state of the goal
   */
  toggleCompleted() {
    this.isCompleted = !this.isCompleted;
    return this;
  }

  /**
   * Convert to plain JSON-safe object for localStorage (serialization)
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      priority: this.priority,
      createdAt: this.createdAt,
      isCompleted: this.isCompleted,
    };
  }

  /**
   * Rehydrate a Goal instance from stored object (deserialization)
   * @param {Object} obj - Raw data from localStorage
   * @returns {Goal}
   */
  static fromJSON(obj) {
    const goal = new Goal(
      obj.title || "Untitled Goal",
      obj.description || "",
      obj.priority || "medium"
    );

    // Only override fields if they exist
    if (obj.id) goal.id = obj.id;
    if (obj.createdAt) goal.createdAt = obj.createdAt;
    if (typeof obj.isCompleted === "boolean")
      goal.isCompleted = obj.isCompleted;

    return goal;
  }
}

// ==========================================================
// Example usage (for developer reference only)
// ----------------------------------------------------------
// const g = new Goal("Learn Spanish", "Practice daily on Duolingo", "high");
// console.log(g.isCompleted); // false
// g.toggleCompleted();
// console.log(g.isCompleted); // true
// localStorage.setItem("goal", JSON.stringify(g.toJSON()));
// ==========================================================
