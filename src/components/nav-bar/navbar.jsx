import React from "react";
import { HomeIcon as HomeIconOutline } from "@heroicons/react/24/outline";
import { ChartBarIcon as ChartBarIconOutline } from "@heroicons/react/24/outline";
import { Cog6ToothIcon as Cog6ToothIconOutline } from "@heroicons/react/24/outline";
import { HomeIcon as HomeIconSolid } from "@heroicons/react/24/solid";
import { ChartBarIcon as ChartBarIconSolid } from "@heroicons/react/24/solid";
import { Cog6ToothIcon as Cog6ToothIconSolid } from "@heroicons/react/24/solid";
import "./nav-bar.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../../firebase/firebaseAuth";
import API_URL from "../../config/api";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const fetchUserType = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      try {
        const idToken = await currentUser.getIdToken();
        const response = await axios.post(
          `${API_URL}/api/sign-in`,
          { idToken },
          { withCredentials: true }
        );
        setUserType(response.data.user.account_type);
      } catch (error) {
        console.error("Error fetching user type:", error);
      }
    };

    fetchUserType();
  }, []);

  const handleHomeClick = () => {
    if (userType === 'babysitter') {
      navigate("/babysitter-dashboard");
    } else {
      navigate("/parent-dashboard");
    }
  };

  const isHomeActive = () => {
    const dashboardPaths = ["/parent-dashboard", "/babysitter-dashboard"];
    return dashboardPaths.includes(location.pathname);
  };

  const isSettingsActive = () => {
    return location.pathname.startsWith("/settings");
  };

  const isReportsActive = () => {
    return location.pathname === "/reports";
  };

  return (
   <div className="navBarContainer">
        <div
          className={`navSection ${isHomeActive() ? 'active' : ''}`}
          onClick={handleHomeClick}
        >
          {isHomeActive() ? (
            <HomeIconSolid className="nav-icon" />
          ) : (
            <HomeIconOutline className="nav-icon" />
          )}
          <span className="nav-label">Home</span>
        </div>

        <div
          className={`navSection ${isReportsActive() ? 'active' : ''}`}
          onClick={() => navigate("/reports")}
        >
          {isReportsActive() ? (
            <ChartBarIconSolid className="nav-icon" />
          ) : (
            <ChartBarIconOutline className="nav-icon" />
          )}
          <span className="nav-label">Reports</span>
        </div>

        <div
          className={`navSection ${isSettingsActive() ? 'active' : ''}`}
          onClick={() => navigate("/settings")}
        >
          {isSettingsActive() ? (
            <Cog6ToothIconSolid className="nav-icon" />
          ) : (
            <Cog6ToothIconOutline className="nav-icon" />
          )}
          <span className="nav-label">Settings</span>
        </div>
    </div>
  );
};
