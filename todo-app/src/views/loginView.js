/**
 * loginView.js — Login Page Template
 *
 * Returns the HTML string for the login screen.
 * Two-column layout: brand panel (left) + login form (right).
 * The right column is responsive (full width on mobile).
 */

import Logo from '../assets/logo.png';

/**
 * @returns {string} HTML markup for the login page
 */
export function loginView() {
    return `
        <section class="bg-white rounded-2xl shadow-lg overflow-hidden flex min-h-[520px]">

            <!-- ── Brand / Hero Panel (hidden on mobile) ── -->
            <div class="hidden md:flex flex-col justify-center items-center
                        bg-black text-white p-10 w-1/2">
                <img src="${Logo}" alt="RIWI" class="w-48 object-contain mb-6">
                <h2 class="text-3xl font-bold mb-3 text-center">Users-Reservacion</h2>
                <p class="text-blue-100 text-center text-sm leading-relaxed">
                   proyecto de reservar
                </p>
            </div>

            <!-- ── Login Form ── -->
            <div class="flex-1 p-10 flex flex-col justify-center">
                <h1 class="text-3xl font-bold mb-1">Sign In</h1>
                <p class="text-gray-500 text-sm mb-8">Enter your credentials to continue</p>

                <form id="form-login" class="space-y-5" novalidate>
                    <!-- Email field -->
                    <div>
                        <label class="block text-sm font-medium mb-1" for="login-email">
                            Email address
                        </label>
                        <input type="email" id="login-email"
                               autocomplete="email"
                               placeholder="you@company.com"
                               class="w-full px-4 py-3 border border-gray-200 rounded-lg
                                      focus:outline-none focus:border-blue-500 text-sm"
                               required>
                    </div>

                    <!-- Password field -->
                    <div>
                        <label class="block text-sm font-medium mb-1" for="login-password">
                            Password
                        </label>
                        <input type="password" id="login-password"
                               autocomplete="current-password"
                               placeholder="••••••••"
                               class="w-full px-4 py-3 border border-gray-200 rounded-lg
                                      focus:outline-none focus:border-blue-500 text-sm"
                               required>
                    </div>

                    <!-- Inline error message (hidden by default) -->
                    <p id="error-login"
                       class="text-red-500 text-sm hidden bg-red-50 px-3 py-2 rounded-lg">
                    </p>

                    <!-- Submit button -->
                    <button type="submit"
                            class="w-full bg-black hover:bg-purple-700 text-white
                                   py-3 rounded-lg font-semibold transition text-sm">
                        Sign In
                    </button>
                </form>
            </div>
        </section>
    `;
}
