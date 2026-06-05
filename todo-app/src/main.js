/**
 * main.js — SPA Router
 *
 * Entry point of the application. Implements a hash-based router
 * that listens to URL hash changes and renders the appropriate view.
 * Also enforces authentication guards and role-based access control.
 */

import { loginView }     from './views/loginView.js';
import { homeView }      from './views/homeView.js';
import { userView }      from './views/userView.js';
import { dashboardView } from './views/dashboardView.js';
import { notFoundView }  from './views/notFoundView.js';
import { initLogin }     from './controllers/login.controller.js';
import { initHome }      from './controllers/project.controller.js';
import { initUser }      from './controllers/project.controller.js';
import { initDashboard } from './controllers/dashboard.controller.js';
import { renderLayout }  from './components/layout.js';
import { getSession }    from '../database/db.js';

/** Root DOM element where all views are rendered */
const app = document.getElementById('app');

/**
 * router() — resolves the current hash and renders the matching view.
 *
 * Guard logic:
 *  - No session  → redirect to #login
 *  - Session + on login page → redirect to role-appropriate dashboard
 *  - reservas tries to access #home → redirect to #projects
 */
async function router() {
    const hash   = window.location.hash;
    const session = getSession();

    // ── Auth guard: unauthenticated users can only see login ──
    if (!session && hash !== '#login' && hash !== '') {
        window.location.hash = '#login';
        return;
    }

    // ── Already logged-in users skip the login page ──
    if (session && (hash === '#login' || hash === '')) {
        window.location.hash = session.role === 'admin' ? '#dashboard' : '#projects';
        return;
    }

    // ── Route matching ──
    switch (hash) {
        case '':
        case '#login':
            // Public route: render login form
            app.innerHTML = loginView();
            initLogin();
            break;

        case '#dashboard':
            // admin-only: high-level stats overview
            if (session?.role !== 'admin') {
                window.location.hash = '#projects';
                return;
            }
            renderLayout(dashboardView());
            await initDashboard();
            break;

        case '#home':
            // admin-only: full project management (CRUD)
            if (session?.role !== 'admin') {
                window.location.hash = '#projects';
                return;
            }
            renderLayout(homeView());
            await initHome();
            break;

        case '#projects':
            // reservas route: see & update own projects
            renderLayout(userView());
            await initUser();
            break;

        default:
            // 404 fallback
            app.innerHTML = notFoundView();
    }
}

// ── Event listeners that trigger the router ──
window.addEventListener('hashchange', router);
window.addEventListener('load', router);
