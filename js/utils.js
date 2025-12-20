// js/utils.js

/**
 * Generate a unique ID (simple local approach for now)
 * Uses substring() to replace deprecated substr()
 * @returns {string} A unique ID string.
 */
export function generateId() {
  // Math.random().toString(36) gives us a long alphanumeric string.
  // substring(startIndex, endIndex) - starts at index 2 and takes the next 9 characters (end index 11).
  return "g_" + Math.random().toString(36).substring(2, 11) + Date.now();
}

// Define the priority order once as a module-level constant
const PRIORITY_ORDER = {
  high: 3,
  medium: 2,
  low: 1,
  default: 0, // Safely handle undefined/missing priorities
};
/**
 * Sort goals based on two criteria:
 * 1. Completion status (Active/Not Completed first)
 * 2. Priority (High priority first)
 * @param {Goal[]} goals - The array of Goal objects to sort.
 * @returns {Goal[]} A new array of sorted Goal objects.
 */
export function sortGoals(goals) {
  // 1. Create a shallow copy to prevent modifying the original array
  return [...goals].sort((a, b) => {
    // --- CRITERIA 1: Completion Status (Not Completed first) ---
    // If a is completed (true), aCompleted is 1. If b is completed (true), bCompleted is 1.
    const aCompleted = a.isCompleted ? 1 : 0;
    const bCompleted = b.isCompleted ? 1 : 0;

    if (aCompleted !== bCompleted) {
      // If they are different, the difference (a - b) will place 0 (Not Completed) first.
      return aCompleted - bCompleted;
    }

    // --- CRITERIA 2: Priority (High Priority first) ---
    // Use a safe access pattern (e.g., ?? PRIORITY_ORDER['default'])
    const aPriorityValue = PRIORITY_ORDER[a.priority] ?? PRIORITY_ORDER.default;
    const bPriorityValue = PRIORITY_ORDER[b.priority] ?? PRIORITY_ORDER.default;

    if (aPriorityValue !== bPriorityValue) {
      // Descending sort: b - a puts the higher value (High priority) first.
      return bPriorityValue - aPriorityValue;
    }

    // --- CRITERIA 3 (Optional tie-breaker): Creation Date/ID ---
    // If priorities are equal, maintain original relative order or sort by title/ID
    return 0;
  });
}

/**
 * Smoothly scrolls the form into view, focuses the title field,
 * and adds a temporary highlight to draw attention.
 */
export function focusAndScrollToForm(formEl) {
  if (!formEl) return;

  const focusTarget = formEl.title || formEl.querySelector("#goal-title");

  const doScroll = () => {
    formEl.scrollIntoView({ behavior: "smooth", block: "start" });

    // Focus + select input for better UX
    if (focusTarget) {
      focusTarget.focus();
      if (typeof focusTarget.select === "function") focusTarget.select();
    }

    // Temporary highlight pulse
    formEl.classList.add("highlight");
    setTimeout(() => formEl.classList.remove("highlight"), 1200);
  };

  // Use animation frame for smoother timing
  if (window.requestAnimationFrame) {
    requestAnimationFrame(() => requestAnimationFrame(doScroll));
  } else {
    setTimeout(doScroll, 100);
  }
}
