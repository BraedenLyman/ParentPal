import axios from "axios";
import Navbar from "../../nav-bar/navbar";
import { Button, Card, Input, ModalBody, ModalContent, ModalFooter, ModalHeader, Image } from "@heroui/react";
import { Modal } from "@heroui/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import "../parent-pages.css";
import { auth } from "../../../firebase/firebaseAuth";
import { Scrollbars } from "react-custom-scrollbars-2";
import API_URL from "../../../config/api";
import Select from "../../custom-select/CustomSelect";


export default function GrowthTracker() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [date, setDate] = useState("");
    const [userData, setUserData] = useState(null);
    const [babyData, setBabyData] = useState([]);
    const [selectedBaby, setSelectedBaby] = useState(null);
    const [growthRecords, setGrowthRecords] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const currentUser = auth.currentUser;

            if (!currentUser) return;

            try {
                const idToken = await currentUser.getIdToken();
                const response = await axios.post(
                    `${API_URL}/api/sign-in`,
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
                console.error("Error fetching dashboard data:", error);
            }
        };

        fetchDashboardData();
    }, [location.state]);

    useEffect(() => {
        if (!selectedBaby) return;

        const fetchGrowthRecords = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/growth`, {
                    params: { baby_id: selectedBaby.baby_id },
                    withCredentials: true,
                });
                setGrowthRecords(data);
            } catch (err) {
                console.error("Failed to fetch growth records: ", err)
            }
        };

        fetchGrowthRecords();
    }, [selectedBaby]);

    const handleAddGrowth = async () => {
        if (!height || !weight || !date) {
            alert("Please fill out all fields.");
            return;
        }

        try {
            const { data: newRecord } = await axios.post(
                `${API_URL}/api/growth`,
                {
                    baby_id: selectedBaby.baby_id,
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

    const isBabysitter = location.state?.isBabysitter;

    const logCategories = [
        { value: "/growth-tracker", label: "Growth Tracker" },
        { value: "/sleep-analytics", label: "Sleep Analytics" },
        { value: "/health-journal", label: "Health Journal" },
        { value: "/feeding-notes", label: "Feeding Notes" },
        { value: "/observation-notes", label: "Observation Notes" }
    ];

    const currentCategory = logCategories.find(cat => cat.value === "/growth-tracker");

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
                    <h1>{selectedBaby?.first_name || "Baby"}'s Growth</h1>
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
                    {growthRecords.length === 0 ? (
                        <h1>No growth records yet</h1>
                    ) : (
                        growthRecords.map((record) => (
                            <Card className="cardEntry" key={record.growth_id} shadow="sm">
                                <div className="cardEntryContent">
                                    <div className="cardEntryHeader">
                                        <h3 className="cardEntryTitle">Growth Record</h3>
                                        <span className="cardEntryDate">{new Date(record.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="cardEntryDetails">
                                        <div className="cardEntryDetail">
                                            <span className="cardEntryDetailLabel">Height</span>
                                            <span className="cardEntryDetailValue">{record.height}</span>
                                        </div>
                                        <div className="cardEntryDetail">
                                            <span className="cardEntryDetailLabel">Weight</span>
                                            <span className="cardEntryDetailValue">{record.weight}</span>
                                        </div>
                                    </div>
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
