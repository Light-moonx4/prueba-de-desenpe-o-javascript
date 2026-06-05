/**
 * layout.js — Shared Application Shell
 *
 * Renders the persistent navigation bar and wraps page content
 * inside a #contenido container. Also wires up the logout button.
 */

import { clearSession, getSession } from '../../database/db.js';
import logo from '../assets/logo.png';

/**
 * Renders the top navbar + main content area into #app.
 *
 * The navbar shows:
 *  - The RIWI logo
 *  - The logged-in user's name and role badge
 *  - Navigation links (varies by role)
 *  - Logout button
 *
 * @param {string} contenido - HTML string to inject into the content area
 */
export function renderLayout(contenido) {
    const user = getSession();

    // Role badge colour: admin → red, usuario → blue
    const badgeClass = user.role === 'admin'
        ? 'bg-red-100 text-red-600'
        : 'bg-blue-100 text-blue-600';

    // admin gets extra nav links for Dashboard and reservas
    const adminLinks = user.role === 'admin' ? `
        <a href="#dashboard" class="text-sm text-gray-600 hover:text-blue-600 font-medium transition">menu</a>
        <a href="#home"      class="text-sm text-gray-600 hover:text-blue-600 font-medium transition">Reservas</a>
    ` : `
        <a href="#projects"  class="text-sm text-gray-600 hover:text-blue-600 font-medium transition">My Projects</a>
    `;

    document.getElementById('app').innerHTML = `
        <!-- ── Navigation Bar ── -->
        <nav class="bg-white shadow-sm rounded-2xl px-6 py-4 mb-6 flex justify-between items-center flex-wrap gap-3">
            <div class="flex items-center gap-6">
                <img src="${logo}" alt="RIWI" class="h-11 object-contain">
                <div class="flex items-center gap-4">
                    ${adminLinks}
                </div>
            </div>
            <div class="flex items-center gap-4">
                <!-- User info + role badge -->
                <span class="text-sm text-gray-500">
                    ${user.name}
                    <span class="ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${badgeClass}">
                        ${user.role}
                    </span>
                </span>
                <!-- Logout button -->
                <button id="btn-logout"
                        class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition">
                    Logout
                </button>
            </div>
        </nav>

        <!-- ── Page Content ── -->
        <div id="contenido">
            ${contenido}
        </div>
    `;

    // Wire up logout: clear session and go to login
    document.getElementById('btn-logout').addEventListener('click', () => {
        clearSession();
        window.location.hash = '#login';
    });
}
