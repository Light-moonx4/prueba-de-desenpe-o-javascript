/**
 * dashboardView.js — admin Dashboard Template
 *
 * Renders four stat cards with placeholder values.
 * The actual numbers are injected by dashboard.controller.js
 * after the view has been mounted to the DOM.
 */

/**
 * @returns {string} HTML markup for the admin dashboard
 */
export function dashboardView() {
    return `
        <div class="space-y-6">

            <!-- ── Page Header ── -->
            <div class="flex justify-between items-center flex-wrap gap-3">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">Dashboard</h2>
                    <p class="text-sm text-gray-500 mt-1">Overview of all internal projects</p>
                </div>
                <a href="#home"
                   class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white
                          rounded-lg text-sm font-medium transition">
                    Manage reservaciones →
                </a>
            </div>

            <!-- ── Stat Cards ── -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                <!-- Total -->
                <div class="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
                    <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                        📁
                    </div>
                    <div>
                        <p class="text-xs text-gray-500 uppercase tracking-wide">Total Reservaciones</p>
                        <p id="stat-total" class="text-3xl font-bold text-gray-800">—</p>
                    </div>
                </div>

                <!-- Active / In Progress -->
                <div class="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
                    <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-2xl">
                        🚀
                    </div>
                    <div>
                        <p class="text-xs text-gray-500 uppercase tracking-wide">In Progress</p>
                        <p id="stat-active" class="text-3xl font-bold text-yellow-600">—</p>
                    </div>
                </div>

                <!-- reservado -->
                <div class="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
                    <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                        ✅
                    </div>
                    <div>
                        <p class="text-xs text-gray-500 uppercase tracking-wide">reservado</p>
                        <p id="stat-reservado" class="text-3xl font-bold text-green-600">—</p>
                    </div>
                </div>

                <!-- Pending -->
                <div class="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
                    <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                        🕐
                    </div>
                    <div>
                        <p class="text-xs text-gray-500 uppercase tracking-wide">Pending</p>
                        <p id="stat-pending" class="text-3xl font-bold text-gray-600">—</p>
                    </div>
                </div>

            </div>

            <!-- ── Quick tip ── -->
            <div class="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
                💡 Use <strong>reservaciones</strong>edit, or delete reservas
                and assign them to reservass.
            </div>
        </div>
    `;
}
