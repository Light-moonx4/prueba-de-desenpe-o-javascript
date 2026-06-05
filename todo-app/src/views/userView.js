/**
 * userView.js — usuario Projects Page Template
 *
 * Renders a read-mostly project list for the usuario role.
 * usuarios can see their assigned projects and change their status,
 * but cannot create or delete projects.
 */

/**
 * @returns {string} HTML markup for the usuario projects page
 */
export function userView() {
    return `
        <div class="space-y-6">

            <!-- ── Page Header ── -->
            <div>
                <h2 class="text-2xl font-bold text-gray-800">My Projects</h2>
                <p class="text-sm text-gray-500 mt-1">
                    Projects assigned to you — you can update their status
                </p>
                <button id="btn-nuevo-reserva"
                        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white
                               rounded-lg text-sm font-medium transition">
                    + solicitud de reserva
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
                 class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Loading placeholder -->
                <p class="text-gray-400 text-sm col-span-full text-center py-8">
                    Loading your projects…
                </p>
            </div>
        </div>
    `;
}
