// ui.js

// ===========================
// ui.js — DOM Rendering Layer
// ===========================
//
// Responsible for visual updates:
//   • Rendering the goal list
//   • Rendering the summary section
//   • Handling in-list buttons (edit, delete, mark completed)
//
// ===========================

// Dependencies
import { sortGoals } from "./utils.js";

/**
 * Render all goals into the list container.
 * @param {Array} goals - Array of Goal objects.
 * @param {Function} onEdit - Callback when user clicks edit.
 * @param {Function} onDelete - Callback when user clicks delete.
 * @param {Function} onComplete - Callback when user marks completed/uncompleted.
 */
export function renderGoals(goals, onEdit, onDelete, onComplete) {
  const listEl = document.getElementById("goal-list");
  const emptyNote = document.getElementById("empty-note");

  if (!listEl || !emptyNote) return; // This prevents a runtime error if either element ID changes (defensive code).
  listEl.innerHTML = "";

  if (!goals || goals.length === 0) {
    emptyNote.style.display = "block";
    return;
  }

  emptyNote.style.display = "none";

  // Sort goals (high priority and active ones first)
  const sorted = sortGoals(goals);

  sorted.forEach((goal) => {
    const li = document.createElement("li");
    li.className = "goal-item";
    if (goal.isCompleted) li.classList.add("completed");

    const priorityIcons = {
      high: "🟥",
      medium: "🟧",
      low: "🟨",
    };

    // Build markup
    li.innerHTML = `
      <div class="goal-header">
        <h3 class="goal-title">
        <span class="priority-icon">${
          priorityIcons[goal.priority] || "🌱"
        }</span>
        ${goal.title}
        </h3>        
      </div>

      ${
        goal.description
          ? `<div class="goal-details">
        <p class="goal-desc">${goal.description}</p>        
      </div>`
          : ""
      }        

      <div class="goal-controls">
        <button data-id="${
          goal.id
        }" class="complete-btn" title="Mark complete/incomplete">${
      goal.isCompleted ? "↩️ Undo" : "✅ Complete"
    }</button>
        <button data-id="${
          goal.id
        }" class="edit-btn" title="Edit goal">✏️ Edit</button>
        <button data-id="${
          goal.id
        }" class="delete-btn" title="Delete goal">🗑️ Delete</button>
      </div>
    `;

    // Attach event listeners (delegated callbacks)
    li.querySelector(".complete-btn").addEventListener("click", () =>
      onComplete(goal.id)
    );
    li.querySelector(".edit-btn").addEventListener("click", () =>
      onEdit(goal.id)
    );
    li.querySelector(".delete-btn").addEventListener("click", () =>
      onDelete(goal.id)
    );

    // ---- Read more logic ----
    if (goal.description && goal.description.length > 150) {
      const descEl = li.querySelector(".goal-desc");
      const detailsEl = li.querySelector(".goal-details");

      // Create button
      const readMoreBtn = document.createElement("button");
      readMoreBtn.className = "read-more-btn";
      readMoreBtn.textContent = "Read more";

      readMoreBtn.addEventListener("click", () => {
        descEl.classList.toggle("expanded");
        readMoreBtn.textContent = descEl.classList.contains("expanded")
          ? "Show less"
          : "Read more";
      });

      detailsEl.appendChild(readMoreBtn);
    }

    listEl.appendChild(li);
  });
}

/**
 * Render the summary card with quick stats.
 * @param {Array} goals
 */
export function renderSummary(goals) {
  const summaryEl = document.getElementById("summary");
  if (!summaryEl) return;

  // Clear previous content
  summaryEl.innerHTML = "";

  if (!goals || goals.length === 0) {
    // Remove summary styling when empty
    summaryEl.classList.remove("summary");
    return;
  }

  // Add summary styling only when there are goals
  summaryEl.classList.add("summary");

  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.isCompleted).length;
  const activeGoals = totalGoals - completedGoals;

  summaryEl.innerHTML = `
    <div class="summary-card">
      <div class="summary-item">
        <span class="emoji">📋</span>
        <strong>${totalGoals}</strong>
        <small>Total</small>
      </div>
      <div class="summary-item">
        <span class="emoji">✔️</span>
        <strong>${completedGoals}</strong>
        <small>Completed</small>
      </div>
      <div class="summary-item">
        <span class="emoji">🏃</span>
        <strong>${activeGoals}</strong>
        <small>In Progress</small>
      </div>      
    </div>
  `;
}
