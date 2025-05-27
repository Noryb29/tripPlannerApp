import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile, User } from "firebase/auth";
import { ref, set } from "firebase/database";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db, realtimeDb } from "../firebaseConfig";

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (firstname: string, lastname: string, username: string, email: string, password: string) => Promise<void>;
  getUserProfile: (uid: string) => Promise<any>;
  updateUserProfile: (uid: string, data: Partial<{ firstname: string; lastname: string; gender: string; dateOfBirth: string; photoURL: string; }>) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    firstname: string,
    lastname: string,
    username: string,
    email: string,
    password: string
  ) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: `${firstname} ${lastname}` });
      await setDoc(doc(db, "users", user.uid), {
        firstname,
        lastname,
        username,
        email,
        createdAt: new Date(),
      });
      await set(ref(realtimeDb, "users/" + user.uid + "/profile"), {
        firstname,
        lastname,
        username,
        email,
        createdAt: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const getUserProfile = async (uid: string) => {
    const userDoc = await getDoc(doc(db, 'users', uid));
    return userDoc.exists() ? userDoc.data() : null;
  };

  const updateUserProfile = async (uid: string, data: Partial<{ firstname: string; lastname: string; gender: string; dateOfBirth: string; photoURL: string; }>) => {
    await updateDoc(doc(db, 'users', uid), data);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, getUserProfile, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}; 