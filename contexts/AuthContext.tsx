"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  type User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import type { User } from "@/lib/types"

interface AuthContextType {
  user: User | null
  firebaseUser: FirebaseUser | null
  loading: boolean
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, name: string, phone?: string) => Promise<void>
  signOut: () => Promise<void>
  updateUserProfile: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser)

      if (firebaseUser) {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
        if (userDoc.exists()) {
          setUser({ id: firebaseUser.uid, ...userDoc.data() } as User)
        }
      } else {
        setUser(null)
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signInWithEmail = async (email: string, password: string) => {
    try {
      console.log("Starting signin process...", { email });
      
      const result = await signInWithEmailAndPassword(auth, email, password)
      const firebaseUser = result.user
      
      console.log("Firebase signin successful:", firebaseUser.uid);

      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
      if (userDoc.exists()) {
        console.log("User document found in Firestore");
        setUser({ id: firebaseUser.uid, ...userDoc.data() } as User)
      } else {
        console.log("No user document found in Firestore");
      }
    } catch (error) {
      console.error("Detailed signin error:", error);
      throw error;
    }
  }

  const signUpWithEmail = async (email: string, password: string, name: string, phone: string = "") => {
    try {
      console.log("Starting signup process...", { email, name });
      
      const result = await createUserWithEmailAndPassword(auth, email, password)
      const firebaseUser = result.user
      
      console.log("Firebase user created:", firebaseUser.uid);

      // Create new user document
      const newUser: Omit<User, "id"> = {
        email: firebaseUser.email || email,
        phone: phone,
        name: name,
        userType: "rider", // Default to rider
        rating: 5.0,
        totalRides: 0,
        createdAt: new Date(),
        isVerified: false,
        preferences: {
          notifications: true,
          darkMode: true,
          language: "en",
          currency: "USD",
        },
      }

      console.log("Creating user document in Firestore...");
      await setDoc(doc(db, "users", firebaseUser.uid), newUser)
      console.log("User document created successfully");
      
      setUser({ id: firebaseUser.uid, ...newUser })
    } catch (error) {
      console.error("Detailed signup error:", error);
      throw error;
    }
  }

  const signOut = async () => {
    await firebaseSignOut(auth)
    setUser(null)
    setFirebaseUser(null)
  }

  const updateUserProfile = async (data: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...data }
    await setDoc(doc(db, "users", user.id), updatedUser, { merge: true })
    setUser(updatedUser)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
