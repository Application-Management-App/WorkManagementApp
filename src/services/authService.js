import Parse from "./parse.js";

/**
 * Register a new user account via Parse authentication.
 *
 * @param {string} username - Desired username
 * @param {string} password - Desired password
 * @returns {Promise<Object>} Object with id and username
 */
export async function signUp(username, password) {
  const user = await Parse.User.signUp(username, password, {});
  return { id: user.id, username: user.get("username") };
}

/**
 * Log in an existing user via Parse authentication.
 *
 * @param {string} username - Account username
 * @param {string} password - Account password
 * @returns {Promise<Object>} Object with id and username
 */
export async function logIn(username, password) {
  const user = await Parse.User.logIn(username, password);
  return { id: user.id, username: user.get("username") };
}

/**
 * Log out the currently authenticated user.
 * Clears the Parse session token from local storage.
 */
export async function logOut() {
  await Parse.User.logOut();
}

/**
 * Get the currently logged-in user, if any.
 *
 * @returns {Object|null} User object with id and username, or null
 */
export function currentUser() {
  const user = Parse.User.current();
  if (!user) return null;
  return { id: user.id, username: user.get("username") };
}
