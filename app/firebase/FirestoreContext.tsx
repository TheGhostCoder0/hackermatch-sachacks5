"use client";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Collections, TUser, auth, db } from "./client";

const Context = createContext<{ user: TUser | null; loading: boolean }>({
  user: null,
  loading: true,
});

interface FirestoreContextProps {
  children: React.ReactNode;
}

export const FirestoreProvider: React.FC<FirestoreContextProps> = ({
  children,
}) => {
  const [user, setUser] = useState<TUser | null>(null);
  const [authUser, authLoading] = useAuthState(auth);

  // fetch the user, currently getting everything rn which is fine ig
  // use this if u want extended user info like name, role, photoUrl, etc.
  useEffect(() => {
    const q = query(
      collection(db, Collections.users),
      where("__name__", "==", authUser?.uid || "undefined")
    );

    const unsubscribe = onSnapshot(q, (qs) => {
      try {
        let dbUser = null;
        qs.forEach((doc) => {
          dbUser = {
            ...doc.data(),
          };
        });

        setUser(dbUser);
      } catch (error) {
        console.error("Error while reading from Firestore:", error);
      }
    });

    return () => unsubscribe();
  }, [authUser]);
  return (
    <Context.Provider value={{ user, loading: authLoading }}>
      {children}
    </Context.Provider>
  );
};

export const useFirestore = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useFirestore must be used within a FirestoreProvider");
  }
  return context;
};
