import { useNavigate } from "react-router-dom";
import "./dashboard-styles.css"
import { Avatar, Card, CardBody, Image } from "@heroui/react";
import { FiBell } from "react-icons/fi";


export default function ParentDashboard() {
    const navigate = useNavigate();

    return (
        <div className="mainDiv">
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
                    <h2 className="username">Hi, Braeden,</h2>
                    <h1 className="welcomeMessage">Welcome Back!</h1>

                    <div className="cardContainer">
                        <Card 
                            className="cardInfo"
                            onClick={() => handleCardClick("Jack")}
                        >
                            <div className="cardContent">
                                <Avatar
                                    name="J" 
                                    size="sm" 
                                    className="avatar"
                                />
                                <div className="babyInfo">
                                    <h3 className="baby">Jack</h3>
                                    <p className="babyDate">2025/02/23</p>
                                </div>
                            </div>
                        </Card>
                        <Card className="cardInfo">
                            <div className="cardContent">
                                <Avatar
                                    name="J" 
                                    size="sm" 
                                    className="avatar"
                                />
                                <div className="babyInfo">
                                    <h3 className="baby">Jack</h3>
                                    <p className="babyDate">2025/02/23</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
            <div className="userTitle">
                <Avatar className="mainAvatar"/>
                <h1 className="userTitleName">Jack's Development</h1>
            </div>

            <div className="logReports">
                <h1 className="sectionTitle">Logs</h1>
                <p className="sectionDescription">
                    Click on the card below to view/add logs
                </p>
                <div className="sections">
                    <Card className="cardReports">
                        <div >
                            <h1>Growth Tracker</h1>
                        </div>
                    </Card>

                    <Card className="cardReports">
                        <div >
                            <h1>Sleep Analytics</h1>
                        </div>
                    </Card>
                </div>

                <div className="sections">
                    <Card className="cardReports">
                        <div >
                            <h1>Health Journal</h1>
                        </div>
                    </Card>

                    <Card className="cardReports">
                        <div >
                            <h1>Feeding Notes</h1>
                        </div>
                    </Card>
                </div>

                <div className="sections">
                    <Card className="cardReports">
                        <div >
                            <h1>Observation Notes</h1>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
