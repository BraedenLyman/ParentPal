import React from "react";
import axios from "axios";
import Navbar from "../nav-bar/navbar";
import { Button, Card, Input, ModalBody, ModalContent, ModalFooter, ModalHeader, Image } from "@heroui/react";
import {TimeInput} from "@heroui/react";
import { Modal } from "@heroui/react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import "../pages.css";
import { Scrollbars } from "react-custom-scrollbars-2";
import { useBabyData } from "../../../hooks/useBabyData";
import API_URL from "../../../config/api";
import Select from "../../custom-select/CustomSelect";


export default function SleepAnalytics() {
    const location = useLocation();
    const navigate = useNavigate();
    const { userData, babyData, selectedBaby, setSelectedBaby, loading: dataLoading } = useBabyData(location.state);
    const [isOpen, setIsOpen] = useState(false);
    const [hours, setHours] = useState("");
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");
    const [sleepRecords, setSleepRecords] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    const formatTime12Hour = (time24) => {
        if (!time24) return "";
        const [hours, minutes] = time24.split(":");
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

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
        setErrorMessage("");

        if (!hours || !time || !date) {
            setErrorMessage("Please fill out all fields.");
            return;
        }

        const sleepHours = parseFloat(hours);
        if (isNaN(sleepHours) || sleepHours <= 0 || sleepHours > 24) {
            setErrorMessage("Sleep duration must be a valid number between 0 and 24 hours.");
            return;
        }

        const formattedTime = `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}`;

        try {
            const { data: newRecord } = await axios.post(
                `${API_URL}/api/sleep`,
                {
                    baby_id: selectedBaby.baby_id,
                    sleep_duration: sleepHours,
                    time_fell_asleep: formattedTime,
                    date,
                },
                { withCredentials: true }
            );

            setSleepRecords((prev) => [...prev, newRecord]);

            setHours("");
            setTime("");
            setDate("");
            setErrorMessage("");
            setIsOpen(false);
        } catch (err) {
            console.error("Failed to add sleep record: ", err);
            setErrorMessage("Failed to add sleep record. Please try again.")
        }
    };

    const isBabysitter = location.state?.isBabysitter;

    const allLogCategories = [
        { value: "/growth-tracker", label: "Growth Tracker" },
        { value: "/sleep-analytics", label: "Sleep Analytics" },
        { value: "/health-journal", label: "Health Journal" },
        { value: "/feeding-notes", label: "Feeding Notes" },
        { value: "/observation-notes", label: "Observation Notes" }
    ];

    // Filter out Growth Tracker for babysitters
    const logCategories = isBabysitter
        ? allLogCategories.filter(cat => cat.value !== "/growth-tracker")
        : allLogCategories;

    const currentCategory = logCategories.find(cat => cat.value === "/sleep-analytics");

    return (
        <div className="mainDiv">
           <div className="header sleepHeader">
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
                <div className="logCategorySelect">
                    <Select
                        options={logCategories}
                        value={currentCategory}
                        onChange={(option) => {
                            if (option) {
                                navigate(option.value, { state: { baby: selectedBaby, user: userData, isBabysitter } });
                            }
                        }}
                        placeholder="Select Log"
                        isSearchable={false}
                    />
                </div>
                <div className="babySelect">
                    <Select
                        options={babyData.map(baby => ({
                            value: baby.baby_id,
                            label: baby.first_name
                        }))}
                        value={selectedBaby ? {
                            value: selectedBaby.baby_id,
                            label: selectedBaby.first_name
                        } : null}
                        onChange={(option) => {
                            if (option) {
                                const baby = babyData.find(b => b.baby_id === option.value);
                                setSelectedBaby(baby);
                            }
                        }}
                        placeholder="Select Baby"
                        isSearchable={false}
                    />
                </div>
            </div>
        </div>

        <Scrollbars className="scrollContainer" >
            <div className="scrollContent">
                {sleepRecords.length === 0 ? (
                    <h1>No sleep records yet</h1>
                ) : (
                    sleepRecords.map((record) => (
                        <Card className="cardEntry" key={record.sleep_id} shadow="sm">
                            <div className="cardEntryContent">
                                <div className="cardEntryHeader">
                                    <h3 className="cardEntryTitle">Sleep Record</h3>
                                    <span className="cardEntryDate">{new Date(record.date).toLocaleDateString()}</span>
                                </div>
                                <div className="cardEntryDetails">
                                    <div className="cardEntryDetail">
                                        <span className="cardEntryDetailLabel">Duration</span>
                                        <span className="cardEntryDetailValue">{record.sleep_duration} hrs</span>
                                    </div>
                                    <div className="cardEntryDetail">
                                        <span className="cardEntryDetailLabel">Fell Asleep</span>
                                        <span className="cardEntryDetailValue">{formatTime12Hour(record.time_fell_asleep)}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </Scrollbars>

        <Navbar />
        <Button className="addButton sleepButton" onPress={() => setIsOpen(true)}>
            Add
        </Button >

            <Modal isOpen={isOpen} onOpenChange={setIsOpen} className="modal">
                <ModalContent >
                    <ModalHeader className="modalHeader">
                        Add Sleep
                    </ModalHeader>
                    <ModalBody className="modalBody">
                        {errorMessage && (
                            <p className="errorMessage">
                                {errorMessage}
                            </p>
                        )}
                        <Input
                            variant="bordered"
                            label="Sleep Duration (hours)"
                            placeholder="Hours slept (e.g., 8.5)"
                            type="number"
                            step="0.1"
                            min="0.1"
                            max="24"
                            onKeyDown={(e) => {
                                const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End', '.'];
                                if ((e.ctrlKey || e.metaKey) || allowedKeys.includes(e.key) || /^\d$/.test(e.key)) {
                                if (e.key === '.' && e.target.value.includes('.')) e.preventDefault();
                                return;
                                }
                                e.preventDefault();
                            }}
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
