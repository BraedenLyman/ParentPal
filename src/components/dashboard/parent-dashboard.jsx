import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Card, Image } from "@heroui/react";
import { FiBell } from "react-icons/fi";
import Navbar from "../nav-bar/navbar";
import { auth } from "../../firebase/firebaseAuth";
import "./dashboard-styles.css";

export default function ParentDashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [babyData, setBabyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        navigate("/sign-in")
        return;
      }

      try {
        const idToken = await currentUser.getIdToken();
        const response = await axios.post(
          "http://localhost:3000/api/sign-in",
          { idToken },
          { withCredentials: true }
        );

        const { user, babyData } = response.data;
        setUserData(user);
        setBabyData(babyData || []);
      } catch (error) {
        console.error("Error fetching dashboard data: ", error);
        navigate("/sign-in");
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, [navigate])

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <>
      <div className="mainDashboard">
        <div className="header">
          <div className="headerContainer">
            <Avatar 
                className="avatar" 
                name={userData?.first_name?.charAt(0)?.toUpperCase() || ""}
            />
            <Image
              alt="Parent Pal Logo"
              src="/images/ParentPal.png"
              width={80}
              className="logo"
            />
            <FiBell className="notification" />
          </div>

          <div className="userInfo">
            <h2 className="username">
              Hi, {userData?.first_name || "Parent"},
            </h2>
            <h1 className="welcomeMessage">Welcome Back!</h1>

            <div className="cardContainer">
              {babyData.length > 0 ? (
                babyData.map((baby, index) => (
                  <Card
                    key={baby.baby_id || index}
                    isPressable
                    shadow="sm"
                    className="cardInfo"
                  >
                    <div className="cardContent">
                      <Avatar
                        name={baby.first_name?.charAt(0)?.toUpperCase() || ""}
                        size="lg"
                        className="avatar"
                      />
                      <div className="babyInfo">
                        <h3 className="baby">{baby.first_name}</h3>
                        <p className="babyDate">
                          {baby.birth_date
                            ? new Date(baby.birth_date).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <p>No baby information found.</p>
              )}
            </div>
          </div>
        </div>

        <div className="userTitle">
          <Avatar 
            className="mainAvatar" 
            name={babyData[0].first_name?.charAt(0)?.toUpperCase() || "N/A"}
          />
          <h1 className="userTitleName">
            {babyData.length > 0 ? babyData[0].first_name : "Baby"}'s Development
          </h1>
        </div>

        {/* Report Sections */}
        <Card className="reportSections">
          <h1 className="sectionTitle">Logs</h1>
          <p className="sectionDescription">
            Click on the card below to view/add logs
          </p>
          <div className="sections">
            <Card
              isPressable
              shadow="sm"
              className="cardReports growthCard"
              onClick={() => navigate("/growth-tracker", {state: {baby: babyData[0], user: userData}})}
            >
              <div>
                <h1>Growth Tracker</h1>
              </div>
            </Card>

            <Card
              isPressable
              shadow="sm"
              className="cardReports sleepCard"
              onClick={() => navigate("/sleep-analytics")}
            >
              <div>
                <h1>Sleep Analytics</h1>
              </div>
            </Card>
          </div>

          <div className="sections">
            <Card
              isPressable
              shadow="sm"
              className="cardReports healthCard"
              onClick={() => navigate("/health-journal")}
            >
              <div>
                <h1>Health Journal</h1>
              </div>
            </Card>

            <Card
              isPressable
              shadow="sm"
              className="cardReports feedingCard"
              onClick={() => navigate("/feeding-notes")}
            >
              <div>
                <h1>Feeding Notes</h1>
              </div>
            </Card>
          </div>

          <div className="sections">
            <Card
              isPressable
              shadow="sm"
              className="cardReports observationCard"
              onClick={() => navigate("/observation-notes")}
            >
              <div>
                <h1>Observation Notes</h1>
              </div>
            </Card>
          </div>
        </Card>

        {/* Assigned Tasks */}
        <Card className="reportSections">
          <h1 className="sectionTitle">Assigned Tasks</h1>
          <p className="sectionDescription">
            Click on the card below to view/add tasks to a babysitter
          </p>
          <div className="sections">
            <Card
              isPressable
              shadow="sm"
              className="cardReports assignedCard"
              onClick={() => navigate("/assigned-tasks")}
            >
              <div>
                <h1>Assigned Tasks</h1>
              </div>
            </Card>
          </div>
        </Card>

        {/* Photo Gallery */}
        <Card className="reportSections">
          <h1 className="sectionTitle">Photo Gallery</h1>
          <p className="sectionDescription">
            Click on the card below to view/add photos to the gallery
          </p>
          <div className="sections">
            <Card
              isPressable
              shadow="sm"
              className="cardReports photoGalleryCard"
              onClick={() => navigate("/photo-gallery")}
            >
              <div>
                <h1>Photo Gallery</h1>
              </div>
            </Card>
          </div>
        </Card>
      </div>

      <Navbar />
    </>
  );
}
