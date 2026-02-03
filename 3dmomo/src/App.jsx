import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LearningPage from './pages/LearningPage';
import StudyPage from './pages/StudyPage'; // 기존에 만들던 3D 뷰어 페이지

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/learning" element={<LearningPage />} />
                <Route path="/study/:id" element={<StudyPage />} />
            </Routes>
        </Router>
    );
}

export default App;