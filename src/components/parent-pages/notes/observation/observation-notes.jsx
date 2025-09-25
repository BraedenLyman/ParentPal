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


export default function ObservationNoes() {
    const [isOpen, setIsOpen] = useState(false);
    const [priorityLevel, setPriorityLevel] = useState("");
    const [obsNotes, setObsNotes] = useState("");

    const [babyId, setBabyId ] = useState(null);
    const [observationRecords, setObservationRecords] = useState([]);

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

        const fetchObservationRecords = async () => {
            try {
                const { data } = await axios.get(`http://localhost:3000/api/observation`, {
                    params: { baby_id: babyId },
                    withCredentials: true,
                });
                setObservationRecords(data);
            } catch (err) {
                console.error("Failed to fetch observation records: ", err)
            }
        };

        fetchObservationRecords();
    }, [babyId]);

    const handleAddObservation = async () => {
        if (!priorityLevel || !obsNotes) {
            alert("Please fill out all fields.");
            return;
        }

        try {
            const { data: newRecord } = await axios.post(
                "http://localhost:3000/api/observation",
                {
                    baby_id: babyId,
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
                        name={"P"}
                    />
                    <Avatar 
                        className="mainAvatar"
                        name={"B"}
                    />
                    <FiBell className="notification"/>
                </div>
                <div className="userInfo">
                    <h1 className="babysName">Baby's Observation</h1>

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
                            placeholder="Describe what you noitce"
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
