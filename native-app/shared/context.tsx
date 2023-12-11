import * as React from "react";
import { useStorageState } from "./useStorageState";
import { Session } from "./session";

const AuthContext = React.createContext<{
  signIn: (session: Session) => Promise<void>;
  signOut: () => Promise<void>;
  session?: Session | null;
  isLoading: boolean;
} | null>(null);

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");
  const savedSession =
    session == null ? null : Session.create(JSON.parse(session));

  return (
    <AuthContext.Provider
      value={{
        signIn: (newSession: Session) => {
          return setSession(newSession.toStore());
        },
        signOut: () => {
          return setSession(null);
        },
        session: savedSession,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
