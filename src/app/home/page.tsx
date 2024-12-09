'use client';

import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [assignedName, setAssignedName] = useState<string | null>(null);
  const [allNames, setAllNames] = useState<string[]>([]);
  const router = useRouter();

  const user = auth.currentUser;

  const officeMembers = [
    "John", "Sarah", "Mark", "Lucy", "David", "Emma", "Michael", "Sophia", "James", 
    "Olivia", "William", "Lily", "Henry", "Megan", "Charlie", "Ella", "Jack", "Ava", 
    "Daniel", "Isabella"
  ];

  // Fetch assigned name for the user from Firestore
  const fetchAssignedName = async () => {
    if (user) {
      const userDocRef = doc(db, "users", user.email!);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        setAssignedName(docSnap.data().assignedName);
      } else {
        // User does not have an assigned name, assign one
        assignRandomName();
      }
    }
  };

  // Assign a random name
  const assignRandomName = async () => {
    const availableNames = officeMembers.filter((name) => name !== user?.displayName && !allNames.includes(name));
    if (availableNames.length > 0) {
      const randomName = availableNames[Math.floor(Math.random() * availableNames.length)];
      setAssignedName(randomName);

      // Store the assigned name in Firestore for the user
      if (user) {
        await setDoc(doc(db, "users", user.email!), {
          assignedName: randomName,
        });
      }
      setAllNames([...allNames, randomName]);
    } else {
      setAssignedName("All names have been assigned!");
    }
  };

  // Fetch office members data
  useEffect(() => {
    if (user) {
      fetchAssignedName();
    }
  }, [user]);

  if (!user) {
    router.push("/page");
    return null;
  }

  return (
    <div>
      <h1>Welcome {user?.displayName}</h1>
      <h2>Your assigned name: {assignedName || "No name assigned yet"}</h2>
      <button onClick={assignRandomName}>Get Assigned Name</button>
    </div>
  );
};

export default HomePage;
