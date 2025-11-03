import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Card, Image } from "@heroui/react";
import Navbar from "../nav-bar/navbar";
import { auth } from "../../../firebase/firebaseAuth";
import API_URL from "../../../config/api";
import "./dashboard-styles.css";

export default function ParentDashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [babyData, setBabyData] = useState([]);
  const [selectedBaby, setSelectedBaby] = useState(null);
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
          `${API_URL}/api/sign-in`,
          { idToken },
          { withCredentials: true }
        );

        const { user, babyData } = response.data;
        setUserData(user);
        setBabyData(babyData || []);
        if (babyData && babyData.length > 0) {
          setSelectedBaby(babyData[0]);
        }
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
          </div>

          <div className="userInfoMain">
            <h2 className="username">
              Hi, {userData?.first_name || "Parent"},
            </h2>
            <h1 className="welcomeMessage">Welcome Back!</h1>
          </div>
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
              onClick={() => navigate("/growth-tracker", {state: {baby: selectedBaby, user: userData}})}
            >
              <div>
                <h1>Growth Tracker</h1>
              </div>
            </Card>

            <Card
              isPressable
              shadow="sm"
              className="cardReports sleepCard"
              onClick={() => navigate("/sleep-analytics", {state: {baby: selectedBaby, user: userData}})}
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
              onClick={() => navigate("/health-journal", {state: {baby: selectedBaby, user: userData}})}
            >
              <div>
                <h1>Health Journal</h1>
              </div>
            </Card>

            <Card
              isPressable
              shadow="sm"
              className="cardReports feedingCard"
              onClick={() => navigate("/feeding-notes", {state: {baby: selectedBaby, user: userData}})}
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
              onClick={() => navigate("/observation-notes", {state: {baby: selectedBaby, user: userData}})}
            >
              <div>
                <h1>Observation Notes</h1>
              </div>
            </Card>
          </div>
        </Card>

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
              onClick={() => navigate("/parent-assigned-tasks", {state: {baby: selectedBaby, user: userData}})}
            >
              <div>
                <h1>Assigned Tasks</h1>
              </div>
            </Card>
          </div>
        </Card>

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
              onClick={() => navigate("/photo-gallery", {state: {baby: selectedBaby, user: userData}})}
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
