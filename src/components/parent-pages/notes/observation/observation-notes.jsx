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
import { Scrollbars } from "react-custom-scrollbars-2";
import { useBabyData } from "../../../../hooks/useBabyData";
import API_URL from "../../../../config/api";


export default function ObservationNotes() {
    const location = useLocation();
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
                    <h1 className="babysName">{selectedBaby?.first_name || "Baby"}'s Observation</h1>

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
                    {observationRecords.length === 0 ? (
                        <h1>No observation records yet</h1>
                    ) : (
                        observationRecords.map((record) => (
                            <Card className="cardEntry" key={record.observation_id}>
                                <div className="cardEntryContent">
                                    <h2>Priority Level: {record.priority_level}</h2>
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
                        Add Observation
                    </ModalHeader>
                    <ModalBody className="modalBody">
                        
                        <Select
                            variant="bordered"
                            label="Priority Level"
                            selectedKeys={priorityLevel ? [priorityLevel] : []}
                            onSelectionChange={(keys) => setPriorityLevel([...keys][0])}
                        >
                            <SelectItem key="low">Low</SelectItem>
                            <SelectItem key="medium">Medium</SelectItem>
                            <SelectItem key="high">High</SelectItem>
                        </Select>

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
