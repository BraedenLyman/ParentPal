import { HomeIcon } from "@heroicons/react/24/outline";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import "./nav-bar.css";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();

  return (
   <div maxWidth="xl" isBordered className="navBarContainer">
        <div 
          className="navSection"
          onClick={() => navigate("/parent-dashboard")}
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
