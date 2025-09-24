import axios from "axios";
import PageMiddleNav from "../../page-components/page-middle-nav/page-middle-nav";
import Navbar from "../../nav-bar/navbar";
import { Avatar, Button, Card, Input, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import {TimeInput} from "@heroui/react";
import { Modal } from "@heroui/react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import "../parent-pages.css";


export default function SleepAnalytics() {
    const location = useLocation();
    const [sleep, setSleep] = useState([]);
    const { baby, user } = location.state || {}; 
    const [isOpen, setIsOpen] = useState(false);
    const [hours, setHours] = useState("");
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");

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
                <h1 className="babysName">{baby?.first_name || "Baby"}'s Sleep</h1>

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
                        Add Sleep
                    </ModalHeader>
                    <ModalBody className="modalBody">
                        <Input 
                            variant="bordered"
                            label="Hours" 
                            placeholder="Hours slept" 
                            type="number"
                            value={hours}
                            onChange={(e) => setHours(e.target.value)}
                        />
                        <TimeInput 
                            variant="bordered"
                            label="Time fell asleep at" 
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        />

                        <Input
                            variant="bordered"
                            label="Date"
                            placeholder="Date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                      
                    </ModalBody>
                    <ModalFooter className="modalFooter">
                        <Button onPress={() => setIsOpen(false)}>
                            Cancel
                        </Button>

                        <Button >
                            Add
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
