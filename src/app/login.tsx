'use client';

import { useRouter } from "next/navigation";
import { signInWithPopup, signOut, User } from "firebase/auth";
import { auth, db, googleProvider } from "../lib/firebaseConfig";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";

const LoginPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const router = useRouter();

  const checkAuthorization = async (email: string) => {
    try {
      const allowedUsersRef = collection(db, "allowedUsers");
      const snapshot = await getDocs(allowedUsersRef);
      const allowedEmails = snapshot.docs.map((doc) => doc.data().email);

      if (allowedEmails.includes(email)) {
        setIsAuthorized(true);
        router.push("/home");
      } else {
        setIsAuthorized(false);
        alert("You are not authorized to use this application.");
        handleLogout();
      }
    } catch (error) {
      console.error("Error checking authorization:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const loggedInUser = result.user;

      if (loggedInUser?.email) {
        setUser(loggedInUser);
        checkAuthorization(loggedInUser.email);
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        if (currentUser.email) {
          checkAuthorization(currentUser.email);
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#ECEFFF] flex items-center justify-center p-4">
      <div className="p-8 flex flex-col items-center">
        {/* Christmas Scene Image */}
        <div className="w-64 h-64 mb-6 relative flex items-center justify-center">
          <img
            src="Sleigh.png"
            alt="Christmas tree and sleigh with presents"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Text Content */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Merry Christmas</h1>
        <p className="text-gray-600 text-center mb-8">
          Surprise your friends with Christmas gifts and the extent of love between you
        </p>

        {/* Sign-In Button */}
        {!user ? (
          <button
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
            onClick={handleGoogleSignIn}
          >
            Sign in with Google
          </button>
        ) : (
          <button
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
            onClick={handleLogout}
          >
            Log Out
          </button>
        )}

        {!isAuthorized && user && (
          <p className="text-red-500 text-center mt-4">
            You are not authorized to access this application.
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;