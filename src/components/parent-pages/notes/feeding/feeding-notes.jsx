import axios from "axios";
import Navbar from "../../../nav-bar/navbar";
import { Button, Card, Input, ModalBody, ModalContent, ModalFooter, ModalHeader, TimeInput, Image } from "@heroui/react";
import { Modal } from "@heroui/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import "../../parent-pages.css";
import { Scrollbars } from "react-custom-scrollbars-2";
import { useBabyData } from "../../../../hooks/useBabyData";
import API_URL from "../../../../config/api";
import Select from "../../../custom-select/CustomSelect";


export default function FeedingNotes() {
    const location = useLocation();
    const navigate = useNavigate();
    const { userData, babyData, selectedBaby, setSelectedBaby } = useBabyData(location.state);
    const [isOpen, setIsOpen] = useState(false);
    const [feedTime, setFeedTime] = useState("");
    const [feedDate, setFeedDate] = useState("");
    const [fedFrom, setFedFrom] = useState("");
    const [feedType, setFeedType] = useState("");
    const [feedAmount, setFeedAmount] = useState("");
    const [feedNotes, setFeedNotes] = useState("");
    const [feedingRecords, setFeedingRecords] = useState([]);

    useEffect(() => {
        if (!selectedBaby) return;

        const fetchFeedingRecords = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/feeding`, {
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
                `${API_URL}/api/feeding`,
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

    const isBabysitter = location.state?.isBabysitter;

    const logCategories = [
        { value: "/growth-tracker", label: "Growth Tracker" },
        { value: "/sleep-analytics", label: "Sleep Analytics" },
        { value: "/health-journal", label: "Health Journal" },
        { value: "/feeding-notes", label: "Feeding Notes" },
        { value: "/observation-notes", label: "Observation Notes" }
    ];

    const currentCategory = logCategories.find(cat => cat.value === "/feeding-notes");

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
                    <h1>{selectedBaby?.first_name || "Baby"}'s Feeding</h1>
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
                    {feedingRecords.length === 0 ? (
                        <h1>No feeding records yet</h1>
                    ) : (
                        feedingRecords.map((record) => (
                            <Card className="cardEntry" key={record.feeding_id} shadow="sm">
                                <div className="cardEntryContent">
                                    <div className="cardEntryHeader">
                                        <h3 className="cardEntryTitle">{record.type_of_food}</h3>
                                        <span className="cardEntryDate">{new Date(record.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="cardEntryDetails">
                                        <div className="cardEntryDetail">
                                            <span className="cardEntryDetailLabel">Time Fed</span>
                                            <span className="cardEntryDetailValue">{record.time_fed}</span>
                                        </div>
                                        <div className="cardEntryDetail">
                                            <span className="cardEntryDetailLabel">Fed From</span>
                                            <span className="cardEntryDetailValue">{record.fed_from}</span>
                                        </div>
                                        <div className="cardEntryDetail">
                                            <span className="cardEntryDetailLabel">Amount</span>
                                            <span className="cardEntryDetailValue">{record.amount}</span>
                                        </div>
                                    </div>
                                    {record.notes && (
                                        <div style={{ marginTop: '8px' }}>
                                            <span className="cardEntryDetailLabel">Notes</span>
                                            <p style={{ fontSize: '13px', margin: '4px 0 0 0', color: '#555' }}>{record.notes}</p>
                                        </div>
                                    )}
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

                        <div className="form-field">
                            <label className="form-label">Fed From</label>
                            <Select
                                options={[
                                    { value: "bottle", label: "Bottle" },
                                    { value: "left-boob", label: "Left Boob" },
                                    { value: "right-boob", label: "Right Boob" }
                                ]}
                                value={fedFrom ? { value: fedFrom, label: fedFrom.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') } : null}
                                onChange={(option) => setFedFrom(option ? option.value : "")}
                                placeholder="Select where the baby was fed from"
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">Type of Food</label>
                            <Select
                                options={[
                                    { value: "milk", label: "Milk" },
                                    { value: "water", label: "Water" },
                                    { value: "juice", label: "Juice" }
                                ]}
                                value={feedType ? { value: feedType, label: feedType.charAt(0).toUpperCase() + feedType.slice(1) } : null}
                                onChange={(option) => setFeedType(option ? option.value : "")}
                                placeholder="Select what type of food they had"
                            />
                        </div>

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
