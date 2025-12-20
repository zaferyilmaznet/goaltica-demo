// app.js

// ===========================================
// app.js — Main Application Controller
// ===========================================
//
// Responsibilities:
//   • Initialize app (load goals, render UI)
//   • Handle form submissions (add/edit)
//   • Bind UI actions (mark completed, delete, edit)
//   • Manage localStorage & UI synchronization
//   • Register service worker
// ===========================================

import { Goal } from "./model.js";
import { loadGoals, saveGoals, clearAllGoals } from "./storage.js";
import { renderGoals, renderSummary } from "./ui.js";
import { focusAndScrollToForm } from "./utils.js";
import { initTheme, toggleTheme } from "./theme.js";

// === Global State ===
let goals = [];
let editId = null;
const MAX_GOALS = 100;

// === DOM References (declared, assigned later) ===
let form,
  toggleFormBtn,
  fabAdd,
  cancelEditBtn,
  clearDataBtn,
  themeToggleBtn,
  titleInput,
  descInput,
  charCounter,
  priorityInput;

// === Initialization ===
document.addEventListener("DOMContentLoaded", initApp);

function initApp() {
  // Assign all after DOM ready
  form = document.getElementById("goal-form");
  toggleFormBtn = document.getElementById("toggle-form-btn");
  fabAdd = document.getElementById("fab-add");
  cancelEditBtn = document.getElementById("cancel-edit");
  clearDataBtn = document.getElementById("clear-data");
  themeToggleBtn = document.getElementById("theme-toggle");

  titleInput = document.querySelector("#goal-title");
  descInput = document.querySelector("#goal-description");
  charCounter = document.querySelector("#char-counter");
  priorityInput = document.querySelector("#priority");

  try {
    initTheme();
    goals = loadGoals() || [];
    renderAll();
  } catch (err) {
    console.error("Failed to initialize app:", err);
    goals = [];
  }

  // This way, event binding is cleanly separated and the app doesn’t break even if storage fails.
  bindEvents();

  // Initialize search bar behavior
  initSearch(
    goals,
    renderGoals,
    handleEdit,
    handleDelete,
    handleToggleCompleted
  );

  if (descInput && charCounter) {
    descInput.addEventListener("input", () => {
      const max = descInput.maxLength || 1000;
      const current = descInput.value.length;
      charCounter.textContent = `${current} / ${max}`;
      charCounter.classList.toggle("limit", current >= max * 0.95);
    });
  }
}

function bindEvents() {
  // null-checks on DOM elements (defensive programming)
  if (form) form.addEventListener("submit", handleSubmit);
  if (cancelEditBtn) cancelEditBtn.addEventListener("click", resetForm);
  if (toggleFormBtn)
    toggleFormBtn.addEventListener("click", toggleFormVisibility);
  if (fabAdd) fabAdd.addEventListener("click", toggleFormVisibility);
  if (clearDataBtn) clearDataBtn.addEventListener("click", handleClearAll);
  if (themeToggleBtn) themeToggleBtn.addEventListener("click", toggleTheme);
}

// === Core Functions ===

// Handle add / edit form submission
function handleSubmit(e) {
  e.preventDefault();

  const title = titleInput?.value.trim() || "";
  const description = descInput?.value.trim() || "";
  const priority = priorityInput?.value || "medium";

  if (!title) return;

  if (editId) {
    // Find existing goal first
    const idx = goals.findIndex((g) => g.id === editId);

    if (idx !== -1) {
      const itemToUpdate = goals[idx];
      // Update the existing goal with class method
      itemToUpdate.update({ title, description, priority });
      saveGoals(goals); // saveGoals can now call .toJSON() successfully
    }
    editId = null;
  } else {
    // Add new goal
    if (goals.length >= MAX_GOALS) {
      alert(`You can only have up to ${MAX_GOALS} goals.`);
      return;
    }

    const newGoal = new Goal(title, description, priority);
    goals.push(newGoal);
    saveGoals(goals);
  }

  resetForm();
  renderAll();
}

// Render everything again
function renderAll() {
  goals = loadGoals(); // re-sync
  renderGoals(goals, handleEdit, handleDelete, handleToggleCompleted);
  renderSummary(goals);
}

// Edit existing goal
function handleEdit(id) {
  const goal = goals.find((g) => g.id === id);
  if (!goal) return;

  // ---- 1️⃣ Populate form fields ----
  titleInput.value = goal.title;
  descInput.value = goal.description;
  priorityInput.value = goal.priority;

  // ---- 2️⃣ Update form state ----
  editId = id;
  form.querySelector("button[type='submit']").textContent = "Update Goal";
  cancelEditBtn.style.display = "inline-block";

  // ---- 3️⃣ Make sure the form is visible ----
  showForm(); // must make form visible (remove display:none etc.)

  // ---- 4️⃣ Smooth scroll and focus ----
  focusAndScrollToForm(form);
}

