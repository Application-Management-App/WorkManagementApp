import Parse from "./parse.js";

export async function signUp(username, password) {
  const user = await Parse.User.signUp(username, password, {});
  return { id: user.id, username: user.get("username") };
}

export async function logIn(username, password) {
  const user = await Parse.User.logIn(username, password);
  return { id: user.id, username: user.get("username") };
}

export async function logOut() {
  await Parse.User.logOut();
}

export function currentUser() {
  const user = Parse.User.current();
  if (!user) return null;
  return { id: user.id, username: user.get("username") };
}
