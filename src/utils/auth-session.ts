import { AuthResponseSchema, type AuthResponseDTO } from "@/schemas/auth.schema";

export const AUTH_CHANGE_EVENT = "auth-change";

// Corrigido para o contexto correto do projeto atual
const STORAGE_KEY = "docsync.auth.session";

type StoredSessionV1 = {
  version: 1;
  session: AuthResponseDTO;
};

function isBrowser() {
  return typeof window !== "undefined";
}

function dispatchAuthChange() {
  if (!isBrowser()) {
    return;
  }
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export const AuthSession = {
  get(): AuthResponseDTO | null {
    if (!isBrowser()) {
      return null;
    }

    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw);

      if (parsed && typeof parsed === "object" && "version" in parsed) {
        const v = parsed as StoredSessionV1;
        if (v.version === 1) {
          return AuthResponseSchema.parse(v.session);
        }
      }

      const session = AuthResponseSchema.parse(parsed);

      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, session }));

      return session;
    } catch (error) {
      this.clear();
      if (process.env.NODE_ENV === "development") {
        console.error("Sessão inválida encontrada no storage", error);
      }
      return null;
    }
  },

  set(session: AuthResponseDTO | unknown) {
    if (!isBrowser()) {
      return;
    }
    const validated = AuthResponseSchema.parse(session as unknown);
    const toStore: StoredSessionV1 = {
      version: 1,
      session: validated,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    dispatchAuthChange();
  },

  clear() {
    if (!isBrowser()) {
      return;
    }
    localStorage.removeItem(STORAGE_KEY);
    dispatchAuthChange();
  },

  isAuthenticated() {
    const session = this.get();
    return Boolean(session?.token && session?.userId);
  },

  subscribe(cb: (session: AuthResponseDTO | null) => void) {
    if (!isBrowser()) return () => {};
    const handler = () => cb(this.get());
    window.addEventListener(AUTH_CHANGE_EVENT, handler);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, handler);
  },
};