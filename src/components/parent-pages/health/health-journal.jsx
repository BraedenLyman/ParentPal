import React from "react";
import axios from "axios";
import PageMiddleNav from "../../page-components/page-middle-nav/page-middle-nav";
import Navbar from "../../nav-bar/navbar";
import { Avatar, Button, Card, Input, ModalBody, ModalContent, ModalFooter, ModalHeader, Tabs, Tab, RadioGroup, Radio, Select, SelectItem } from "@heroui/react";
import { TimeInput, Modal } from "@heroui/react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import "../parent-pages.css";
import { Scrollbars } from "react-custom-scrollbars-2";
import { useBabyData } from "../../../hooks/useBabyData";
import API_URL from "../../../config/api";

export default function HealthJournal() {
    const location = useLocation();
    const { userData, babyData, selectedBaby, setSelectedBaby } = useBabyData(location.state);

    const [activeTab, setActiveTab] = useState("meds");
    const [isMedsOpen, setIsMedsOpen] = useState(false);
    const [isAllergiesOpen, setIsAllergiesOpen] = useState(false);
    const [isVaccinationsOpen, setIsVaccinationsOpen] = useState(false);

    const [medName, setMedName] = useState("");
    const [medsTimeTaken, setMedsTimeTaken] = useState("");
    const [medDate, setMedDate] = useState("");
    const [medDose, setMedDose] = useState("");
    const [medSympDescription, setMedSympDescription] = useState("");
    const [medsRecords, setMedsRecords] = useState([]);

    const [allergy, setAllergy] = useState("");
    const [severity, setSeverity] = useState("");
    const [allergyNotes, setAllergyNotes] = useState("");
    const [epiPen, setEpiPen] = useState("");
    const [allergiesRecords, setAllergiesRecords] = useState([])

    const [vaccineName, setVaccineName] = useState("");
    const [vaccineDate, setVaccineDate] = useState("");
    const [vaccinationsRecords, setVaccinationsRecords] = useState([]);

    useEffect(() => {
        if (!selectedBaby) return;

        const fetchMedsRecords = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/meds`, {
                    params: { baby_id: selectedBaby.baby_id },
                    withCredentials: true,
                });
                setMedsRecords(data);
            } catch (err) {
                console.error("Failed to fetch meds records: ", err)
            }
        };

        fetchMedsRecords();
    }, [selectedBaby]);
    
    const handleAddMeds = async () => {
        if (!medName || !medsTimeTaken || !medDate || !medDose || !medSympDescription) {
            alert("Please fill out all fields.");
            return;
        }

        const formattedTime = `${String(medsTimeTaken.hour).padStart(2, "0")}:${String(medsTimeTaken.minute).padStart(2, "0")}`;

        try {
            const { data: newRecord } = await axios.post(
                `${API_URL}/api/meds`,
                {
                    baby_id: selectedBaby.baby_id,
                    medication_name: medName,
                    time_taken: formattedTime,
                    date: medDate,
                    dosage: medDose,
                    symptoms: medSympDescription,
                },
                { withCredentials: true }
            );

            setMedsRecords((prev) => [...prev, newRecord]);

            setMedName("");
            setMedsTimeTaken("");
            setMedDate("");
            setMedDose("");
            setMedSympDescription("");
            setIsMedsOpen(false);
        } catch (err) {
            console.error("Failed to add meds record: ", err);
        }
    };

    useEffect(() => {
        if (!selectedBaby) return;

        const fetchAllergiesRecords = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/allergies`, {
                    params: { baby_id: selectedBaby.baby_id },
                    withCredentials: true,
                });
                setAllergiesRecords(data);
            } catch (err) {
                console.error("Failed to fetch allergies records: ", err)
            }
        };

        fetchAllergiesRecords();
    }, [selectedBaby]);

    const handleAddAllergies = async () => {
        if (!allergy || !severity || !epiPen || !allergyNotes) {
            alert("Please fill out all fields.");
            return;
        }

        try {
            const { data: newRecord } = await axios.post(
                `${API_URL}/api/allergies`,
                {
                    baby_id: selectedBaby.baby_id,
                    allergy_name: allergy,
                    severity: severity,
                    epi_pen: epiPen,
                    notes: allergyNotes,
                },
                { withCredentials: true }
            );

            setAllergiesRecords((prev) => [...prev, newRecord]);

            setAllergy("");
            setSeverity("");
            setEpiPen("");
            setAllergyNotes("");
            setIsAllergiesOpen(false);
        } catch (err) {
            console.error("Failed to add allergy record: ", err);
        }
    };

    useEffect(() => {
        if (!selectedBaby) return;

        const fetchVaccinationsRecords = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/vaccinations`, {
                    params: { baby_id: selectedBaby.baby_id },
                    withCredentials: true,
                });
                setVaccinationsRecords(data);
            } catch (err) {
                console.error("Failed to fetch vaccinations records: ", err)
            }
        };

        fetchVaccinationsRecords();
    }, [selectedBaby]);

    const handleAddVaccinations = async () => {
        if (!vaccineName || !vaccineDate) {
            alert("Please fill out all fields.");
            return;
        }

        try {
            const { data: newRecord } = await axios.post(
                `${API_URL}/api/vaccinations`,
                {
                    baby_id: selectedBaby.baby_id,
                    vaccination_name: vaccineName,
                    date_of_vaccine: vaccineDate,
                },
                { withCredentials: true }
            );

            setVaccinationsRecords((prev) => [...prev, newRecord]);

            setVaccineName("");
            setVaccineDate("");
            setIsVaccinationsOpen(false);
        } catch (err) {
            console.error("Failed to add vaccinations record: ", err);
        }
    };

    return (
        <div className="mainDiv">
            {/* Header */}
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
                    <FiBell className="notification" />
                </div>

                <div className="userInfo">
                    <h1 className="babysName">{selectedBaby?.first_name || "Baby"}'s Health</h1>
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

            <PageMiddleNav />

            <Tabs
                aria-label="Options"
                selectedKey={activeTab}
                onSelectionChange={setActiveTab}
                className="tabs"
            >
                <Tab key="meds" title="Meds">
                    <Button className="addButton" onPress={() => setIsMedsOpen(true)}>
                        Add
                    </Button>
                    <Scrollbars className="scrollContainer" >
                        <div className="scrollContent">
                            {medsRecords.length === 0 ? (
                                <h1>No med records yet</h1>
                            ) : (
                                medsRecords.map((record) => (
                                    <Card className="cardEntry" key={record.meds_id}>
                                        <div className="cardEntryContent">
                                            <h2>Medication Name: {record.medication_name}</h2>
                                            <h2>Time taken at: {record.time_taken}</h2>
                                            <h2>Dosage: {record.dosage}</h2>
                                            <h2>Symptoms/Description: {record.symptoms}</h2>
                                            <h2>Date: {record.date.slice(0, 10)}</h2>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>
                    </Scrollbars>
                </Tab>

                <Tab key="allergies" title="Allergies">
                    <Button className="addButton" onPress={() => setIsAllergiesOpen(true)}>
                        Add
                    </Button>
                    <Scrollbars className="scrollContainer" >
                        <div className="scrollContent">
                            {allergiesRecords.length === 0 ? (
                                <h1>No allergy records yet</h1>
                            ) : (
                                allergiesRecords.map((record) => (
                                    <Card className="cardEntry" key={record.allergy_id}>
                                        <div className="cardEntryContent">
                                            <h2>Allergy: {record.allergy_name}</h2>
                                            <h2>Severity: {record.severity}</h2>
                                            <h2>Epi Pen: {record.epi_pen}</h2>
                                            <h2>Notes: {record.notes}</h2>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>
                    </Scrollbars>
                </Tab>

                <Tab key="vaccinations" title="Vaccinations">
                    <Button className="addButton" onPress={() => setIsVaccinationsOpen(true)}>
                        Add
                    </Button>
                    <Scrollbars className="scrollContainer" >
                        <div className="scrollContent">
                            {vaccinationsRecords.length === 0 ? (
                                <h1>No vaccinations records yet</h1>
                            ) : (
                                vaccinationsRecords.map((record) => (
                                    <Card className="cardEntry" key={record.vaccine_id}>
                                        <div className="cardEntryContent">
                                            <h2>Vaccine: {record.vaccination_name}</h2>
                                            <h2>Date of Vaccine: {record.date_of_vaccine.slice(0, 10)}</h2>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>
                    </Scrollbars>
                </Tab>
            </Tabs>

            <Navbar />

            <Modal isOpen={isMedsOpen} onOpenChange={setIsMedsOpen} className="modal">
            <ModalContent>
                <ModalHeader>Add Medication</ModalHeader>
                    <ModalBody>
                        <Input
                            variant="bordered"
                            label="Medication Name"
                            placeholder="Enter medication name"
                            value={medName}
                            onChange={(e) => setMedName(e.target.value)}
                        />
                        <TimeInput
                            variant="bordered"
                            label="Time take at"
                            value={medsTimeTaken}
                            onChange={(newTime) => setMedsTimeTaken(newTime)}
                        />
                        <Input
                            variant="bordered"
                            label="Date"
                            placeholder="Date"
                            type="date"
                            value={medDate}
                            onChange={(e) => setMedDate(e.target.value)}
                        />
                        <Input
                            variant="bordered"
                            label="Amount"
                            placeholder="Amount of meds taken"
                            type="number"
                            value={medDose}
                            onChange={(e) => setMedDose(e.target.value)}
                        />
                        <Input
                            variant="bordered"
                            label="Sicness/Symptoms"
                            placeholder="Describe how they are feeling"
                            type="text"
                            value={medSympDescription}
                            onChange={(e) => setMedSympDescription(e.target.value)}
                        />
                    </ModalBody>
                <ModalFooter>
                    <Button onPress={() => setIsMedsOpen(false)}>Cancel</Button>
                    <Button onPress={handleAddMeds}>
                        Add
                    </Button>
                </ModalFooter>
            </ModalContent>
            </Modal>

            <Modal isOpen={isAllergiesOpen} onOpenChange={setIsAllergiesOpen} className="modal" >
                <ModalContent>
                    <ModalHeader>Add Allergy</ModalHeader>
                        <ModalBody>
                            <Input
                                variant="bordered"
                                label="Allergy Name"
                                placeholder="What are they allergic to"
                                value={allergy}
                                onChange={(e) => setAllergy(e.target.value)}
                            />

                            <Select
                                variant="bordered"
                                label="Severity"
                                placeholder="Select severity"
                                selectedKeys={severity ? [severity] : []}
                                onSelectionChange={(keys) => setSeverity([...keys][0])}
                            >
                                <SelectItem key="low">Low</SelectItem>
                                <SelectItem key="medium">Medium</SelectItem>
                                <SelectItem key="high">High</SelectItem>
                            </Select>

                            <RadioGroup
                                label="EpiPen"
                                value={epiPen}
                                onValueChange={(val) => setEpiPen(val)}
                            >
                                <Radio value="yes">Yes</Radio>
                                <Radio value="no">No</Radio>
                            </RadioGroup>

                            <Input
                                variant="bordered"
                                label="Notes"
                                placeholder="Add any other important info"
                                value={allergyNotes}
                                onChange={(e) => setAllergyNotes(e.target.value)}
                            />
                        </ModalBody>
                    <ModalFooter>
                        <Button onPress={() => setIsAllergiesOpen(false)}>Cancel</Button>
                        <Button onPress={handleAddAllergies}>
                            Add
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal
                isOpen={isVaccinationsOpen}
                onOpenChange={setIsVaccinationsOpen}
                className="modal"
            >
                <ModalContent>
                    <ModalHeader>Add Vaccination</ModalHeader>
                        <ModalBody>
                            <Input
                                variant="bordered"
                                label="Vaccine Name"
                                placeholder="Vaccination they have"
                                value={vaccineName}
                                onChange={(e) => setVaccineName(e.target.value)}
                            />
                            <Input
                                variant="bordered"
                                type="date"
                                label="Date of Vaccine"
                                value={vaccineDate}
                                onChange={(e) => setVaccineDate(e.target.value)}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button onPress={() => setIsVaccinationsOpen(false)}>Cancel</Button>
                            <Button onPress={handleAddVaccinations}>
                                Add
                            </Button>
                        </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
