'use client';
import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebaseConfig";
import { collection, doc, getDoc, setDoc, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";

const HomePage = () => {
  const [assignedName, setAssignedName] = useState<string | null>(null);
  const [isNameAssigned, setIsNameAssigned] = useState<boolean>(false);
  const [availableNames, setAvailableNames] = useState<string[]>([]);
  const [userFirstName, setUserFirstName] = useState<string | null>(null);
  const router = useRouter();
  const user = auth.currentUser;

  const officeMembers = [
    "Trishane", "Garvin", "Senuri", "Reid", "Asanka", "Pradeep", "Asankapradeep"
  ];

  const fetchUserFirstName = async () => {
    if (!user) return;

    try {
      const allowedUsersRef = collection(db, "allowedUsers");
      const snapshot = await getDocs(allowedUsersRef);

      const userDoc = snapshot.docs.find(doc => doc.data().email === user.email);
      if (userDoc) {
        const firstName = userDoc.data().firstName;
        setUserFirstName(firstName);
      } else {
        setUserFirstName(user.displayName);
      }
    } catch (error) {
      console.error("Error fetching user's first name:", error);
    }
  };

  const fetchAvailableNames = async () => {
    if (!user) return;

    try {
      const assignmentsSnapshot = await getDocs(collection(db, "users"));
      const assignedNames = new Set<string>();

      assignmentsSnapshot.forEach((doc) => {
        if (doc.data().assignedName) {
          assignedNames.add(doc.data().assignedName);
        }
      });

      const remainingNames = officeMembers.filter(name => 
        name !== userFirstName && !assignedNames.has(name)
      );

      setAvailableNames(remainingNames);
    } catch (error) {
      console.error("Error fetching available names:", error);
    }
  };

  const fetchAssignedName = async () => {
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.email!);
        const docSnap = await getDoc(userDocRef);
        
        if (docSnap.exists() && docSnap.data().assignedName) {
          setAssignedName(docSnap.data().assignedName);
          setIsNameAssigned(true);
        } else {
          setIsNameAssigned(false);
          await fetchAvailableNames();
        }
      } catch (error) {
        console.error("Error fetching assigned name:", error);
      }
    }
  };

  const assignRandomName = async () => {
    if (isNameAssigned || !user || availableNames.length === 0) return;

    try {
      const randomName = availableNames[Math.floor(Math.random() * availableNames.length)];
      const userDocRef = doc(db, "users", user.email!);
      
      await setDoc(userDocRef, { 
        assignedName: randomName,
        timestamp: new Date().toISOString()
      }, { merge: true });

      setAssignedName(randomName);
      setIsNameAssigned(true);
    } catch (error) {
      console.error("Error assigning random name:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      fetchUserFirstName();
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
          Welcome, {userFirstName || user.displayName}
        </h1>
        
        {isNameAssigned ? (
          <>
            <h2 className="text-lg text-gray-600 mb-6">
              Your assigned name:{" "}
              <span className="font-semibold text-green-600">
                {assignedName}
              </span>
            </h2>
            <button
              onClick={handleLogout}
              className="w-full py-2 px-4 rounded-lg text-white font-medium transition bg-blue-500 hover:bg-blue-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <h2 className="text-lg text-gray-600 mb-6">
              {availableNames.length > 0 
                ? "Click the button to get your assigned name"
                : "No names available for assignment"}
            </h2>
            <button
              onClick={assignRandomName}
              disabled={availableNames.length === 0}
              className={`w-full py-2 px-4 rounded-lg text-white font-medium transition ${
                availableNames.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              Get Assigned Name
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
