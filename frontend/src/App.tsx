import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import InvitationPage from "./pages/InvitationPage";
import LandingPage from "./pages/LandingPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/:slug" element={<InvitationPage />} />
        <Route path="/invitations/:slug" element={<InvitationPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}