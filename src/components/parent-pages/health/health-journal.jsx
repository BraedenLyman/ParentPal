import axios from "axios";
import Navbar from "../../nav-bar/navbar";
import { Button, Card, Input, ModalBody, ModalContent, ModalFooter, ModalHeader, Tabs, Tab, RadioGroup, Radio, Image } from "@heroui/react";
import { TimeInput, Modal } from "@heroui/react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import "../parent-pages.css";
import { Scrollbars } from "react-custom-scrollbars-2";
import { useBabyData } from "../../../hooks/useBabyData";
import API_URL from "../../../config/api";
import Select from "../../custom-select/CustomSelect";

export default function HealthJournal() {
    const location = useLocation();
    const navigate = useNavigate();
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

                // Normalize meds_id in fetched records
                const normalizedData = data.map(record => ({
                    ...record,
                    meds_id: typeof record.meds_id === 'object'
                        ? record.meds_id.meds_id
                        : record.meds_id
                }));

                setMedsRecords(normalizedData);
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
            alert(`Failed to add medication: ${err.response?.data?.error || err.message}`);
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

                // Normalize allergy_id in fetched records
                const normalizedData = data.map(record => ({
                    ...record,
                    allergy_id: typeof record.allergy_id === 'object'
                        ? record.allergy_id.allergy_id
                        : record.allergy_id
                }));

                setAllergiesRecords(normalizedData);
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
            alert(`Failed to add allergy: ${err.response?.data?.error || err.message}`);
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

                // Normalize vaccine_id in fetched records
                const normalizedData = data.map(record => ({
                    ...record,
                    vaccine_id: typeof record.vaccine_id === 'object'
                        ? record.vaccine_id.vaccine_id
                        : record.vaccine_id
                }));

                setVaccinationsRecords(normalizedData);
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
            alert(`Failed to add vaccination: ${err.response?.data?.error || err.message}`);
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

    const currentCategory = logCategories.find(cat => cat.value === "/health-journal");

    return (
        <div className="mainDiv">
            <div className="header healthHeader">
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
                    <FiBell className="notification" />
                </div>
                <div className="headerTitle">
                    <h1>{selectedBaby?.first_name || "Baby"}'s Health</h1>
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

            <Tabs
                aria-label="Options"
                selectedKey={activeTab}
                onSelectionChange={setActiveTab}
                className="tabs"
            >
                <Tab key="meds" title="Medications">
                    <div style={{ width: '100%', height: 'calc(100vh - 300px)', display: 'flex', flexDirection: 'column' }}>
                        <Button className="addButton healthButton" onPress={() => setIsMedsOpen(true)}>
                            Add
                        </Button>
                        <Scrollbars className="scrollContainer" style={{ flex: 1, minHeight: 0 }}>
                            <div className="scrollContent" style={{ minHeight: '100%' }}>
                                {medsRecords.length === 0 ? (
                                    <h1>No med records yet</h1>
                                ) : (
                                    medsRecords.map((record, index) => (
                                        <Card className="cardEntry" key={record.meds_id || `med-${index}`} shadow="sm">
                                            <div className="cardEntryContent">
                                                <h2>Medication Name: {record.medication_name}</h2>
                                                <h2>Time taken at: {record.time_taken}</h2>
                                                <h2>Dosage: {record.dosage}</h2>
                                                <h2>Symptoms/Description: {record.symptoms}</h2>
                                                <h2>Date: {typeof record.date === 'string' ? record.date.slice(0, 10) : new Date(record.date).toLocaleDateString()}</h2>
                                            </div>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </Scrollbars>
                    </div>
                </Tab>

                <Tab key="allergies" title="Allergies">
                    <div style={{ width: '100%', height: 'calc(100vh - 300px)', display: 'flex', flexDirection: 'column' }}>
                        <Button className="addButton healthButton" onPress={() => setIsAllergiesOpen(true)}>
                            Add
                        </Button>
                        <Scrollbars className="scrollContainer" style={{ flex: 1, minHeight: 0 }}>
                            <div className="scrollContent" style={{ minHeight: '100%' }}>
                                {allergiesRecords.length === 0 ? (
                                    <h1>No allergy records yet</h1>
                                ) : (
                                    allergiesRecords.map((record, index) => (
                                        <Card className="cardEntry" key={record.allergy_id || `allergy-${index}`} shadow="sm">
                                            <div className="cardEntryContent">
                                                <h2>Allergy: {record.allergy_name}</h2>
                                                <h2>Severity: {record.severity}</h2>
                                                <h2>Epi Pen: {typeof record.epi_pen === 'boolean' ? (record.epi_pen ? 'Yes' : 'No') : record.epi_pen}</h2>
                                                <h2>Notes: {record.notes}</h2>
                                            </div>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </Scrollbars>
                    </div>
                </Tab>

                <Tab key="vaccinations" title="Vaccinations">
                    <div style={{ width: '100%', height: 'calc(100vh - 300px)', display: 'flex', flexDirection: 'column' }}>
                        <Button className="addButton healthButton" onPress={() => setIsVaccinationsOpen(true)}>
                            Add
                        </Button>
                        <Scrollbars className="scrollContainer" style={{ flex: 1, minHeight: 0 }}>
                            <div className="scrollContent" style={{ minHeight: '100%' }}>
                                {vaccinationsRecords.length === 0 ? (
                                    <h1>No vaccinations records yet</h1>
                                ) : (
                                    vaccinationsRecords.map((record, index) => (
                                        <Card className="cardEntry" key={record.vaccine_id || `vaccine-${index}`} shadow="sm">
                                            <div className="cardEntryContent">
                                                <h2>Vaccine: {record.vaccination_name}</h2>
                                                <h2>Date of Vaccine: {typeof record.date_of_vaccine === 'string' ? record.date_of_vaccine.slice(0, 10) : new Date(record.date_of_vaccine).toLocaleDateString()}</h2>
                                            </div>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </Scrollbars>
                    </div>
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

                            <div className="custom-select-wrapper">
                                <label className="custom-select-label">Severity</label>
                                <select
                                    className="custom-select"
                                    value={severity}
                                    onChange={(e) => setSeverity(e.target.value)}
                                >
                                    <option value="">Select severity</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>

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
