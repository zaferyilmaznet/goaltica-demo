// js/theme.js

// ==========================================================
// theme.js — Handles dark/light theme toggle for Goaltica
// Uses document.documentElement.dataset.theme for state
// ==========================================================

// ---- Constants ----
const THEME_KEY = "goaltica-theme";

// ---- Selectors (must be outside functions for event binding) ----
const themeToggleBtn = document.getElementById("theme-toggle");
const htmlElement = document.documentElement; // Targets the <html> element

/**
 * Apply the given theme to the document
 * This is the core function that updates the DOM and stores preference.
 * @param {"light"|"dark"} theme
 */
function applyTheme(theme) {
  // 1. Set the data-theme attribute on the <html> element
  htmlElement.dataset.theme = theme;

  // 2. Persist the selection to localStorage
  localStorage.setItem(THEME_KEY, theme);

  // 3. Update the PWA theme-color meta tag (Best Practice)
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    // Define colors for PWA header bar based on theme
    metaTheme.setAttribute("content", theme === "dark" ? "#121212" : "#1976d2");
  }
}

/**
 * Detect user’s preferred theme from system settings
 * @returns {"light"|"dark"}
 */
function getSystemTheme() {
  // Check if user prefers dark mode based on their OS/browser settings
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Update the theme toggle button label (icon + text)
 * @param {"light"|"dark"} theme - The theme that is currently active.
 */
function updateButtonLabel(theme) {
  if (!themeToggleBtn) return;

  // Show the button label for the mode the user is switching *to*.
  themeToggleBtn.textContent =
    theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode";
}

/**
 * Initialize theme from saved preference or system default
 */
export function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);

  // 1. Determine the theme: Saved > System Default
  const theme = savedTheme || getSystemTheme();

  // 2. Apply theme and update button
  applyTheme(theme);
  updateButtonLabel(theme);

  // [Optional Enhancement]: Listen for OS theme changes
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      // Only switch if the user hasn't explicitly set a preference (savedTheme is null)
      if (!localStorage.getItem(THEME_KEY)) {
        const systemTheme = e.matches ? "dark" : "light";
        applyTheme(systemTheme);
        updateButtonLabel(systemTheme);
      }
    });
}

/**
 * Toggle between light and dark theme.
 * Explicitly saves the user's choice.
 */
export function toggleTheme() {
  // Get current theme from the dataset (fallback to 'light')
  const current = htmlElement.dataset.theme || "light";
  const next = current === "dark" ? "light" : "dark";

  // Apply new theme, save preference, and update button label
  applyTheme(next);
  updateButtonLabel(next);
}

/*
 * Why this code block is commented out 
 * Since theme.js is an ES module, this code runs immediately on import — before the DOM is fully parsed. 
 * If the <button id="theme-toggle"> doesn’t exist yet, themeToggleBtn will be null, and no event listener will bind. 
 * By removing that block, theme.js becomes a pure module: it only defines functions and constants, 
 * leaving control of when to run initialization to the main orchestrator (app.js).
 *  
 * 
// --- Execution and Event Binding ---

// 1. Initialize the theme when the script module loads (auto-initialization)
initTheme();

// 2. Attach the toggle function to the button click (Event Binding)
if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", toggleTheme);
}

 */
