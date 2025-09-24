import axios from "axios";
import PageMiddleNav from "../../page-components/page-middle-nav/page-middle-nav";
import Navbar from "../../nav-bar/navbar";
import { Avatar, Button, Card, Input, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import {TimeInput} from "@heroui/react";
import { Modal } from "@heroui/react";
import { useState, useEffect } from "react";
import { FiBell } from "react-icons/fi";
import "../parent-pages.css";
import { auth } from "../../../firebase/firebaseAuth";
import { Scrollbars } from "react-custom-scrollbars-2";


export default function SleepAnalytics() {
    const [isOpen, setIsOpen] = useState(false);
    const [hours, setHours] = useState("");
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");
    const [babyId, setBabyId ] = useState(null);
    const [sleepRecords, setSleepRecords] = useState([]);

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

        const fetchSleepRecords = async () => {
            try {
                const { data } = await axios.get(`http://localhost:3000/api/sleep`, {
                    params: { baby_id: babyId },
                    withCredentials: true,
                });
                setSleepRecords(data);
            } catch (err) {
                console.error("Failed to fetch sleep records: ", err)
            }
        };

        fetchSleepRecords();
    }, [babyId]);

    const handleAddSleep = async () => {
        if (!hours || !time || !date) {
            alert("Please fill out all fields.");
            return;
        }

        const formattedTime = `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}`;

        try {
            const { data: newRecord } = await axios.post(
                "http://localhost:3000/api/sleep",
                {
                    baby_id: babyId,
                    sleep_duration: hours,
                    time_fell_asleep: formattedTime,
                    date,
                },
                { withCredentials: true }
            );

            setSleepRecords((prev) => [...prev, newRecord]);

            setHours("");
            setTime("");
            setDate("");
            setIsOpen(false);
        } catch (err) {
            console.error("Failed to add growth record: ", err);
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
                <h1 className="babysName">Baby's Sleep</h1>

                <div className="cardContainer">
                    <Card  isPressable shadow="sm" className="cardInfo">
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
                {sleepRecords.length === 0 ? (
                    <h1>No sleep records yet</h1>
                ) : (
                    sleepRecords.map((record) => (
                        <Card className="cardEntry" key={record.sleep_id}>
                            <div className="cardEntryContent">
                                <h2>Duration: {record.sleep_duration}</h2>
                                <h2>Time fell asleep at: {record.time_fell_asleep}</h2>
                                <h2>Date: {record.date.slice(0, 10)}</h2>
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
                            onChange={(newTime) => setTime(newTime)}
                            
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

                        <Button onPress={handleAddSleep}>
                            Add
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
