import { HomeIcon } from "@heroicons/react/24/outline";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
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
    console.log('Home clicked, user type:', userType);
    if (userType === 'babysitter') {
      navigate("/babysitter-dashboard");
    } else {
      navigate("/parent-dashboard");
    }
  };

  return (
   <div className="navBarContainer">
        <div
          className="navSection"
          onClick={handleHomeClick}
        >
          <HomeIcon width={20}/>
          <h1>Home</h1>
        </div>

        <div
          className="navSection"
          onClick={() => navigate("/reports")}
        >
          <ChartBarIcon width={20}/>
          <h1>Reports</h1>
        </div>

        <div
          className="navSection"
          onClick={() => navigate("/settings")}
        >
          <Cog6ToothIcon width={20}/>
          <h1>Settings</h1>
        </div>
    </div>
  );
};
