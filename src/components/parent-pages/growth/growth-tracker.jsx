import axios from "axios";
import PageMiddleNav from "../../page-components/page-middle-nav/page-middle-nav";
import Navbar from "../../nav-bar/navbar";
import { Avatar, Button, Card, Input, ModalBody, ModalContent, ModalFooter, ModalHeader, Image } from "@heroui/react";
import { Modal } from "@heroui/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import "../parent-pages.css";
import { auth } from "../../../firebase/firebaseAuth";
import { Scrollbars } from "react-custom-scrollbars-2";
import API_URL from "../../../config/api";


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
