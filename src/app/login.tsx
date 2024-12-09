'use client';

import { useRouter } from "next/navigation";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebaseConfig";
import { useState, useEffect } from "react";

const LoginPage = () => {
  const [user, setUser] = useState<unknown>(null); // To store the logged-in user info
  const router = useRouter();

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider); // Use Google sign-in
      const loggedInUser = result.user;

      // Save user info
      setUser(loggedInUser);

      // Redirect user to the home page
      router.push("/home");
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Track Authentication State
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set user if already logged in
      } else {
        setUser(null); // Clear user state
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
          Surprise your friends with christmas gifts and the extent of love between you
        </p>

        {/* Form */}
        <div className="w-full space-y-4">
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

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
