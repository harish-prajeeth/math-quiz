import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GameProvider, useGame } from "./context/GameContext";
import { ProgressProvider } from "./context/ProgressContext";
import StartPage from "./pages/StartPage";
import MapPage from "./pages/MapPage";
import BriefingPage from "./pages/BriefingPage";
import QuestPage from "./pages/QuestPage";
import VictoryPage from "./pages/VictoryPage";
import PassportPage from "./pages/PassportPage";
import KitPage from "./pages/KitPage";

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { state } = useGame();
  if (!state.playerId) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export function App() {
  return (
    <GameProvider>
      <ProgressProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route
              path="/map"
              element={
                <ProtectedRoute>
                  <MapPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/briefing/:missionId"
              element={
                <ProtectedRoute>
                  <BriefingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quest/:missionId"
              element={
                <ProtectedRoute>
                  <QuestPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/victory/:sessionId"
              element={
                <ProtectedRoute>
                  <VictoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/passport"
              element={
                <ProtectedRoute>
                  <PassportPage />
                </ProtectedRoute>
              }
            />
            <Route path="/kit" element={<KitPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ProgressProvider>
    </GameProvider>
  );
}

export default App;
