import React, { createContext, useContext, useEffect, useReducer } from "react";
import * as SecureStore from "expo-secure-store";
import * as cognitoClient from "./cognitoClient";

interface AuthState {
  status: "loading" | "authed" | "guest";
  idToken: string | null;
  userId: string | null;
}

type AuthAction =
  | { type: "LOADED"; idToken: string; userId: string }
  | { type: "GUEST" }
  | { type: "SIGNED_OUT" };

const KEYS = {
  idToken: "agentcard.idToken",
  accessToken: "agentcard.accessToken",
  refreshToken: "agentcard.refreshToken",
  userId: "agentcard.userId",
};

function reducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOADED":
      return { status: "authed", idToken: action.idToken, userId: action.userId };
    case "GUEST":
    case "SIGNED_OUT":
      return { status: "guest", idToken: null, userId: null };
    default:
      return state;
  }
}

interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  confirmSignUp: (email: string, code: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Module-level getter so API client can access token without a hook
let _idToken: string | null = null;
export const getIdToken = () => _idToken;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { status: "loading", idToken: null, userId: null });

  useEffect(() => {
    (async () => {
      try {
        const idToken = await SecureStore.getItemAsync(KEYS.idToken);
        const userId = await SecureStore.getItemAsync(KEYS.userId);
        if (idToken && userId) {
          _idToken = idToken;
          dispatch({ type: "LOADED", idToken, userId });
        } else {
          dispatch({ type: "GUEST" });
        }
      } catch {
        dispatch({ type: "GUEST" });
      }
    })();
  }, []);

  const signIn = async (email: string, password: string) => {
    const tokens = await cognitoClient.signIn(email, password);
    const userId = parseUserId(tokens.idToken);
    await SecureStore.setItemAsync(KEYS.idToken, tokens.idToken);
    await SecureStore.setItemAsync(KEYS.accessToken, tokens.accessToken);
    await SecureStore.setItemAsync(KEYS.refreshToken, tokens.refreshToken);
    await SecureStore.setItemAsync(KEYS.userId, userId);
    _idToken = tokens.idToken;
    dispatch({ type: "LOADED", idToken: tokens.idToken, userId });
  };

  const signUp = async (email: string, password: string) => {
    await cognitoClient.signUp(email, password);
  };

  const confirmSignUp = async (email: string, code: string) => {
    await cognitoClient.confirmSignUp(email, code);
  };

  const signOut = async () => {
    cognitoClient.signOut();
    await Promise.all(Object.values(KEYS).map((k) => SecureStore.deleteItemAsync(k)));
    _idToken = null;
    dispatch({ type: "SIGNED_OUT" });
  };

  return (
    <AuthContext.Provider value={{ ...state, signIn, signUp, confirmSignUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

function parseUserId(idToken: string): string {
  try {
    const payload = idToken.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.sub as string;
  } catch {
    return "";
  }
}
