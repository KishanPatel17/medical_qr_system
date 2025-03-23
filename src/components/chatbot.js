// import React, { useState } from "react";

// //marks code below probably wrong 
// import { GoogleGenerativeAI } from "@google/generative-ai";


// function Chatbot() {
//     const [input, setInput] = useState("");
//     const [response, setResponse] = useState("");

//     const fetchAIResponse = async () => {
//         const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText?key=AIzaSyAn3ZmcmB8mYWFYtolq3EjAejaqO9jgAVc`,
//             {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ prompt: { text: input } })
//             }
//         );
//         const data = await res.json();
//         setResponse(data.candidates[0].output);
//     };

//     return (
//         <div>
//             <h2>Ask Medical AI</h2>
//             <input
//                 type="text"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 placeholder="Ask a medical question..."
//             />
//             <button onClick={fetchAIResponse}>Ask</button>
//             <p>{response}</p>
//         </div>
//     );
// }

// export default Chatbot;


// import React, { useState } from "react";

// function Chatbot() {
//     const [input, setInput] = useState("");
//     const [response, setResponse] = useState("");

//     const fetchAIResponse = async () => {
//         try {
//             const res = await fetch(
//                 `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAn3ZmcmB8mYWFYtolq3EjAejaqO9jgAVc`,
//                 {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({
//                         contents: [
//                             {
//                                 parts: [
//                                     {
//                                         text: input
//                                     }
//                                 ]
//                             }
//                         ]
//                     })
//                 }
//             );
//             const data = await res.json();
//             console.log(data); // Debugging: Check the API response
//             setResponse(data.candidates[0].content.parts[0].text);
//         } catch (error) {
//             console.error("Error fetching AI response:", error);
//             setResponse("An error occurred. Please try again.");
//         }
//     };

//     return (
//         <div>
//             <h2>Ask Medical AI</h2>
//             <input
//                 type="text"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 placeholder="Ask a medical question..."
//             />
//             <button onClick={fetchAIResponse}>Ask</button>
//             <p>{response}</p>
//         </div>
//     );
// }

// export default Chatbot;





// import React, { useState } from "react";

// function Chatbot() {
//     const [input, setInput] = useState("");
//     const [response, setResponse] = useState("");

//     const fetchAIResponse = async () => {
//         try {
//             const res = await fetch(
//                 `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAn3ZmcmB8mYWFYtolq3EjAejaqO9jgAVc`,
//                 {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({
//                         contents: [
//                             {
//                                 parts: [
//                                     {
//                                         text: input
//                                     }
//                                 ]
//                             }
//                         ]
//                     })
//                 }
//             );
//             const data = await res.json();
//             console.log(data); // Debugging: Check the API response
//             setResponse(data.candidates[0].content.parts[0].text);
//         } catch (error) {
//             console.error("Error fetching AI response:", error);
//             setResponse("An error occurred. Please try again.");
//         }
//     };

//     return (
//         <div>
//             <h2>Ask Medical AI</h2>
//             <input
//                 type="text"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 placeholder="Ask a medical question..."
//             />
//             <button onClick={fetchAIResponse}>Ask</button>
//             <p>{response}</p>
//         </div>
//     );
// }

// export default Chatbot;



import React, { useState } from "react";

function Chatbot() {
    const [input, setInput] = useState("");
    const [conversation, setConversation] = useState([]); // Stores the conversation history

    const fetchAIResponse = async () => {
        try {
            // Add the user's message to the conversation
            setConversation((prev) => [
                ...prev,
                { sender: "user", text: input },
            ]);

            // Call the Gemini API
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAn3ZmcmB8mYWFYtolq3EjAejaqO9jgAVc`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    {
                                        text: input,
                                    },
                                ],
                            },
                        ],
                    }),
                }
            );
            const data = await res.json();
            const botResponse = data.candidates[0].content.parts[0].text;

            // Add the bot's response to the conversation
            setConversation((prev) => [
                ...prev,
                { sender: "bot", text: botResponse },
            ]);

            // Clear the input field
            setInput("");
        } catch (error) {
            console.error("Error fetching AI response:", error);
            // Add an error message to the conversation
            setConversation((prev) => [
                ...prev,
                { sender: "bot", text: "An error occurred. Please try again." },
            ]);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Ask Medical AI</h2>
            <div style={styles.conversation}>
                {conversation.map((message, index) => (
                    <div
                        key={index}
                        style={{
                            ...styles.message,
                            ...(message.sender === "user"
                                ? styles.userMessage
                                : styles.botMessage),
                        }}
                    >
                        <strong>{message.sender === "user" ? "You" : "Bot"}:</strong>{" "}
                        {message.text}
                    </div>
                ))}
            </div>
            <div style={styles.inputContainer}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a medical question..."
                    style={styles.input}
                    onKeyPress={(e) => {
                        if (e.key === "Enter") fetchAIResponse();
                    }}
                />
                <button onClick={fetchAIResponse} style={styles.button}>
                    Ask
                </button>
            </div>
        </div>
    );
}

// Styles for the chat interface
const styles = {
    container: {
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    header: {
        textAlign: "center",
        color: "#333",
    },
    conversation: {
        height: "400px",
        overflowY: "auto",
        marginBottom: "20px",
        padding: "10px",
        backgroundColor: "#fff",
        borderRadius: "5px",
        border: "1px solid #ddd",
    },
    message: {
        marginBottom: "10px",
        padding: "10px",
        borderRadius: "5px",
    },
    userMessage: {
        backgroundColor: "#e3f2fd",
        textAlign: "right",
    },
    botMessage: {
        backgroundColor: "#f5f5f5",
        textAlign: "left",
    },
    inputContainer: {
        display: "flex",
        gap: "10px",
    },
    input: {
        flex: 1,
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #ddd",
    },
    button: {
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
};

export default Chatbot;