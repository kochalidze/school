import { create } from "zustand";
import { authClient } from "../lib/auth-client.js";

export const useAuth = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true, // true, სანამ სესიას არ შევამოწმებთ

  // აპის გაშვებისას გამოიძახე ერთხელ
  init: async () => {
    const { data } = await authClient.getSession();
    set({ user: data?.user ?? null, isAuthenticated: !!data?.user, loading: false });
  },

  checkSession: async () => {
    const { data } = await authClient.getSession();
    set({ user: data?.user ?? null, isAuthenticated: !!data?.user });
  },

  register: async ({ firstName, lastName, email, password }) => {
    const { data, error } = await authClient.signUp.email({
      name: `${firstName} ${lastName}`.trim(),
      email,
      password,
    });
    if (error) throw new Error(error.message || "რეგისტრაცია ვერ მოხერხდა");
    set({ user: data.user, isAuthenticated: true });
  },

  login: async ({ email, password }) => {
    const { data, error } = await authClient.signIn.email({ email, password });
    if (error) throw new Error(error.message || "შესვლა ვერ მოხერხდა");
    set({ user: data.user, isAuthenticated: true });
  },

  logout: async () => {
    await authClient.signOut();
    set({ user: null, isAuthenticated: false });
  },
}));