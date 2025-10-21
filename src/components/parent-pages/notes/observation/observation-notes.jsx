import React from "react";
import axios from "axios";
import Navbar from "../../../nav-bar/navbar";
import { Button, Card, Input, ModalBody, ModalContent, ModalFooter, ModalHeader, Image } from "@heroui/react";
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


export default function ObservationNotes() {
    const location = useLocation();
    const navigate = useNavigate();
    const { userData, babyData, selectedBaby, setSelectedBaby } = useBabyData(location.state);
    const [isOpen, setIsOpen] = useState(false);
    const [priorityLevel, setPriorityLevel] = useState("");
    const [obsNotes, setObsNotes] = useState("");
    const [observationRecords, setObservationRecords] = useState([]);

    useEffect(() => {
        if (!selectedBaby) return;

        const fetchObservationRecords = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/observation`, {
                    params: { baby_id: selectedBaby.baby_id },
                    withCredentials: true,
                });
                setObservationRecords(data);
            } catch (err) {
                console.error("Failed to fetch observation records: ", err)
            }
        };

        fetchObservationRecords();
    }, [selectedBaby]);

    const handleAddObservation = async () => {
        if (!priorityLevel || !obsNotes) {
            alert("Please fill out all fields.");
            return;
        }

        try {
            const { data: newRecord } = await axios.post(
                `${API_URL}/api/observation`,
                {
                    baby_id: selectedBaby.baby_id,
                    priority_level: priorityLevel,
                    notes: obsNotes,
                },
                { withCredentials: true }
            );

            setObservationRecords((prev) => [...prev, newRecord]);

            setPriorityLevel("");
            setObsNotes("");
            setIsOpen(false);
        } catch (err) {
            console.error("Failed to add observation record: ", err);
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

    const currentCategory = logCategories.find(cat => cat.value === "/observation-notes");

    return (
        <div className="mainDiv">
            <div className="header observationHeader">
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
                    <h1>{selectedBaby?.first_name || "Baby"}'s Observation</h1>
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
                    {observationRecords.length === 0 ? (
                        <h1>No observation records yet</h1>
                    ) : (
                        observationRecords.map((record) => (
                            <Card className="cardEntry" key={record.observation_id} shadow="sm">
                                <div className="cardEntryContent">
                                    <div className="cardEntryHeader">
                                        <h3 className="cardEntryTitle">Observation</h3>
                                        <span className="cardEntryDate" style={{
                                            backgroundColor: record.priority_level === 'high' ? '#fee' : record.priority_level === 'medium' ? '#ffeaa7' : '#d1f2eb',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            textTransform: 'capitalize',
                                            fontWeight: '600'
                                        }}>{record.priority_level}</span>
                                    </div>
                                    <div style={{ marginTop: '8px' }}>
                                        <p style={{ fontSize: '14px', margin: '0', color: '#333', lineHeight: '1.5' }}>{record.notes}</p>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </Scrollbars>
          
            <Navbar />
            <Button className="addButton observationButton" onPress={() => setIsOpen(true)}>
                Add
            </Button >

            <Modal isOpen={isOpen} onOpenChange={setIsOpen} className="modal">
                <ModalContent >
                    <ModalHeader className="modalHeader">
                        Add Observation
                    </ModalHeader>
                    <ModalBody className="modalBody">
                        
                        <div className="form-field">
                            <label className="form-label">Priority Level</label>
                            <Select
                                options={[
                                    { value: "low", label: "Low" },
                                    { value: "medium", label: "Medium" },
                                    { value: "high", label: "High" }
                                ]}
                                value={priorityLevel ? { value: priorityLevel, label: priorityLevel.charAt(0).toUpperCase() + priorityLevel.slice(1) } : null}
                                onChange={(option) => setPriorityLevel(option ? option.value : "")}
                                placeholder="Select priority level"
                            />
                        </div>

                        <Input
                            variant="bordered"
                            label="Notes"
                            placeholder="Describe what you notice"
                            value={obsNotes}
                            onChange={(e) => setObsNotes(e.target.value)}
                        />
                        
                    </ModalBody>
                    <ModalFooter className="modalFooter">
                        <Button onPress={() => setIsOpen(false)}>
                            Cancel
                        </Button>

                        <Button onPress={handleAddObservation}>
                            Add
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
