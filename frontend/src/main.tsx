// src/main.tsx
// import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// ✅ load semua stylesheet bersama
import "./components/shared/styles/index.css";

createRoot(document.getElementById("root")!).render(<App />);
