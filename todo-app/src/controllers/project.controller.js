/**
 * project.controller.js — Project CRUD Controller
 *
 * Exports two init functions:
 *  - initHome()  → wires up the admin view (full CRUD)
 *  - initUser()  → wires up the usuario view (status-only updates)
 *
 * Shared helpers (renderProjects, loadProjects, modal) are kept private
 * to this module and reused by both init functions.
 */

import {
    getProjects, getUsers,
    createProject, updateProject, deleteProject,
    getSession
} from '../../database/db.js';

// ─── Utility helpers ──────────────────────────────────────────────────────────

/**
 * Returns a Tailwind badge HTML string for a given project status.
 * @param {string} status
 * @returns {string} HTML <span> element
 */
function statusBadge(status) {
    const colours = {
        'Pending':     'bg-gray-100 text-gray-600',
        'In Progress': 'bg-yellow-100 text-yellow-700',
        'reservado':   'bg-green-100 text-green-700'
    };
    const cls = colours[status] || 'bg-gray-100 text-gray-600';
    return `<span class="px-2 py-1 rounded-full text-xs font-medium ${cls}">${status}</span>`;
}

// ─── Rendering ────────────────────────────────────────────────────────────────

/**
 * Renders project cards into #contenedor-proyectos.
 *
 * @param {Array}   projects  - Array of project objects to display
 * @param {boolean} isadmin - If true, shows Edit / Delete buttons;                             if false, shows a status-only dropdown
 * @param {Array}   users     - Full user list (for resolving assignedTo → name)
 */
function renderProjects(projects, isadmin, users) {
    const container = document.getElementById('contenedor-proyectos');
    if (!container) return;

    if (projects.length === 0) {
        container.innerHTML = `<p class="text-gray-400 text-sm col-span-full text-center py-8">No projects found.</p>`;
        return;
    }

    container.innerHTML = projects.map(project => {
        // Resolve the Sala user's name from the users array
        const Sala = users.find(u => u.id === project.assignedTo);
        const SalaName = Sala ? Sala.name : 'Unassigned';

        // Buttons differ by role:
        // admin → Edit + Delete
        // usuario → Status dropdown only
        const actions = isadmin ? `
            <div class="flex gap-2 pt-3 border-t border-gray-100 mt-3">
                <button data-id="${project.id}"
                        class="btn-edit flex-1 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600
                               text-white rounded-lg text-xs font-medium transition">
                    Edit
                </button>
                <button data-id="${project.id}"
                        class="btn-delete flex-1 px-3 py-1.5 bg-red-500 hover:bg-red-600
                               text-white rounded-lg text-xs font-medium transition">
                    Delete
                </button>
            </div>
        ` : `
            <div class="pt-3 border-t border-gray-100 mt-3">
                <label class="block text-xs text-gray-500 mb-1">Update Status</label>
                <select data-id="${project.id}"
                        class="select-status w-full px-3 py-1.5 border border-gray-200
                               rounded-lg text-xs focus:outline-none focus:border-blue-500">
                    <option value="Pending"     ${project.status === 'Pending'     ? 'selected' : ''}>Pending</option>
                    <option value="In Progress" ${project.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                    <option value="reservado"   ${project.status === 'reservado'   ? 'selected' : ''}>reservado</option>
                </select>
            </div>
        `;

        return `
            <div class="bg-white rounded-xl shadow p-5 space-y-2 hover:shadow-md transition">
                <div class="flex justify-between items-start gap-2">
                    <h3 class="font-semibold text-gray-800 text-sm leading-snug">${project.name}</h3>
                    ${statusBadge(project.status)}
                </div>
                <p class="text-xs text-gray-500 leading-relaxed">${project.description}</p>
                <div class="text-xs text-gray-400 space-y-1">
                    <div>👤 <span class="font-medium text-gray-600">${SalaName}</span></div>
                    <div>📅 ${project.createdAt || 'N/A'}</div>
                </div>
                ${actions}
            </div>
        `;
    }).join('');

    // ── Attach action listeners ──
    if (isadmin) {
        // Edit button → open modal pre-filled with project data
        container.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', async () => {
                const proj = projects.find(p => p.id === btn.dataset.id);
                if (proj) showProjectModal(proj, users, isadmin,projects);
            });
        });

        // Delete button → confirm then call API
        container.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (!confirm('Delete this project? This action cannot be undone.')) return;
                try {
                    await deleteProject(btn.dataset.id);
                    showToast('Project deleted.', 'error');
                    await loadProjects(isadmin);
                } catch {
                    showToast('Error deleting project.', 'error');
                }
            });
        });
    } else {
        // usuario status dropdown
        container.querySelectorAll('.select-status').forEach(select => {
            select.addEventListener('change', async (e) => {
                try {
                    await updateProject(e.target.dataset.id, { status: e.target.value });
                    showToast('Status updated!', 'success');
                    await loadProjects(isadmin);
                } catch {
                    showToast('Error updating status.', 'error');
                }
            });
        });
    }
}

