import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth.jsx";
import HomeScreen from "./components/HomeScreen.jsx";
import CoachChat from "./components/CoachChat.jsx";
import DomainScreen from "./components/DomainScreen.jsx";
import LoginScreen from "./components/LoginScreen.jsx";

function AppRoutes() {
  const { user } = useAuth();

  if (!user) {
    return <LoginScreen onSuccess={() => navigate("/")} />;
  }

  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/domain/:domainId" element={<DomainScreen />} />
      <Route path="/chat/:conversationId" element={<CoachChat />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}