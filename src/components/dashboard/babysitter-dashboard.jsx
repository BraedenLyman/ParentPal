import { useNavigate, useLocation } from "react-router-dom";
import "./dashboard-styles.css"
import { Avatar, Card, Image } from "@heroui/react";
import { FiBell } from "react-icons/fi";
import Navbar from "../nav-bar/navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../../firebase/firebaseAuth";
import API_URL from "../../config/api";

export default function BabysitterDashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const [userData, setUserData] = useState(null);
    const [accessibleChildren, setAccessibleChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetchDashboardData();
    }, [location.pathname]);

    const fetchDashboardData = async () => {
        const currentUser = auth.currentUser;

        if (!currentUser) {
            navigate("/sign-in");
            return;
        }

        try {
            const idToken = await currentUser.getIdToken();
            const response = await axios.post(
                `${API_URL}/api/sign-in`,
                { idToken },
                { withCredentials: true }
            );

            const { user } = response.data;
            setUserData(user);

            const childrenResponse = await axios.get(
                `http://localhost:3000/api/babysitter-sharing/children/${user.account_id}`,
                { withCredentials: true }
            );

            setAccessibleChildren(childrenResponse.data.children);
            if (childrenResponse.data.children.length > 0) {
                setSelectedChild(childrenResponse.data.children[0]);
            } else {
                console.log('No children found - babysitter has no verified access');
            }
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                console.log('Authentication error, redirecting to sign-in');
                navigate("/sign-in");
            } else {
                console.log('Data fetch error, but user is still authenticated');
                setAccessibleChildren([]);
                setSelectedChild(null);
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Loading dashboard...</p>;
    }

    return (
        <div className="mainDashboard">
            <div className="header">
                <div className="headerContainer">
                    <Avatar
                        className="avatar"
                        name={userData?.first_name?.charAt(0)?.toUpperCase() || "B"}
                    />
                    <Image
                        alt="Parent Pal Logo"
                        src="/images/ParentPal.png"
                        width={80}
                        className="logo"
                    />
                    <FiBell className="notification"/>
                </div>
                <div className="userInfo">
                    <h2 className="username">Hi, {userData?.first_name || "Babysitter"},</h2>
                    <h1 className="welcomeMessage">Welcome Back!</h1>

                    <div className="cardContainer">
                        {accessibleChildren.length > 0 ? (
                            accessibleChildren.map((child, index) => (
                                <Card
                                    key={child.baby_id || index}
                                    isPressable
                                    shadow="sm"
                                    className={`cardInfo ${selectedChild?.baby_id === child.baby_id ? 'selectedCard' : ''}`}
                                    onClick={() => setSelectedChild(child)}
                                >
                                    <div className="cardContent">
                                        <Avatar
                                            name={child.first_name?.charAt(0)?.toUpperCase() || "C"}
                                            size="lg"
                                            className="avatar"
                                        />
                                        <div className="babyInfo">
                                            <h3 className="baby">{child.first_name}</h3>
                                            <p className="babyDate">
                                                {child.birth_date
                                                    ? new Date(child.birth_date).toLocaleDateString()
                                                    : "N/A"
                                                }
                                            </p>
                                            <p className="parentInfo">
                                                {child.parent_first_name} {child.parent_last_name}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <Card className="cardInfo no-access-card">
                                <div className="cardContent">
                                    <div className="no-access-info">
                                        <p>No babies available.</p>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            {selectedChild && (
                <div className="userTitle">
                    <Avatar
                        className="mainAvatar"
                        name={selectedChild.first_name?.charAt(0)?.toUpperCase() || "C"}
                    />
                    <h1 className="userTitleName">{selectedChild.first_name}'s Development</h1>
                </div>
            )}

            {selectedChild ? (
                <>
                    <Card className="reportSections">
                        <h1 className="sectionTitle">Logs</h1>
                        <p className="sectionDescription">
                            Click on the card below to view/add logs
                        </p>
                        <div className="sections">
                            <Card
                                isPressable
                                shadow="sm"
                                className="cardReports sleepCard"
                                onClick={() => navigate("/sleep-analytics", {state: {baby: selectedChild, user: userData, isBabysitter: true}})}
                            >
                                <div>
                                    <h1>Sleep Analytics</h1>
                                </div>
                            </Card>
                            <Card
                                isPressable
                                shadow="sm"
                                className="cardReports healthCard"
                                onClick={() => navigate("/health-journal", {state: {baby: selectedChild, user: userData, isBabysitter: true}})}
                            >
                                <div>
                                    <h1>Health Journal</h1>
                                </div>
                            </Card>
                        </div>

                        <div className="sections">
                            <Card
                                isPressable
                                shadow="sm"
                                className="cardReports observationCard"
                                onClick={() => navigate("/observation-notes", {state: {baby: selectedChild, user: userData, isBabysitter: true}})}
                            >
                                <div>
                                    <h1>Observation Notes</h1>
                                </div>
                            </Card>

                            <Card
                                isPressable
                                shadow="sm"
                                className="cardReports feedingCard"
                                onClick={() => navigate("/feeding-notes", {state: {baby: selectedChild, user: userData, isBabysitter: true}})}
                            >
                                <div>
                                    <h1>Feeding Notes</h1>
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
                                onClick={() => navigate("/assigned-tasks", {state: {baby: selectedChild, user: userData, isBabysitter: true}})}
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
                                onClick={() => navigate("/photo-gallery", {state: {baby: selectedChild, user: userData, isBabysitter: true}})}
                            >
                                <div>
                                    <h1>Photo Gallery</h1>
                                </div>
                            </Card>
                        </div>
                    </Card>
                </>
            ) : (
                <Card className="reportSections">
                    <div className="no-child-selected">
                        <h2>No Access Yet</h2>
                        <p>A parent has to share their child's development with you.</p>
                    </div>
                </Card>
            )}
            <Navbar />
        </div>
    );
}
