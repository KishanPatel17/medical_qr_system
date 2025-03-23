import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProfilePage from "./components/ProfilePage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/profile/:uid" element={<ProfilePage />} />
                <Route path="/" element={<h1>Welcome to the Medical QR System</h1>} />
            </Routes>
        </Router>
    );
}

export default App;