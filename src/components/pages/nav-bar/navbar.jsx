import React from "react";
import { HomeIcon as HomeIconOutline } from "@heroicons/react/24/outline";
import { ChartBarIcon as ChartBarIconOutline } from "@heroicons/react/24/outline";
import { Cog6ToothIcon as Cog6ToothIconOutline } from "@heroicons/react/24/outline";
import { DocumentTextIcon as DocumentTextIconOutline } from "@heroicons/react/24/outline";
import { ClipboardDocumentListIcon as ClipboardDocumentListIconOutline } from "@heroicons/react/24/outline";
import { ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconOutline } from "@heroicons/react/24/outline";
import { CalendarIcon as CalendarIconOutline } from "@heroicons/react/24/outline";
import { HomeIcon as HomeIconSolid } from "@heroicons/react/24/solid";
import { ChartBarIcon as ChartBarIconSolid } from "@heroicons/react/24/solid";
import { Cog6ToothIcon as Cog6ToothIconSolid } from "@heroicons/react/24/solid";
import { DocumentTextIcon as DocumentTextIconSolid } from "@heroicons/react/24/solid";
import { ClipboardDocumentListIcon as ClipboardDocumentListIconSolid } from "@heroicons/react/24/solid";
import { ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid } from "@heroicons/react/24/solid";
import { CalendarIcon as CalendarIconSolid } from "@heroicons/react/24/solid";
import "./nav-bar.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../../../firebase/firebaseAuth";
import API_URL from "../../../config/api";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userType, setUserType] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

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
        const accountType = response.data.user.account_type;
        const userId = response.data.user.account_id;
        setUserType(accountType);
        setAccountId(userId);
      } catch (error) {
        console.error("Error fetching user type:", error);
      }
    };

    fetchUserType();
  }, []);

  // Fetch unread message count
  useEffect(() => {
    if (!accountId) return;

    const fetchUnreadCount = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      try {
        const idToken = await currentUser.getIdToken();
        const response = await axios.get(
          `${API_URL}/api/messaging/unread-count/${accountId}`,
          {
            headers: { Authorization: `Bearer ${idToken}` },
            withCredentials: true,
          }
        );
        setUnreadCount(response.data.count);
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };

    fetchUnreadCount();

    // Poll for unread count every 10 seconds
    const interval = setInterval(fetchUnreadCount, 10000);

    return () => clearInterval(interval);
  }, [accountId]);

  const handleHomeClick = () => {
    if (userType === 'babysitter') {
      navigate("/babysitter-dashboard");
    } else {
      navigate("/parent-dashboard");
    }
  };

  const handleLogsClick = () => {
    if (userType === 'babysitter') {
      navigate("/sleep-analytics", { state: { isBabysitter: true } });
    } else {
      navigate("/growth-tracker", { state: { isBabysitter: false } });
    }
  };

  const handleTasksClick = () => {
    if (userType === 'babysitter') {
      navigate("/assigned-tasks");
    } else {
      navigate("/parent-assigned-tasks");
    }
  };

  const handleMessagesClick = () => {
    if (userType === 'babysitter') {
      navigate("/babysitter-messages");
    } else {
      navigate("/parent-messages");
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

  const isLogsActive = () => {
    if (userType === 'babysitter') {
      return location.pathname === "/sleep-analytics";
    }
    return location.pathname === "/growth-tracker";
  };

  const isTasksActive = () => {
    if (userType === 'babysitter') {
      return location.pathname === "/assigned-tasks";
    }
    return location.pathname === "/parent-assigned-tasks";
  };

  const isMessagesActive = () => {
    if (userType === 'babysitter') {
      return location.pathname === "/babysitter-messages";
    }
    return location.pathname === "/parent-messages";
  };

  const isCalendarActive = () => {
    return location.pathname === "/calendar";
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
          className={`navSection ${isLogsActive() ? 'active' : ''}`}
          onClick={handleLogsClick}
        >
          {isLogsActive() ? (
            <DocumentTextIconSolid className="nav-icon" />
          ) : (
            <DocumentTextIconOutline className="nav-icon" />
          )}
          <span className="nav-label">Logs</span>
        </div>

        <div
          className={`navSection ${isTasksActive() ? 'active' : ''}`}
          onClick={handleTasksClick}
        >
          {isTasksActive() ? (
            <ClipboardDocumentListIconSolid className="nav-icon" />
          ) : (
            <ClipboardDocumentListIconOutline className="nav-icon" />
          )}
          <span className="nav-label">Tasks</span>
        </div>

        <div
          className={`navSection ${isMessagesActive() ? 'active' : ''}`}
          onClick={handleMessagesClick}
        >
          <div className="nav-icon-wrapper">
            {isMessagesActive() ? (
              <ChatBubbleLeftRightIconSolid className="nav-icon" />
            ) : (
              <ChatBubbleLeftRightIconOutline className="nav-icon" />
            )}
            {unreadCount > 0 && (
              <span className="unread-badge-nav">{unreadCount}</span>
            )}
          </div>
          <span className="nav-label">Messages</span>
        </div>

        {userType !== 'babysitter' && (
          <div
            className={`navSection ${isCalendarActive() ? 'active' : ''}`}
            onClick={() => navigate("/calendar")}
          >
            {isCalendarActive() ? (
              <CalendarIconSolid className="nav-icon" />
            ) : (
              <CalendarIconOutline className="nav-icon" />
            )}
            <span className="nav-label">Calendar</span>
          </div>
        )}

        {userType !== 'babysitter' && (
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
        )}

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
