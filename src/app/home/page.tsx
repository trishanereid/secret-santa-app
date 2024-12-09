'use client';

import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const [assignedName, setAssignedName] = useState<string | null>(null);
  const [isNameAssigned, setIsNameAssigned] = useState<boolean>(false);
  const router = useRouter();

  const user = auth.currentUser;

  const officeMembers = [
    "John", "Sarah", "Mark", "Lucy", "David", "Emma", "Michael", "Sophia", "James",
    "Olivia", "William", "Lily", "Henry", "Megan", "Charlie", "Ella", "Jack", "Ava",
    "Daniel", "Isabella"
  ];

  // Fetch the assigned name for the user from Firestore
  const fetchAssignedName = async () => {
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.email!);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          setAssignedName(docSnap.data().assignedName);
          setIsNameAssigned(true);
        } else {
          setIsNameAssigned(false);
        }
      } catch (error) {
        console.error("Error fetching assigned name:", error);
      }
    }
  };

  // Assign a random name to the user
  const assignRandomName = async () => {
    if (isNameAssigned || !user) return;

    // Filter available names (excluding user's own name and already assigned names)
    const availableNames = officeMembers.filter((name) => name !== user.displayName);

    if (availableNames.length > 0) {
      const randomName = availableNames[Math.floor(Math.random() * availableNames.length)];
      setAssignedName(randomName);

      try {
        const userDocRef = doc(db, "users", user.email!);
        await setDoc(userDocRef, { assignedName: randomName });

        setIsNameAssigned(true);
      } catch (error) {
        console.error("Error assigning random name:", error);
      }
    } else {
      setAssignedName("No names available for assignment.");
    }
  };

  // Redirect to login if the user is not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/page");
    } else {
      fetchAssignedName();
    }
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center text-center px-4"
      style={{
        backgroundImage: "url('background.jpg')",
      }}
    >
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Welcome, {user.displayName}
        </h1>
        <h2 className="text-lg text-gray-600 mb-6">
          Your assigned name:{" "}
          <span className="font-semibold">
            {assignedName || "No name assigned yet"}
          </span>
        </h2>
        <button
          onClick={assignRandomName}
          disabled={isNameAssigned}
          className={`w-full py-2 px-4 rounded-lg text-white font-medium transition ${
            isNameAssigned
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isNameAssigned ? "Name Assigned" : "Get Assigned Name"}
        </button>
      </div>
    </div>
  );
};

export default HomePage;