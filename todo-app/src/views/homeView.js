/**
 * homeView.js — admin Projects Page Template
 *
 * Renders the full project management UI for the admin role:
 *  - Page header with "New Reservation" button
 *  - Search + status filter bar
 *  - Project cards grid (populated by project.controller.js)
 */

/**
 * @returns {string} HTML markup for the admin projects page
 */
export function homeView() {
    return `
        <div class="space-y-6">

            <!-- ── Page Header ── -->
            <div class="flex justify-between items-center flex-wrap gap-3">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">All Reservaciones</h2>
                    <p class="text-sm text-gray-500 mt-1">edit and admin every reservaciones</p>
                </div>
                <!-- Only admins see this button (view is guarded in router) -->
                <button id="btn-nuevo-proyecto"
                        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white
                               rounded-lg text-sm font-medium transition">
                    + New Reservation
                </button>
            </div>

            <!-- ── Filter Bar ── -->
            <div class="bg-white rounded-xl shadow p-4 flex flex-wrap gap-3">
                <!-- Text search -->
                <input id="filtro-busqueda" type="text"
                       placeholder="Search by project name…"
                       class="px-4 py-2 border border-gray-200 rounded-lg text-sm
                              focus:outline-none focus:border-blue-500 flex-1 min-w-[180px]">

                <!-- Status filter -->
                <select id="filtro-status"
                        class="px-4 py-2 border border-gray-200 rounded-lg text-sm
                               focus:outline-none focus:border-blue-500">
                    <option value="">All statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="reservado">reservado</option>
                </select>
            </div>

            <!-- ── Project Cards Grid (populated by controller) ── -->
            <div id="contenedor-proyectos"
                 class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <!-- Loading placeholder -->
                <p class="text-gray-400 text-sm col-span-full text-center py-8">
                    Loading projects…
                </p>
            </div>
        </div>
    `;
}