// Delete goal
function handleDelete(id) {
  if (confirm("Delete this goal permanently?")) {
    goals = goals.filter((g) => g.id !== id);
    saveGoals(goals);
    renderAll();
  }
}

// Toggle completed / uncompleted
function handleToggleCompleted(id) {
  // 1. Find the goal instance using the goal ID
  const goal = goals.find((g) => g.id === id);

  if (goal) {
    // 2. Modify the local array's state directly
    // This flips the 'isCompleted' property for the found goal instance (by reference)
    goal.isCompleted = !goal.isCompleted;

    // 3. Persist the *entire* modified array back to storage
    // saveGoals handles stringifying the whole 'goals' array and storing it.
    saveGoals(goals);

    // 4. Update the UI
    renderAll();
  }
}

// Clear all stored data
function handleClearAll() {
  if (confirm("⚠️ Clear all goal items? This cannot be undone.")) {
    clearAllGoals();
    goals = [];
    renderAll();
  }
}

// Search functionality
function initSearch(
  goals,
  renderGoals,
  handleEdit,
  handleDelete,
  handleToggleCompleted
) {
  const searchInput = document.getElementById("searchInput");
  const emptyNote = document.getElementById("empty-note");

  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim().toLowerCase();

    const filtered = goals.filter(
      (goal) =>
        goal.title.toLowerCase().includes(query) ||
        (goal.description && goal.description.toLowerCase().includes(query))
    );

    renderGoals(filtered, handleEdit, handleDelete, handleToggleCompleted);

    if (emptyNote) {
      if (filtered.length === 0 && goals.length > 0) {
        emptyNote.textContent = "No matching goals found.";
        emptyNote.style.display = "block";
      } else if (goals.length === 0) {
        emptyNote.textContent = "No goals yet — start your first one above!";
        emptyNote.style.display = "block";
      } else {
        emptyNote.style.display = "none";
      }
    }
  });
}

// === Form Helpers ===

function resetForm() {
  form.reset();
  editId = null;
  cancelEditBtn.style.display = "none";
  form.querySelector("button[type='submit']").textContent = "Add Goal";
  hideForm();
}

function toggleFormVisibility() {
  const formSection = document.getElementById("form-section");
  const isVisible = formSection.classList.toggle("visible");

  // Show or hide the form (That line overrides the display: flex; rule in CSS.)
  // form.style.display = isVisible ? "block" : "none";

  // Update both buttons (main + floating)
  const icon = isVisible ? "x" : "+";
  toggleFormBtn.textContent = icon;
  fabAdd.textContent = icon;

  // When form is shown, scroll smoothly and focus
  if (isVisible) {
    focusAndScrollToForm(form);
  }
}

function showForm() {
  document.getElementById("form-section").classList.add("visible");
  // form.style.display = "block"; // That line overrides the display: flex; rule in CSS.
  toggleFormBtn.textContent = "x";
  fabAdd.textContent = "x";
}

function hideForm() {
  document.getElementById("form-section").classList.remove("visible");
  // form.style.display = "none"; // That line overrides the display: flex; rule in CSS.
  toggleFormBtn.textContent = "+";
  fabAdd.textContent = "+";
}

// ================================
// PWA: Service Worker Registration
// ================================
//
// Registers the service worker (if supported by browser)
// to enable offline access, caching, and installation prompt.
//

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const reg = await navigator.serviceWorker.register("./service-worker.js");
      console.log("✅ Service Worker registered:", reg.scope);

      // ======================================================
      // --- Detect waiting SW and prompt user to refresh ---
      if (reg.waiting) {
        showUpdatePrompt(reg);
      }

      // --- Listen for new SW installing ---
      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing;
        if (!newWorker) return;

        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            showUpdatePrompt(reg);
          }
        });
      });
      // ======================================================
    } catch (err) {
      console.warn("⚠️ Service Worker registration failed:", err);
    }
  });
}

// ==========================================================
// --- Helper: Prompt user to refresh when new SW is ready ---
// ==========================================================
function showUpdatePrompt(registration) {
  const confirmUpdate = confirm(
    "A new version of Goaltica is available. Refresh now?"
  );

  if (confirmUpdate && registration.waiting) {
    // Tell the waiting SW to activate immediately
    registration.waiting.postMessage({ type: "SKIP_WAITING" });

    // Reload the app to load the new version
    window.location.reload();
  }
}