// ─── Data loading ─────────────────────────────────────────────────────────────

/**
 * Fetches projects (and users for name resolution), applies active
 * filters, then calls renderProjects().
 *
 * @param {boolean} isadmin
 */
async function loadProjects(isadmin) {
    const session  = getSession();
    const [projects, users] = await Promise.all([getProjects(), getUsers()]);

    // Read current filter values from the DOM
    const search = document.getElementById('filtro-busqueda')?.value.toLowerCase() || '';
    const status = document.getElementById('filtro-status')?.value || '';

    let filtered = projects;

    // usuarios only see their own assigned projects
    if (!isadmin) {
        filtered = filtered.filter(p => p.assignedTo === session.id);
    }

    // Text search (project name)
    if (search) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(search));
    }

    // Status filter
    if (status) {
        filtered = filtered.filter(p => p.status === status);
    }

    renderProjects(filtered, isadmin, users);
}

// ─── Project modal (create / edit) ────────────────────────────────────────────

/**
 * Builds and injects a modal dialog for creating or editing a project.
 *
 * @param {Object|null} project  - Existing project to edit, or null to create
 * @param {Array}       users    - Full user list (for the Sala dropdown)
 * @param {boolean}     isadmin
 * @param {Array}       projects -salas
 */
async function showProjectModal(project = null, users = [], isadmin = true) {
    const isEdit = project !== null;
    const title  = isEdit ? 'Edit Project' : 'New Reservation';

    // Build <option> elements for the Sala field
    const userOptions = users.map(u => `
        <option value="${u.id}" ${isEdit && project.assignedTo === u.id ? 'selected' : ''}>
            ${u.name} (${u.role})
        </option>
    `).join('');

    // Create modal overlay
    const modal = document.createElement('div');
    modal.id        = 'modal-project';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';

    modal.innerHTML = `
        <div class="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
            <h2 class="text-xl font-bold mb-6">${title}</h2>
            <div class="space-y-4">
                <!-- Name -->
                <div>
                    <label class="block text-sm font-medium mb-1">Project Name *</label>
                    <input id="modal-name" type="text"
                           value="${isEdit ? project.name : ''}"
                           placeholder="Enter project name"
                           class="w-full px-4 py-3 border border-gray-200 rounded-lg
                                  focus:outline-none focus:border-blue-500 text-sm">
                </div>
                <!-- Description -->
                <div>
                    <label class="block text-sm font-medium mb-1">Description *</label>
                    <textarea id="modal-desc"
                              class="w-full px-4 py-3 border border-gray-200 rounded-lg
                                     focus:outline-none focus:border-blue-500 text-sm resize-none"
                              rows="3"
                              placeholder="Brief project description">${isEdit ? project.description : ''}</textarea>
                </div>
                <!-- Status -->
                <div>
                    <label class="block text-sm font-medium mb-1">Status</label>
                    <select id="modal-status"
                            class="w-full px-4 py-3 border border-gray-200 rounded-lg
                                   focus:outline-none focus:border-blue-500 text-sm">
                        <option value="Pending"     ${isEdit && project.status === 'Pending'     ? 'selected' : ''}>Pending</option>
                        <option value="In Progress" ${isEdit && project.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                        <option value="reservado"   ${isEdit && project.status === 'reservado'   ? 'selected' : ''}>reservado</option>
                    </select>
                </div>
                <!-- personas -->
                <div>
                    <label class="block text-sm font-medium mb-1">Sala</label>
                    <select id="modal-assigned"
                            class="w-full px-4 py-3 border border-gray-200 rounded-lg
                                   focus:outline-none focus:border-blue-500 text-sm">
                        <option value="">— Select sala —</option>
                        ${userOptions}
                    </select>
                </div>
                <!-- Error message -->
                <p id="modal-error" class="text-red-500 text-xs hidden"></p>
            </div>
            <!-- Action buttons -->
            <div class="flex gap-3 mt-6">
                <button id="modal-cancel"
                        class="flex-1 py-2.5 border border-gray-200 rounded-lg text-gray-600
                               hover:bg-gray-50 text-sm transition">
                    Cancel
                </button>
                <button id="modal-save"
                        class="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white
                               rounded-lg font-medium text-sm transition">
                    ${isEdit ? 'Save Changes' : 'Create Project'}
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Cancel → just remove the modal
    document.getElementById('modal-cancel').onclick = () => modal.remove();

    // Save → validate, call API, close modal
    document.getElementById('modal-save').onclick = async () => {
        const name        = document.getElementById('modal-name').value.trim();
        const description = document.getElementById('modal-desc').value.trim();
        const status      = document.getElementById('modal-status').value;
        const assignedTo  = document.getElementById('modal-assigned').value;
        const errorEl     = document.getElementById('modal-error');

        // Basic validation
        if (!name || !description) {
            errorEl.textContent = 'Name and description are required.';
            errorEl.classList.remove('hidden');
            return;
        }

        const payload = {
            name,
            description,
            status,
            assignedTo: assignedTo || null,
            // Set createdAt only on creation
            ...(isEdit ? {} : { createdAt: new Date().toISOString().split('T')[0] })
        };

        try {
            if (isEdit) {
                await updateProject(project.id, payload);
                showToast('Project updated!', 'success');
            } else {
                await createProject(payload);
                showToast('Project created!', 'success');
            }
            modal.remove();
            await loadProjects(isadmin);
        } catch {
            errorEl.textContent = 'Server error. Please try again.';
            errorEl.classList.remove('hidden');
        }
    };

    // Close modal when clicking the backdrop
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// ─── Toast notifications ──────────────────────────────────────────────────────

/**
 * Shows a small toast notification at the bottom of the screen.
 * Automatically disappears after 3 seconds.
 *
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 */
function showToast(message, type = 'info') {
    const colours = {
        success: 'bg-green-500',
        error:   'bg-red-500',
        info:    'bg-blue-500'
    };

    const toast = document.createElement('div');
    toast.className = `fixed bottom-6 right-6 ${colours[type]} text-white px-5 py-3
                       rounded-xl shadow-lg text-sm z-50 transition-opacity duration-300`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Fade out and remove after 3 s
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2700);
}

// ─── Public init functions ────────────────────────────────────────────────────

/**
 * initHome() — admin view initializer.
 *
 * Loads projects, wires up search/filter controls, and attaches
 * the "New Reservation" button listener.
 */
export async function initHome() {
    const isadmin = true;
    const users     = await getUsers();

    await loadProjects(isadmin);

    // Search input (debounced via 'input' event)
    document.getElementById('filtro-busqueda')?.addEventListener('input', () => {
        loadProjects(isadmin);
    });

    // Status filter dropdown
    document.getElementById('filtro-status')?.addEventListener('change', () => {
        loadProjects(isadmin);
    });

    // New Reservation button → open empty modal
    document.getElementById('btn-nuevo-proyecto')?.addEventListener('click', () => {
        showProjectModal(null, users, isadmin);
    });
}

/**
 * initUser() — usuario view initializer.
 *
 * Loads only the usuario's assigned projects and wires up
 * search/filter controls. No create/delete functionality exposed.
 */
export async function initUser() {
    const isadmin = false;

    await loadProjects(isadmin);

    // Search input
    document.getElementById('filtro-busqueda')?.addEventListener('input', () => {
        loadProjects(isadmin);
    });

    // Status filter
    document.getElementById('filtro-status')?.addEventListener('change', () => {
        loadProjects(isadmin);
    });
}
