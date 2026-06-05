/**
 * db.js — Data Access Layer
 * 
 * Centralizes all HTTP requests to json-server and session
 * management via localStorage. This is the only file that
 * talks directly to the API; every other module imports from here.
 */

/** Base URL of the json-server instance */
const BASE_URL = 'http://localhost:3000';

// ─── USER ENDPOINTS ──────────────────────────────────────────────────────────

/**
 * Fetches the full list of users from the API.
 * @returns {Promise<Array>} Array of user objects
 */
export async function getUsers() {
    const response = await fetch(`${BASE_URL}/users`);
    if (!response.ok) throw new Error('Error fetching users');
    return response.json();
}

// ─── PROJECT ENDPOINTS ───────────────────────────────────────────────────────

/**
 * Fetches all projects from the API.
 * @returns {Promise<Array>} Array of project objects
 */
export async function getProjects() {
    const response = await fetch(`${BASE_URL}/projects`);
    if (!response.ok) throw new Error('Error fetching projects');
    return response.json();
}

/**
 * Creates a new project via POST.
 * @param {Object} project - Project data (name, description, status, assignedTo, createdAt)
 * @returns {Promise<Object>} The newly created project with its generated id
 */
export async function createProject(project) {
    const response = await fetch(`${BASE_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
    });
    if (!response.ok) throw new Error('Error creating project');
    return response.json();
}

/**
 * Updates an existing project via PATCH (partial update).
 * @param {string} id - Project id to update
 * @param {Object} data - Fields to update
 * @returns {Promise<Object>} The updated project object
 */
export async function updateProject(id, data) {
    const response = await fetch(`${BASE_URL}/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Error updating project');
    return response.json();
}

/**
 * Deletes a project by id via DELETE.
 * @param {string} id - Project id to delete
 * @returns {Promise<void>}
 */
export async function deleteProject(id) {
    const response = await fetch(`${BASE_URL}/projects/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error deleting project');
}

// ─── SESSION MANAGEMENT ──────────────────────────────────────────────────────

/**
 * Reads the current session from localStorage.
 * @returns {Object|null} Logged-in user object, or null if not authenticated
 */
export function getSession() {
    const data = localStorage.getItem('currentUser');
    return data ? JSON.parse(data) : null;
}

/**
 * Persists a user object as the active session in localStorage.
 * @param {Object} user - The authenticated user to store
 */
export function setSession(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

/**
 * Clears the active session from localStorage (logout).
 */
export function clearSession() {
    localStorage.removeItem('currentUser');
}
