import { FiBell } from "react-icons/fi";
import "./page-header.css";
import { Avatar, Card } from "@heroui/react";

export default function PageHeader() {
    return(
        <div className="header">
            <div className="headerContainer">
                <Avatar className="avatar"/>
                <Avatar className="mainAvatar"/>
                <FiBell className="notification"/>
            </div>
            <div className="userInfo">
                <h1 className="babysName">Baby's Growth</h1>

                <div className="cardContainer">
                    <Card 
                        isPressable 
                        shadow="sm"
                        className="cardInfo"
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
                    <Card 
                        isPressable 
                        shadow="sm"
                        className="cardInfo"
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
                </div>
            </div>
        </div>
    )
}