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
          // A name has already been assigned
          setAssignedName(docSnap.data().assignedName);
          setIsNameAssigned(true); // Disable the button
        } else {
          // No name assigned yet
          setIsNameAssigned(false);
        }
      } catch (error) {
        console.error("Error fetching assigned name:", error);
      }
    }
  };

  // Assign a random name to the user
  const assignRandomName = async () => {
    if (isNameAssigned || !user) return; // Prevent multiple assignments

    // Filter available names (excluding user's own name and already assigned names)
    const availableNames = officeMembers.filter((name) => name !== user.displayName);

    if (availableNames.length > 0) {
      const randomName = availableNames[Math.floor(Math.random() * availableNames.length)];
      setAssignedName(randomName);

      try {
        // Save the assigned name in Firestore
        const userDocRef = doc(db, "users", user.email!);
        await setDoc(userDocRef, { assignedName: randomName });

        setIsNameAssigned(true); // Disable the button after assignment
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
    return null; // Wait until redirect happens
  }

  return (
    <div>
      <h1>Welcome, {user.displayName}</h1>
      <h2>Your assigned name: {assignedName || "No name assigned yet"}</h2>
      <button onClick={assignRandomName} disabled={isNameAssigned}>
        {isNameAssigned ? "Name Assigned" : "Get Assigned Name"}
      </button>
    </div>
  );
};

export default HomePage;