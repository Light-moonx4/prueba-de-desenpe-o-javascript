/**
 * notFoundView.js — 404 Page Template
 *
 * Displayed when the router encounters an unknown hash route.
 */

/**
 * @returns {string} HTML markup for the 404 not-found page
 */
export function notFoundView() {
    return `
        <section class="bg-white rounded-2xl shadow-lg p-12 text-center">
            <h1 class="text-8xl font-bold text-gray-200 mb-4">404</h1>
            <p class="text-xl text-gray-600 mb-2">Page not found</p>
            <p class="text-sm text-gray-400 mb-8">
                The route you requested doesn't exist in this application.
            </p>
            <a href="#login"
               class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3
                      rounded-lg font-semibold transition text-sm">
                Back to Login
            </a>
        </section>
    `;
}
