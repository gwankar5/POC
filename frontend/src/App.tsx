import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import StartGamePage from './pages/StartGamePage';
import GamePage from './pages/GamePage';
import ScoreboardPage from './pages/ScoreboardPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartGamePage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/scores" element={<ScoreboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
