/**
 * login.controller.js — Authentication Controller
 *
 * Handles the login form submission:
 *  1. Reads email + password from the form
 *  2. Validates credentials against json-server /users
 *  3. On success: persists session and redirects by role
 *  4. On failure: shows an error message
 */

import { getUsers, setSession } from '../../database/db.js';

/**
 * Attaches a submit listener to #form-login.
 * Must be called after loginView() has been rendered into the DOM.
 */
export function initLogin() {
    const form = document.getElementById('form-login');

    form.addEventListener('submit', async function (e) {
        e.preventDefault(); // prevent full-page reload

        const email    = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value.trim();
        const errorEl  = document.getElementById('error-login');
        const btnEl    = form.querySelector('button[type="submit"]');

        // ── Loading state ──
        btnEl.disabled    = true;
        btnEl.textContent = 'Signing in…';
        errorEl.classList.add('hidden');

        try {
            // Fetch all users and look for a matching email + password
            const users = await getUsers();
            const user  = users.find(u => u.email === email && u.password === password);

            if (user) {
                // Store session and redirect to the role-appropriate view
                setSession(user);
                window.location.hash = user.role === 'admin' ? '#dashboard' : '#projects';
            } else {
                // Show inline error message
                errorEl.textContent = 'Incorrect email or password. Please try again.';
                errorEl.classList.remove('hidden');
            }
        } catch (err) {
            // Network / server error
            errorEl.textContent = 'Server error. Make sure json-server is running on port 3000.';
            errorEl.classList.remove('hidden');
        } finally {
            // Restore button regardless of outcome
            btnEl.disabled    = false;
            btnEl.textContent = 'Sign In';
        }
    });
}
