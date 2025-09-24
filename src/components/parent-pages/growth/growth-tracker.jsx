import axios from "axios";
import PageMiddleNav from "../../page-components/page-middle-nav/page-middle-nav";
import Navbar from "../../nav-bar/navbar";
import { Avatar, Button, Card, Input, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { Modal } from "@heroui/react";
import { useEffect, useState } from "react";
import { FiBell } from "react-icons/fi";
import "../parent-pages.css";
import { auth } from "../../../firebase/firebaseAuth";
import { Scrollbars } from "react-custom-scrollbars-2";


export default function GrowthTracker() {
    const [isOpen, setIsOpen] = useState(false);
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [date, setDate] = useState("");
    const [babyId, setBabyId ] = useState(null);
    const [growthRecords, setGrowthRecords] = useState([]);

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

        const fetchGrowthRecords = async () => {
            try {
                const { data } = await axios.get(`http://localhost:3000/api/growth`, {
                    params: { baby_id: babyId },
                    withCredentials: true,
                });
                setGrowthRecords(data);
            } catch (err) {
                console.error("Failed to fetch growth records: ", err)
            }
        };

        fetchGrowthRecords();
    }, [babyId]);

    const handleAddGrowth = async () => {
        if (!height || !weight || !date) {
            alert("Please fill out all fields.");
            return;
        }

        try {
            const { data: newRecord } = await axios.post(
                "http://localhost:3000/api/growth",
                {
                    baby_id: babyId,
                    height: parseFloat(height),
                    weight: parseFloat(weight),
                    date,
                },
                { withCredentials: true }
            );

            setGrowthRecords((prev) => [...prev, newRecord]);

            setHeight("");
            setWeight("");
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
                    <h1 className="babysName">Baby's Growth</h1>

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
                    {growthRecords.length === 0 ? (
                        <h1>No growth records yet</h1>
                    ) : (
                        growthRecords.map((record) => (
                            <Card className="cardEntry" key={record.growth_id}>
                                <div className="cardEntryContent">
                                    <h2>Height: {record.height}</h2>
                                    <h2>Weight: {record.weight}</h2>
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
                        Add Growth
                    </ModalHeader>
                    <ModalBody className="modalBody">
                        <Input 
                            variant="bordered"
                            label="Height" 
                            placeholder="How tall are they" 
                            type="text"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                        />

                        <Input 
                            variant="bordered"
                            label="Weight" 
                            placeholder="How much do they weigh" 
                            type="text"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
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

                        <Button onPress={handleAddGrowth}>
                            Add
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
