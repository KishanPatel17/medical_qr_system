// import { useParams } from "react-router-dom"
// import {useEffect, useState} from "react";
// import {db} from "../firebase"
// import {doc, getDoc} from "firebase/firestore";
// import Chatbot from "./chatbot";

// function ProfilePage() {
//   const { uid } = useParams();
//   const [userData, setUserData] = useState(null);

//   useEffect(()=> {
//     async function fetchData() {
//       const docRef = doc(db, "Users", uid);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         setUserData(docSnap.data());
//       } else {
//         setUserData({error: "User not found."})
//         console.log("user not found");
//       }
//     }
//     fetchData();
//   }, [uid]);

//   return (
//     <div>
//       {userData ? (
//         <div>
//           <h1>{userData.name}</h1>
//           <p><b>Medical Conditions:</b> {userData.medical_conditions}</p>
//           <p><b>Allergies:</b> {userData.allergies}</p>
//           <p><b>Emergency Contacts:</b> {userData.emergency_contacts.join(", ")}</p>
//           <p><b>Alcohol Usage:</b>{userData.alcohol}</p>
//           <p><b>Blood Type:</b>{userData.blood_type}</p>
//           <p><b>Smoking:</b>{userData.cigarrettes_per_day}</p>
//           <p><b>Date of Birth:</b>{userData.date_of_birth}</p>
//           <p><b>Drug Usage:</b>{userData.drugs_list}</p>
//           <p><b>Height:</b>{userData.height}</p>
//           <p><b>Medical History:</b>{userData.past_medical_history}</p>

//           <Chatbot /> 
//           </div>
//       ) : <p>Loading...</p>}
//     </div>
//   );
// }

// export default ProfilePage;

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import Chatbot from "./chatbot";

function ProfilePage() {
    const { uid } = useParams();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const docRef = doc(db, "Users", uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setUserData(docSnap.data());
            } else {
                setUserData({ error: "User not found." });
                console.log("user not found");
            }
        }
        fetchData();
    }, [uid]);

    return (
        <div style={styles.container}>
            {userData ? (
                <div>
                    <h1 style={styles.header}>{userData.name}</h1>
                    <div style={styles.profileSection}>
                        <h2 style={styles.sectionHeader}>Personal Information</h2>
                        <div style={styles.grid}>
                            <div style={styles.gridItem}>
                                <p><b>Medical Conditions:</b> {userData.medical_conditions}</p>
                                <p><b>Allergies:</b> {userData.allergies}</p>
                                <p><b>Emergency Contacts:</b> {userData.emergency_contacts.join(", ")}</p>
                            </div>
                            <div style={styles.gridItem}>
                                <p><b>Alcohol Usage:</b> {userData.alcohol}</p>
                                <p><b>Blood Type:</b> {userData.blood_type}</p>
                                <p><b>Smoking:</b> {userData.cigarrettes_per_day}</p>
                            </div>
                            <div style={styles.gridItem}>
                                <p><b>Date of Birth:</b> {userData.date_of_birth}</p>
                                <p><b>Drug Usage:</b> {userData.drugs_list}</p>
                                <p><b>Height:</b> {userData.height}</p>
                            </div>
                            <div style={styles.gridItem}>
                                <p><b>Medical History:</b> {userData.past_medical_history}</p>
                            </div>
                        </div>
                    </div>
                    <div style={styles.chatbotSection}>
                        <h2 style={styles.sectionHeader}>Medical Assistant</h2>
                        <Chatbot />
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

// Styles for the profile page
const styles = {
    container: {
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    header: {
        textAlign: "center",
        color: "#007bff",
        fontSize: "28px",
        marginBottom: "20px",
    },
    profileSection: {
        marginBottom: "30px",
    },
    sectionHeader: {
        color: "#333",
        fontSize: "22px",
        marginBottom: "15px",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
    },
    gridItem: {
        backgroundColor: "#fff",
        padding: "15px",
        borderRadius: "5px",
        border: "1px solid #ddd",
    },
    chatbotSection: {
        marginTop: "30px",
    },
};

export default ProfilePage;