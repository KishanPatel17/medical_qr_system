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
                        <h2 style={styles.sectionHeader}>Personal Summary</h2>
                        <div style={styles.grid}>
                            <div style={styles.gridItem}>
                                <p><b>Medical Conditions:</b> {userData.medical_conditions}</p>
                                <p><b>Allergies:</b> {Array.isArray(userData.allergies) ? userData.allergies.join(", ") : userData.allergies}</p>
                                <p><b>Emergency Contacts: </b> <br /> {userData.emergency_contacts.join(", ")}</p>
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
                                <p><b>Medical History:</b> <br /> {userData.past_medical_history}</p>
                            </div>
                        </div>
                    </div>
                    <div style={styles.chatbotSection}>
                        <h2 style={styles.sectionHeader}>Medical Assistant</h2>
                        <Chatbot />
                    </div>
                </div>
            ) : (
                <p style={styles.loading}>Loading...</p>
            )}
        </div>
    );
}

// Styles for the profile page
const styles = {
    container: {
        maxWidth: "600px",
        margin: "0 auto",
        padding: "30px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f4f4f9",
        borderRadius: "16px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
    },
    header: {
        textAlign: "center",
        color: "#3f51b5",
        fontSize: "38px",
        marginBottom: "30px",
        fontWeight: "600",
        letterSpacing: "0.5px",
    },
    profileSection: {
        marginBottom: "40px",
    },
    sectionHeader: {
        color: "#3f51b5",
        fontSize: "30px",
        marginBottom: "20px",
        borderBottom: "2px solid #3f51b5",
        paddingBottom: "10px",
        fontWeight: "500",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "25px",
    },
    gridItem: {
        fontSize: "17px",
        backgroundColor: "#fff",
        padding: "25px",
        borderRadius: "12px",
        border: "1px solid #e8eaf6",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
    },
    gridItemHover: {
        transform: "translateY(-5px)",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
    },
    chatbotSection: {
        marginTop: "40px",
    },
    loading: {
        textAlign: "center",
        color: "#3f51b5",
        fontSize: "28px",
        fontStyle: "italic",
    },
};

export default ProfilePage;