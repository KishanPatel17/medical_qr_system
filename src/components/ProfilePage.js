import { useParams } from "react-router-dom"
import {useEffect, useState} from "react";
import {db} from "../firebase"
import {doc, getDoc} from "firebase/firestore";
import Chatbot from "./chatbot";

function ProfilePage() {
  const { uid } = useParams();
  const [userData, setUserData] = useState(null);

  useEffect(()=> {
    async function fetchData() {
      const docRef = doc(db, "Users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        setUserData({error: "User not found."})
        console.log("user not found");
      }
    }
    fetchData();
  }, [uid]);

  return (
    <div>
      {userData ? (
        <div>
          <h1>{userData.name}</h1>
          <p><b>Medical Conditions:</b> {userData.medical_conditions}</p>
          <p><b>Allergies:</b> {userData.allergies}</p>
          <p><b>Emergency Contacts:</b> {userData.emergency_contacts.join(", ")}</p>
          <Chatbot /> 
          </div>
      ) : <p>Loading...</p>}
    </div>
  );
}

export default ProfilePage;