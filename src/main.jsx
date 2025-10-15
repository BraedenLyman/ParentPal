import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HeroUIProvider } from "@heroui/react";
import App from "./App.jsx";
import { Provider } from "./provider.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import "./styles/globals.css";
import "./styles/design-system.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <HeroUIProvider>
        <Provider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </Provider>
      </HeroUIProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
