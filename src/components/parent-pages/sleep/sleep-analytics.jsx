import axios from "axios";
import PageMiddleNav from "../../page-components/page-middle-nav/page-middle-nav";
import Navbar from "../../nav-bar/navbar";
import { Avatar, Button, Card, Input, ModalBody, ModalContent, ModalFooter, ModalHeader, Image } from "@heroui/react";
import {TimeInput} from "@heroui/react";
import { Modal } from "@heroui/react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import "../parent-pages.css";
import { Scrollbars } from "react-custom-scrollbars-2";
import { useBabyData } from "../../../hooks/useBabyData";
import API_URL from "../../../config/api";


export default function SleepAnalytics() {
    const location = useLocation();
    const navigate = useNavigate();
    const { userData, babyData, selectedBaby, setSelectedBaby, loading: dataLoading } = useBabyData(location.state);
    const [isOpen, setIsOpen] = useState(false);
    const [hours, setHours] = useState("");
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");
    const [sleepRecords, setSleepRecords] = useState([]);

    useEffect(() => {
        if (!selectedBaby) return;

        const fetchSleepRecords = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/sleep`, {
                    params: { baby_id: selectedBaby.baby_id },
                    withCredentials: true,
                });
                setSleepRecords(data);
            } catch (err) {
                console.error("Failed to fetch sleep records: ", err)
            }
        };

        fetchSleepRecords();
    }, [selectedBaby]);

    const handleAddSleep = async () => {
        if (!hours || !time || !date) {
            alert("Please fill out all fields.");
            return;
        }

        const formattedTime = `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}`;

        try {
            const { data: newRecord } = await axios.post(
                `${API_URL}/api/sleep`,
                {
                    baby_id: selectedBaby.baby_id,
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

    const isBabysitter = location.state?.isBabysitter;

    return (
        <div className="mainDiv">
           <div className="header">
            <div className="headerContainer">
                <Button
                    isIconOnly
                    variant="light"
                    onPress={() => navigate(isBabysitter ? "/babysitter-dashboard" : "/parent-dashboard")}
                    className="back-button-header"
                >
                    <ArrowLeftIcon className="w-6 h-6" />
                </Button>
                <Image
                    alt="Parent Pal Logo"
                    src="/images/ParentPal.png"
                    width={80}
                    className="logo"
                />
                <FiBell className="notification"/>
            </div>
            <div className="headerTitle">
                <h1>{selectedBaby?.first_name || "Baby"}'s Sleep</h1>
            </div>
            <div className="userInfo">
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
