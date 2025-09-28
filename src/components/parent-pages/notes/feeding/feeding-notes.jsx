import React from "react";
import axios from "axios";
import PageMiddleNav from "../../../page-components/page-middle-nav/page-middle-nav";
import Navbar from "../../../nav-bar/navbar";
import { Avatar, Button, Card, Input, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, TimeInput } from "@heroui/react";
import { Modal } from "@heroui/react";
import { useEffect, useState } from "react";
import { FiBell } from "react-icons/fi";
import "../../parent-pages.css";
import { auth } from "../../../../firebase/firebaseAuth";
import { Scrollbars } from "react-custom-scrollbars-2";


export default function FeedingNotes() {
    const [isOpen, setIsOpen] = useState(false);
    const [feedTime, setFeedTime] = useState("");
    const [feedDate, setFeedDate] = useState("");
    const [fedFrom, setFedFrom] = useState("");
    const [feedType, setFeedType] = useState("");
    const [feedAmount, setFeedAmount] = useState("");
    const [feedNotes, setFeedNotes] = useState("");

    const [babyId, setBabyId ] = useState(null);
    const [feedingRecords, setFeedingRecords] = useState([]);

    useEffect(() => {
        const fetchBaby = async () => {
            const user = auth.currentUser;
            if (!user) return;

            try {
                const { data } = await axios.get("http://localhost:3000/api/babies", {
                    params: { firebase_uid: user.uid },
                    withCredentials: true,
                });
                setBabyId(data.baby_id);
            } catch (err) {
                console.error("Failed to fetch baby: ", err);
            }
        };

        fetchBaby();
    }, []);

    useEffect(() => {
        if (!babyId) return;

        const fetchFeedingRecords = async () => {
            try {
                const { data } = await axios.get(`http://localhost:3000/api/feeding`, {
                    params: { baby_id: babyId },
                    withCredentials: true,
                });
                setFeedingRecords(data);
            } catch (err) {
                console.error("Failed to fetch feeding records: ", err)
            }
        };

        fetchFeedingRecords();
    }, [babyId]);

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
                    baby_id: babyId,
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
                        name={"P"}
                    />
                    <Avatar 
                        className="mainAvatar"
                        name={"B"}
                    />
                    <FiBell className="notification"/>
                </div>
                <div className="userInfo">
                    <h1 className="babysName">Baby's Feeding</h1>

                    <div className="cardContainer">
                        <Card isPressable shadow="sm" className="cardInfo">
                            <div className="cardContent">
                                <Avatar
                                    name={"B"} 
                                    className="avatar"
                                />
                                <div className="babyInfo">
                                    <h3 className="baby">Baby</h3>
                                    <p className="babyDate">2002-02-02</p>
                                </div>
                            </div>
                        </Card>
                    
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
