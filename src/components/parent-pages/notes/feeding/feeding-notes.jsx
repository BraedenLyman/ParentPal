import React from "react";
import axios from "axios";
import PageMiddleNav from "../../../page-components/page-middle-nav/page-middle-nav";
import Navbar from "../../../nav-bar/navbar";
import { Avatar, Button, Card, Input, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, TimeInput } from "@heroui/react";
import { Modal } from "@heroui/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import "../../parent-pages.css";
import { auth } from "../../../../firebase/firebaseAuth";
import { Scrollbars } from "react-custom-scrollbars-2";


export default function FeedingNotes() {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [feedTime, setFeedTime] = useState("");
    const [feedDate, setFeedDate] = useState("");
    const [fedFrom, setFedFrom] = useState("");
    const [feedType, setFeedType] = useState("");
    const [feedAmount, setFeedAmount] = useState("");
    const [feedNotes, setFeedNotes] = useState("");

    const [userData, setUserData] = useState(null);
    const [babyData, setBabyData] = useState([]);
    const [selectedBaby, setSelectedBaby] = useState(null);
    const [feedingRecords, setFeedingRecords] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const currentUser = auth.currentUser;

            if (!currentUser) return;

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

                const passedBaby = location.state?.baby;
                if (passedBaby) {
                    setSelectedBaby(passedBaby);
                } else if (babyData && babyData.length > 0) {
                    setSelectedBaby(babyData[0]);
                }
            } catch (error) {
                console.error("Error fetching dashboard data: ", error);
            }
        };

        fetchDashboardData();
    }, [location.state]);

    useEffect(() => {
        if (!selectedBaby) return;

        const fetchFeedingRecords = async () => {
            try {
                const { data } = await axios.get(`http://localhost:3000/api/feeding`, {
                    params: { baby_id: selectedBaby.baby_id },
                    withCredentials: true,
                });
                setFeedingRecords(data);
            } catch (err) {
                console.error("Failed to fetch feeding records: ", err)
            }
        };

        fetchFeedingRecords();
    }, [selectedBaby]);

    const handleAddFeeding = async () => {
        if (!feedTime || !feedDate || !fedFrom || !feedType || !feedAmount || !feedNotes) {
            alert("Please fill out all fields.");
            return;
        }

        const formattedTime = `${String(feedTime.hour).padStart(2, "0")}:${String(feedTime.minute).padStart(2, "0")}`;

        try {
            const { data: newRecord } = await axios.post(
                "http://localhost:3000/api/feeding",
                {
                    baby_id: selectedBaby.baby_id,
                    time_fed: formattedTime,
                    date: feedDate,
                    fed_from: fedFrom,
                    type_of_food: feedType,
                    amount: feedAmount,
                    notes: feedNotes,
                },
                { withCredentials: true }
            );

            setFeedingRecords((prev) => [...prev, newRecord]);

            setFeedTime("");
            setFeedDate("");
            setFedFrom("");
            setFeedType("");
            setFeedAmount("");
            setFeedNotes("");
            setIsOpen(false);
        } catch (err) {
            console.error("Failed to add feeding record: ", err);
        }
    };

    return (
        <div className="mainDiv">
            <div className="header">
                <div className="headerContainer">
                    <Avatar
                        className="avatar"
                        name={userData?.first_name?.charAt(0)?.toUpperCase() || "P"}
                    />
                    <Avatar
                        className="mainAvatar"
                        name={selectedBaby?.first_name?.charAt(0)?.toUpperCase() || "B"}
                    />
                    <FiBell className="notification"/>
                </div>
                <div className="userInfo">
                    <h1 className="babysName">{selectedBaby?.first_name || "Baby"}'s Feeding</h1>

                    <div className="cardContainer">
                        {babyData.length > 0 ? (
                            babyData.map((baby, index) => (
                                <Card
                                    key={baby.baby_id || index}
                                    isPressable
                                    shadow="sm"
                                    className={`cardInfo ${selectedBaby?.baby_id === baby.baby_id ? 'selectedCard' : ''}`}
                                    onClick={() => setSelectedBaby(baby)}
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

            <div className="pageMiddleNav">
                <PageMiddleNav />
            </div>

            
            <Scrollbars className="scrollContainer" >
                <div className="scrollContent">
                    {feedingRecords.length === 0 ? (
                        <h1>No feeding records yet</h1>
                    ) : (
                        feedingRecords.map((record) => (
                            <Card className="cardEntry" key={record.feeding_id}>
                                <div className="cardEntryContent">
                                    <h2>Time Fed: {record.time_fed}</h2>
                                    <h2>Date: {record.date.slice(0, 10)}</h2>
                                    <h2>Fed From: {record.fed_from}</h2>
                                    <h2>Type of Food: {record.type_of_food}</h2>
                                    <h2>Amount: {record.amount}</h2>
                                    <h2>Notes: {record.notes}</h2>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </Scrollbars>
          
            <Navbar />
            <Button className="addButton" onPress={() => setIsOpen(true)}>
                Add
            </Button >

            <Modal isOpen={isOpen} onOpenChange={setIsOpen} className="modal">
                <ModalContent >
                    <ModalHeader className="modalHeader">
                        Add Feeding
                    </ModalHeader>
                    <ModalBody className="modalBody">
                        <TimeInput
                            variant="bordered"
                            label="Feeding TIme" 
                            value={feedTime}
                            onChange={(newTime) => setFeedTime(newTime)}
                        />

                        <Input
                            variant="bordered"
                            label="Date"
                            type="date"
                            value={feedDate}
                            onChange={(e) => setFeedDate(e.target.value)}
                        />

                        <Select
                            variant="bordered"
                            label="Fed From"
                            placeholder="Select where the baby was fed from"
                            selectedKeys={fedFrom ? [fedFrom] : []}
                            onSelectionChange={(keys) => setFedFrom([...keys][0])}
                        >
                            <SelectItem key="bottle">Bottle</SelectItem>
                            <SelectItem key="left-boob">Left Boob</SelectItem>
                            <SelectItem key="right-boob">Right Boob</SelectItem>
                        </Select>

                        <Select
                            variant="bordered"
                            label="Type of Food"
                            placeholder="Select what type of food they had"
                            selectedKeys={feedType ? [feedType] : []}
                            onSelectionChange={(keys) => setFeedType([...keys][0])}
                        >
                            <SelectItem key="milk">Milk</SelectItem>
                            <SelectItem key="water">Water</SelectItem>
                            <SelectItem key="juice">Juice</SelectItem>
                        </Select>

                        <Input
                            variant="bordered"
                            label="Amount"
                            placeholder="Amount of food they were fed"
                            value={feedAmount}
                            onChange={(e) => setFeedAmount(e.target.value)}
                        />

                        <Input
                            variant="bordered"
                            label="Notes"
                            placeholder="Add any other important information"
                            value={feedNotes}
                            onChange={(e) => setFeedNotes(e.target.value)}
                        />
                        
                    </ModalBody>
                    <ModalFooter className="modalFooter">
                        <Button onPress={() => setIsOpen(false)}>
                            Cancel
                        </Button>

                        <Button onPress={handleAddFeeding}>
                            Add
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
