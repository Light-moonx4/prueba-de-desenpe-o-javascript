/**
 * dashboard.controller.js — Dashboard Stats Controller
 *
 * Fetches all projects once and computes:
 *  - Total projects
 *  - Active (In Progress) projects
 *  - reservado projects
 *
 * Then injects the values into the stat cards rendered by dashboardView().
 */

import { getProjects } from '../../database/db.js';

/**
 * initDashboard() — populates the stat cards in the admin dashboard.
 *
 * Reads three DOM elements by id and sets their textContent:
 *   #stat-total      → total number of projects
 *   #stat-active     → projects with status "In Progress"
 *   #stat-reservado  → projects with status "reservado"
 */
export async function initDashboard() {
    try {
        const projects = await getProjects();

        const total     = projects.length;
        const active    = projects.filter(p => p.status === 'In Progress').length;
        const reservado = projects.filter(p => p.status === 'reservado').length;
        const pending   = projects.filter(p => p.status === 'Pending').length;

        // Inject stat values into the pre-rendered card slots
        const setEl = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };

        setEl('stat-total',     total);
        setEl('stat-active',    active);
        setEl('stat-reservado', reservado);
        setEl('stat-pending',   pending);

    } catch (err) {
        console.error('Dashboard load error:', err);
    }
}
