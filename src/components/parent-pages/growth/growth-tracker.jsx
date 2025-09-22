import PageHeader from "../../page-components/page-header/page-header";
import PageMiddleNav from "../../page-components/page-middle-nav/page-middle-nav";
import Navbar from "../../nav-bar/navbar";
import "./growth.css";
import { Avatar, Button, Card, Input, InputOtp, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { Modal } from "@heroui/react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { FiBell } from "react-icons/fi";


export default function GrowthTracker() {
    const location = useLocation();
    const { baby, user } = location.state || {}; 
    const [isOpen, setIsOpen] = useState(false);
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [date, setDate] = useState("");

    function addInfo() {
        
    }

    return (
        <div className="mainDiv">
           <div className="header">
            <div className="headerContainer">
                <Avatar 
                    className="avatar"
                    name={user?.first_name?.charAt(0)?.toUpperCase() || ""}
                />
                <Avatar 
                    className="mainAvatar"
                    name={baby?.first_name?.charAt(0)?.toUpperCase() || ""}
                />
                <FiBell className="notification"/>
            </div>
            <div className="userInfo">
                <h1 className="babysName">{baby?.first_name || "Baby"}'s Growth</h1>

                <div className="cardContainer">
                    {[baby].map((b, index) => (
                        <Card key={index} isPressable shadow="sm" className="cardInfo">
                            <div className="cardContent">
                                <Avatar
                                    name={b?.first_name?.charAt(0)?.toUpperCase() || ""} 
                                    className="avatar"
                                />
                                <div className="babyInfo">
                                <h3 className="baby">{b?.first_name || "Baby"}</h3>
                                <p className="babyDate">
                                    {b?.birth_date ? new Date(b.birth_date).toLocaleDateString() : "N/A"}
                                </p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>

        <PageMiddleNav />
        <Navbar />
        <Button className="addButton" onPress={() => setIsOpen(true)}>
            Add
        </Button >

            <Modal isOpen={isOpen} onOpenChange={setIsOpen} className="modal">
                <ModalContent >
                    <ModalHeader className="modalHeader">
                        Add Growth
                    </ModalHeader>
                    <ModalBody className="modalBody">
                        <Input 
                            variant="bordered"
                            label="Height" 
                            placeholder="How tall are they" 
                            type="text"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                        />
                        <p>{height}</p>

                        <Input 
                            variant="bordered"
                            label="Weight" 
                            placeholder="How much do they weigh" 
                            type="text"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                        />
                        <p>{weight}</p>

                        <Input
                            variant="bordered"
                            label="Date"
                            placeholder="Date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                        <p>{date}</p>
                    </ModalBody>
                    <ModalFooter className="modalFooter">
                        <Button onPress={() => setIsOpen(false)}>
                            Cancel
                        </Button>

                        <Button onClick={addInfo}>
                            Add
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
