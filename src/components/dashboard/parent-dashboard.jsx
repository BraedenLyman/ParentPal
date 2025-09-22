import { useLocation, useNavigate } from "react-router-dom";
import "./dashboard-styles.css"
import { Avatar, Card, CardBody, Image } from "@heroui/react";
import { FiBell } from "react-icons/fi";
import Navbar from "../nav-bar/navbar";


export default function ParentDashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const babyData = location.state?.babyData || []; 

    return (
        <>
        <div className="mainDashboard">
            <div className="header">
                <div className="headerContainer">
                    <Avatar className="avatar"/>
                    <Image  
                        alt="Parent Pal Logo"
                        src="/images/ParentPal.png"
                        width={80}
                        className="logo"
                    />
                    <FiBell className="notification"/>
                </div>
                <div className="userInfo">
                    <h2 className="username">Hi, Parent,</h2>
                    <h1 className="welcomeMessage">Welcome Back!</h1>

                    <div className="cardContainer">
                        {babyData.length > 0 ? (
                            babyData.map((baby, index) => (
                                <Card 
                                    isPressable 
                                    shadow="sm"
                                    className="cardInfo"
                                    key={baby.baby_id || index}
                                >
                                    <div className="cardContent">
                                        <Avatar
                                            name={baby.first_name ? baby.first_name.charAt(0) : "N/A"} 
                                            size="sm" 
                                            className="avatar"
                                        />
                                        <div className="babyInfo">
                                            <h3 className="baby">{baby.first_name}</h3>
                                            <p className="babyDate">{baby.birth_date ? new Date(baby.birth_date).toLocaleDateString() : "N/A"}</p>
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
                <Avatar className="mainAvatar"/>
                <h1 className="userTitleName">Jack's Development</h1>
            </div>

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
                        onClick={() => navigate("/growth-tracker")}
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
                        <div >
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
                        <div >
                            <h1>Health Journal</h1>
                        </div>
                    </Card>

                    <Card 
                        isPressable 
                        shadow="sm"
                        className="cardReports feedingCard"
                        onClick={() => navigate("/feeding-notes")}
                    >
                        <div >
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
                        <div >
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
                        onClick={() => navigate("/assigned-tasks")}
                    >
                        <div >
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
                        onClick={() => navigate("/photo-gallery")}
                    >
                        <div >
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
