import React from "react";
import axios from "axios";
import Navbar from "../nav-bar/navbar";
import { Button, Card, Input, ModalBody, ModalContent, ModalFooter, ModalHeader, Tabs, Tab, RadioGroup, Radio, Image } from "@heroui/react";
import { TimeInput, Modal } from "@heroui/react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import { FiFilter } from "react-icons/fi";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import "../pages.css";
import { Scrollbars } from "react-custom-scrollbars-2";
import { useBabyData } from "../../../hooks/useBabyData";
import API_URL from "../../../config/api";
import Select from "../../custom-select/CustomSelect";

export default function HealthJournal() {
    const location = useLocation();
    const navigate = useNavigate();
    const { userData, babyData, selectedBaby, setSelectedBaby } = useBabyData(location.state);

    const [activeTab, setActiveTab] = useState("meds");

    const formatTime12Hour = (time24) => {
        if (!time24) return "";
        const [hours, minutes] = time24.split(":");
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    const [isMedsOpen, setIsMedsOpen] = useState(false);
    const [isAllergiesOpen, setIsAllergiesOpen] = useState(false);
    const [isVaccinationsOpen, setIsVaccinationsOpen] = useState(false);
    const [isSickDayOpen, setIsSickDayOpen] = useState(false);

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

    const [sickDate, setSickDate] = useState("");
    const [medsTaken, setMedsTaken] = useState("");
    const [sickTemp, setSickTemp] = useState("");
    const [sickDayRecords, setSickRecords] = useState([]);

    const [medsFilter, setMedsFilter] = useState("date-desc");
    const [allergiesFilter, setAllergiesFilter] = useState("name-asc");
    const [vaccinationsFilter, setVaccinationsFilter] = useState("date-desc");
    const [sickDayFilter, setSickDayFilter] = useState("date-desc");

    const [isMedsFilterOpen, setIsMedsFilterOpen] = useState(false);
    const [isAllergiesFilterOpen, setIsAllergiesFilterOpen] = useState(false);
    const [isVaccinationsFilterOpen, setIsVaccinationsFilterOpen] = useState(false);
    const [isSickDayFilterOpen, setIsSickDayFilterOpen] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.filter-dropdown-container')) {
                setIsMedsFilterOpen(false);
                setIsAllergiesFilterOpen(false);
                setIsVaccinationsFilterOpen(false);
                setIsSickDayFilterOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (!selectedBaby) return;

        const fetchMedsRecords = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/meds`, {
                    params: { baby_id: selectedBaby.baby_id },
                    withCredentials: true,
                });

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
        setErrorMessage("");

        console.log("handleAddMeds called");
        console.log("Form values:", { medName, medsTimeTaken, medDate, medDose, medSympDescription, selectedBaby });

        if (!medName || !medsTimeTaken || !medDate || !medDose || !medSympDescription) {
            setErrorMessage("Please fill out all fields.");
            return;
        }

        if (!selectedBaby || !selectedBaby.baby_id) {
            setErrorMessage("No baby selected. Please select a baby first.");
            return;
        }

        const dosageFlOz = parseFloat(medDose);
        if (isNaN(dosageFlOz) || dosageFlOz <= 0) {
            setErrorMessage("Medication amount must be a valid number greater than 0 (in fluid ounces).");
            return;
        }

        const formattedTime = `${String(medsTimeTaken.hour).padStart(2, "0")}:${String(medsTimeTaken.minute).padStart(2, "0")}`;

        try {
            console.log("Sending medication data to API...");
            const { data: newRecord } = await axios.post(
                `${API_URL}/api/meds`,
                {
                    baby_id: selectedBaby.baby_id,
                    medication_name: medName,
                    time_taken: formattedTime,
                    date: medDate,
                    dosage: dosageFlOz,
                    symptoms: medSympDescription,
                },
                { withCredentials: true }
            );

            console.log("Medication record added successfully:", newRecord);

            const normalizedRecord = {
                ...newRecord,
                meds_id: typeof newRecord.meds_id === 'object'
                    ? newRecord.meds_id.meds_id
                    : newRecord.meds_id
            };

            setMedsRecords((prev) => [...prev, normalizedRecord]);

            setMedName("");
            setMedsTimeTaken("");
            setMedDate("");
            setMedDose("");
            setMedSympDescription("");
            setErrorMessage("");
            setIsMedsOpen(false);
        } catch (err) {
            console.error("Failed to add meds record: ", err);
            console.error("Error response:", err.response?.data);
            setErrorMessage(`Failed to add medication: ${err.response?.data?.error || err.message}`);
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
        setErrorMessage("");

        console.log("handleAddAllergies called");
        console.log("Form values:", { allergy, severity, epiPen, allergyNotes, selectedBaby });

        if (!allergy || !severity || !epiPen || !allergyNotes) {
            setErrorMessage("Please fill out all fields.");
            return;
        }

        if (!selectedBaby || !selectedBaby.baby_id) {
            setErrorMessage("No baby selected. Please select a baby first.");
            return;
        }

        try {
            console.log("Sending allergy data to API...");
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

            console.log("Allergy record added successfully:", newRecord);

            const normalizedRecord = {
                ...newRecord,
                allergy_id: typeof newRecord.allergy_id === 'object'
                    ? newRecord.allergy_id.allergy_id
                    : newRecord.allergy_id
            };

            setAllergiesRecords((prev) => [...prev, normalizedRecord]);

            setAllergy("");
            setSeverity("");
            setEpiPen("");
            setAllergyNotes("");
            setErrorMessage("");
            setIsAllergiesOpen(false);
        } catch (err) {
            console.error("Failed to add allergy record: ", err);
            console.error("Error response:", err.response?.data);
            setErrorMessage(`Failed to add allergy: ${err.response?.data?.error || err.message}`);
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
        setErrorMessage("");

        console.log("handleAddVaccinations called");
        console.log("Form values:", { vaccineName, vaccineDate, selectedBaby });

        if (!vaccineName || !vaccineDate) {
            setErrorMessage("Please fill out all fields.");
            return;
        }

        if (!selectedBaby || !selectedBaby.baby_id) {
            setErrorMessage("No baby selected. Please select a baby first.");
            return;
        }

        try {
            console.log("Sending vaccination data to API...");
            const { data: newRecord } = await axios.post(
                `${API_URL}/api/vaccinations`,
                {
                    baby_id: selectedBaby.baby_id,
                    vaccination_name: vaccineName,
                    date_of_vaccine: vaccineDate,
                },
                { withCredentials: true }
            );

            console.log("Vaccination record added successfully:", newRecord);

            const normalizedRecord = {
                ...newRecord,
                vaccine_id: typeof newRecord.vaccine_id === 'object'
                    ? newRecord.vaccine_id.vaccine_id
                    : newRecord.vaccine_id
            };

            setVaccinationsRecords((prev) => [...prev, normalizedRecord]);

            setVaccineName("");
            setVaccineDate("");
            setErrorMessage("");
            setIsVaccinationsOpen(false);
        } catch (err) {
            console.error("Failed to add vaccinations record: ", err);
            console.error("Error response:", err.response?.data);
            setErrorMessage(`Failed to add vaccination: ${err.response?.data?.error || err.message}`);
        }
    };

    useEffect(() => {
        if (!selectedBaby) return;

        const fetchSickDayRecords = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/sickday`, {
                    params: { baby_id: selectedBaby.baby_id },
                    withCredentials: true,
                });

                const normalizedData = data.map(record => ({
                    ...record,
                    sick_id: typeof record.sick_id === 'object'
                        ? record.sick_id.sick_id
                        : record.sick_id
                }));

                setSickRecords(normalizedData);
            } catch (err) {
                console.error("Failed to fetch sick day records: ", err)
            }
        };

        fetchSickDayRecords();
    }, [selectedBaby]);

    const handleAddSickDay = async () => {
        setErrorMessage("");

        console.log("handleAddSickDay called");
        console.log("Form values:", { sickDate, medsTaken, sickTemp, selectedBaby });

        if (!sickDate) {
            setErrorMessage("Please fill out the date field.");
            return;
        }

        if (!selectedBaby || !selectedBaby.baby_id) {
            setErrorMessage("No baby selected. Please select a baby first.");
            return;
        }

        if (sickTemp) {
            const temp = parseFloat(sickTemp);
            if (isNaN(temp)) {
                setErrorMessage("Temperature must be a valid number.");
                return;
            }
            if (temp < 90 || temp > 110) {
                setErrorMessage("Please enter a valid temperature (90°F - 110°F).");
                return;
            }
        }

        try {
            console.log("Sending sick day data to API...");
            const { data: newRecord } = await axios.post(
                `${API_URL}/api/sickday`,
                {
                    baby_id: selectedBaby.baby_id,
                    date: sickDate,
                    meds_taken: medsTaken || null,
                    temp: sickTemp ? parseFloat(sickTemp) : null,
                },
                { withCredentials: true }
            );

            console.log("Sick day record added successfully:", newRecord);

            const normalizedRecord = {
                ...newRecord,
                sick_id: typeof newRecord.sick_id === 'object'
                    ? newRecord.sick_id.sick_id
                    : newRecord.sick_id
            };

            setSickRecords((prev) => [...prev, normalizedRecord]);

            setSickDate("");
            setMedsTaken("");
            setSickTemp("");
            setErrorMessage("");
            setIsSickDayOpen(false);
        } catch (err) {
            console.error("Failed to add sick day record: ", err);
            console.error("Error response:", err.response?.data);
            setErrorMessage(`Failed to add sick day: ${err.response?.data?.error || err.message}`);
        }
    };

    const sortMedsRecords = (records) => {
        const sorted = [...records];
        switch (medsFilter) {
            case "date-desc":
                return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
            case "date-asc":
                return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
            case "name-asc":
                return sorted.sort((a, b) => a.medication_name.localeCompare(b.medication_name));
            case "name-desc":
                return sorted.sort((a, b) => b.medication_name.localeCompare(a.medication_name));
            default:
                return sorted;
        }
    };

    const sortAllergiesRecords = (records) => {
        const sorted = [...records];
        switch (allergiesFilter) {
            case "name-asc":
                return sorted.sort((a, b) => a.allergy_name.localeCompare(b.allergy_name));
            case "name-desc":
                return sorted.sort((a, b) => b.allergy_name.localeCompare(a.allergy_name));
            case "severity-high":
                return sorted.sort((a, b) => {
                    const severityOrder = { high: 3, medium: 2, low: 1 };
                    return severityOrder[b.severity] - severityOrder[a.severity];
                });
            case "severity-low":
                return sorted.sort((a, b) => {
                    const severityOrder = { high: 3, medium: 2, low: 1 };
                    return severityOrder[a.severity] - severityOrder[b.severity];
                });
            default:
                return sorted;
        }
    };

    const sortVaccinationsRecords = (records) => {
        const sorted = [...records];
        switch (vaccinationsFilter) {
            case "date-desc":
                return sorted.sort((a, b) => new Date(b.date_of_vaccine) - new Date(a.date_of_vaccine));
            case "date-asc":
                return sorted.sort((a, b) => new Date(a.date_of_vaccine) - new Date(b.date_of_vaccine));
            case "name-asc":
                return sorted.sort((a, b) => a.vaccination_name.localeCompare(b.vaccination_name));
            case "name-desc":
                return sorted.sort((a, b) => b.vaccination_name.localeCompare(a.vaccination_name));
            default:
                return sorted;
        }
    };

    const sortSickDayRecords = (records) => {
        const sorted = [...records];
        switch (sickDayFilter) {
            case "date-desc":
                return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
            case "date-asc":
                return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
            case "temp-high":
                return sorted.sort((a, b) => (b.temp || 0) - (a.temp || 0));
            case "temp-low":
                return sorted.sort((a, b) => (a.temp || 0) - (b.temp || 0));
            default:
                return sorted;
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

    const logCategories = isBabysitter
        ? allLogCategories.filter(cat => cat.value !== "/growth-tracker")
        : allLogCategories;

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

            {isBabysitter ? (
                <div style={{ width: '100%', height: 'calc(100vh - 300px)', display: 'flex', flexDirection: 'column', marginTop: '20px', position: 'relative' }}>
                    <div className="filterContainer">
                        <div className="filter-dropdown-container">
                            <Button
                                isIconOnly
                                className="healthButton"
                                onPress={() => setIsMedsFilterOpen(!isMedsFilterOpen)}
                            >
                                <FiFilter className="filterIcon" />
                            </Button>
                            {isMedsFilterOpen && (
                                <div className="filterDropdown">
                                    {[
                                        { value: 'date-desc', label: 'Newest First' },
                                        { value: 'date-asc', label: 'Oldest First' },
                                        { value: 'name-asc', label: 'Name (A-Z)' },
                                        { value: 'name-desc', label: 'Name (Z-A)' }
                                    ].map((option) => (
                                        <div
                                            key={option.value}
                                            onClick={() => {
                                                setMedsFilter(option.value);
                                                setIsMedsFilterOpen(false);
                                            }}
                                            className="filterOption"
                                            onMouseEnter={(e) => {
                                                if (medsFilter !== option.value) {
                                                    e.currentTarget.style.backgroundColor = '#f8f8f8';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (medsFilter !== option.value) {
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                }
                                            }}
                                        >
                                            {option.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <Button className="addButton healthButton" onPress={() => setIsMedsOpen(true)}>
                        Add
                    </Button>
        
                    <Scrollbars className="scrollContainer" style={{ flex: 1, minHeight: 0 }}>
                        <div className="scrollContent" style={{ minHeight: '100%' }}>
                            {medsRecords.length === 0 ? (
                                <h1>No med records yet</h1>
                            ) : (
                                sortMedsRecords(medsRecords).map((record, index) => (
                                    <Card className="cardEntry" key={record.meds_id || `med-${index}`} shadow="sm">
                                        <div className="cardEntryContent">
                                            <div className="cardEntryHeader">
                                                <h3 className="cardEntryTitle">{record.medication_name}</h3>
                                                <span className="cardEntryDate">{typeof record.date === 'string' ? new Date(record.date).toLocaleDateString() : new Date(record.date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="cardEntryDetails">
                                                <div className="cardEntryDetail">
                                                    <span className="cardEntryDetailLabel">Time Taken</span>
                                                    <span className="cardEntryDetailValue">{formatTime12Hour(record.time_taken)}</span>
                                                </div>
                                                <div className="cardEntryDetail">
                                                    <span className="cardEntryDetailLabel">Dosage</span>
                                                    <span className="cardEntryDetailValue">{record.dosage} fl oz</span>
                                                </div>
                                            </div>
                                            {record.symptoms && (
                                                <div style={{ marginTop: '8px' }}>
                                                    <span className="cardEntryDetailLabel">Symptoms/Description</span>
                                                    <p style={{ fontSize: '13px', margin: '4px 0 0 0', color: '#555' }}>{record.symptoms}</p>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>
                    </Scrollbars>
                </div>
            ) : (
                <Tabs
                    aria-label="Options"
                    selectedKey={activeTab}
                    onSelectionChange={setActiveTab}
                    className="tabs"
                >
                    <Tab key="meds" title="Medications">
                        <div style={{ width: '100%', height: 'calc(100vh - 300px)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                            <div className="filterContainer">
                                <div className="filter-dropdown-container">
                                    <Button
                                        isIconOnly
                                        className="healthButton"
                                        onPress={() => setIsMedsFilterOpen(!isMedsFilterOpen)}
                                    >
                                        <FiFilter className="filterIcon" />
                                    </Button>
                                    {isMedsFilterOpen && (
                                        <div className="filterDropdown">
                                            {[
                                                { value: 'date-desc', label: 'Newest First' },
                                                { value: 'date-asc', label: 'Oldest First' },
                                                { value: 'name-asc', label: 'Name (A-Z)' },
                                                { value: 'name-desc', label: 'Name (Z-A)' }
                                            ].map((option) => (
                                                <div
                                                    key={option.value}
                                                    onClick={() => {
                                                        setMedsFilter(option.value);
                                                        setIsMedsFilterOpen(false);
                                                    }}
                                                    className="filterOption"
                                                    onMouseEnter={(e) => {
                                                        if (medsFilter !== option.value) {
                                                            e.currentTarget.style.backgroundColor = '#f8f8f8';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (medsFilter !== option.value) {
                                                            e.currentTarget.style.backgroundColor = 'transparent';
                                                        }
                                                    }}
                                                >
                                                    {option.label}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <Scrollbars className="scrollContainer" style={{ flex: 1, minHeight: 0 }}>
                                <div className="scrollContent" style={{ minHeight: '100%' }}>
                                    {medsRecords.length === 0 ? (
                                        <h1>No med records yet</h1>
                                    ) : (
                                        sortMedsRecords(medsRecords).map((record, index) => (
                                            <Card className="cardEntry" key={record.meds_id || `med-${index}`} shadow="sm">
                                                <div className="cardEntryContent">
                                                    <div className="cardEntryHeader">
                                                        <h3 className="cardEntryTitle">{record.medication_name}</h3>
                                                        <span className="cardEntryDate">{typeof record.date === 'string' ? new Date(record.date).toLocaleDateString() : new Date(record.date).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="cardEntryDetails">
                                                        <div className="cardEntryDetail">
                                                            <span className="cardEntryDetailLabel">Time Taken</span>
                                                            <span className="cardEntryDetailValue">{formatTime12Hour(record.time_taken)}</span>
                                                        </div>
                                                        <div className="cardEntryDetail">
                                                            <span className="cardEntryDetailLabel">Dosage</span>
                                                            <span className="cardEntryDetailValue">{record.dosage} fl oz</span>
                                                        </div>
                                                    </div>
                                                    {record.symptoms && (
                                                        <div style={{ marginTop: '8px' }}>
                                                            <span className="cardEntryDetailLabel">Symptoms/Description</span>
                                                            <p style={{ fontSize: '13px', margin: '4px 0 0 0', color: '#555' }}>{record.symptoms}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </Card>
                                        ))
                                    )}
                                </div>
                            </Scrollbars>
    
                            <Button className="addButton healthButton" onPress={() => setIsMedsOpen(true)}>
                                Add
                            </Button>
                        </div>
                    </Tab>

                    <Tab key="allergies" title="Allergies">
                        <div style={{ width: '100%', height: 'calc(100vh - 300px)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                            <div className="filterContainer">
                                <div className="filter-dropdown-container">
                                    <Button
                                        isIconOnly
                                        className="healthButton"
                                        onPress={() => setIsAllergiesFilterOpen(!isAllergiesFilterOpen)}
                                    >
                                        <FiFilter className="filterIcon" />
                                    </Button>
                                    {isAllergiesFilterOpen && (
                                        <div className="filterDropdown">
                                            {[
                                                { value: 'name-asc', label: 'Name (A-Z)' },
                                                { value: 'name-desc', label: 'Name (Z-A)' },
                                                { value: 'severity-high', label: 'Severity (High to Low)' },
                                                { value: 'severity-low', label: 'Severity (Low to High)' }
                                            ].map((option) => (
                                                <div
                                                    key={option.value}
                                                    onClick={() => {
                                                        setAllergiesFilter(option.value);
                                                        setIsAllergiesFilterOpen(false);
                                                    }}
                                                    className="filterOption"
                                                    onMouseEnter={(e) => {
                                                        if (allergiesFilter !== option.value) {
                                                            e.currentTarget.style.backgroundColor = '#f8f8f8';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (allergiesFilter !== option.value) {
                                                            e.currentTarget.style.backgroundColor = 'transparent';
                                                        }
                                                    }}
                                                >
                                                    {option.label}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Button className="addButton healthButton" onPress={() => setIsAllergiesOpen(true)}>
                                Add
                            </Button>
                          
                            <Scrollbars className="scrollContainer" style={{ flex: 1, minHeight: 0 }}>
                                <div className="scrollContent" style={{ minHeight: '100%' }}>
                                    {allergiesRecords.length === 0 ? (
                                        <h1>No allergy records yet</h1>
                                    ) : (
                                        sortAllergiesRecords(allergiesRecords).map((record, index) => (
                                            <Card className="cardEntry" key={record.allergy_id || `allergy-${index}`} shadow="sm">
                                                <div className="cardEntryContent">
                                                    <div className="cardEntryHeader">
                                                        <h3 className="cardEntryTitle">{record.allergy_name}</h3>
                                                    </div>
                                                    <div className="cardEntryDetails">
                                                        <div className="cardEntryDetail">
                                                            <span className="cardEntryDetailLabel">Severity</span>
                                                            <span className="cardEntryDetailValue">{record.severity.charAt(0).toUpperCase() + record.severity.slice(1)}</span>
                                                        </div>
                                                        <div className="cardEntryDetail">
                                                            <span className="cardEntryDetailLabel">Epi Pen</span>
                                                            <span className="cardEntryDetailValue">{typeof record.epi_pen === 'boolean' ? (record.epi_pen ? 'Yes' : 'No') : record.epi_pen}</span>
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
                        </div>
                    </Tab>

                    <Tab key="vaccinations" title="Vaccinations">
                        <div style={{ width: '100%', height: 'calc(100vh - 300px)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                            <div className="filterContainer">
                                <div className="filter-dropdown-container">
                                    <Button
                                        isIconOnly
                                        className="healthButton"
                                        onPress={() => setIsVaccinationsFilterOpen(!isVaccinationsFilterOpen)}
                                    >
                                        <FiFilter className="filterIcon" />
                                    </Button>
                                    {isVaccinationsFilterOpen && (
                                        <div className="filterDropdown">
                                            {[
                                                { value: 'date-desc', label: 'Newest First' },
                                                { value: 'date-asc', label: 'Oldest First' },
                                                { value: 'name-asc', label: 'Name (A-Z)' },
                                                { value: 'name-desc', label: 'Name (Z-A)' }
                                            ].map((option) => (
                                                <div
                                                    key={option.value}
                                                    onClick={() => {
                                                        setVaccinationsFilter(option.value);
                                                        setIsVaccinationsFilterOpen(false);
                                                    }}
                                                    className="filterOption"
                                                    onMouseEnter={(e) => {
                                                        if (vaccinationsFilter !== option.value) {
                                                            e.currentTarget.style.backgroundColor = '#f8f8f8';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (vaccinationsFilter !== option.value) {
                                                            e.currentTarget.style.backgroundColor = 'transparent';
                                                        }
                                                    }}
                                                >
                                                    {option.label}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>   
                            
                            <Button className="addButton healthButton" onPress={() => setIsVaccinationsOpen(true)}>
                                Add
                            </Button>
                           
                            <Scrollbars className="scrollContainer" style={{ flex: 1, minHeight: 0 }}>
                                <div className="scrollContent" style={{ minHeight: '100%' }}>
                                    {vaccinationsRecords.length === 0 ? (
                                        <h1>No vaccinations records yet</h1>
                                    ) : (
                                        sortVaccinationsRecords(vaccinationsRecords).map((record, index) => (
                                            <Card className="cardEntry" key={record.vaccine_id || `vaccine-${index}`} shadow="sm">
                                                <div className="cardEntryContent">
                                                    <div className="cardEntryHeader">
                                                        <h3 className="cardEntryTitle">{record.vaccination_name}</h3>
                                                        <span className="cardEntryDate">{typeof record.date_of_vaccine === 'string' ? new Date(record.date_of_vaccine).toLocaleDateString() : new Date(record.date_of_vaccine).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))
                                    )}
                                </div>
                            </Scrollbars>
                        </div>
                    </Tab>

                    <Tab key="sickdays" title="Sick Days">
                        <div style={{ width: '100%', height: 'calc(100vh - 300px)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                            <div className="filterContainer">
                                <div className="filter-dropdown-container">
                                    <Button
                                        isIconOnly
                                        className="healthButton"
                                        onPress={() => setIsSickDayFilterOpen(!isSickDayFilterOpen)}

                                    >
                                        <FiFilter className="filterIcon" />
                                    </Button>
                                    {isSickDayFilterOpen && (
                                        <div className="filterDropdown">
                                            {[
                                                { value: 'date-desc', label: 'Newest First' },
                                                { value: 'date-asc', label: 'Oldest First' },
                                                { value: 'temp-high', label: 'Temp (High to Low)' },
                                                { value: 'temp-low', label: 'Temp (Low to High)' }
                                            ].map((option) => (
                                                <div
                                                    key={option.value}
                                                    onClick={() => {
                                                        setSickDayFilter(option.value);
                                                        setIsSickDayFilterOpen(false);
                                                    }}
                                                    className="filterOption"
                                                    onMouseEnter={(e) => {
                                                        if (sickDayFilter !== option.value) {
                                                            e.currentTarget.style.backgroundColor = '#f8f8f8';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (sickDayFilter !== option.value) {
                                                            e.currentTarget.style.backgroundColor = 'transparent';
                                                        }
                                                    }}
                                                >
                                                    {option.label}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <Button className="addButton healthButton" onPress={() => setIsSickDayOpen(true)}>
                                Add
                            </Button>

                            <Scrollbars className="scrollContainer" style={{ flex: 1, minHeight: 0 }}>
                                <div className="scrollContent" style={{ minHeight: '100%' }}>
                                    {sickDayRecords.length === 0 ? (
                                        <h1>No sick day records yet</h1>
                                    ) : (
                                        sortSickDayRecords(sickDayRecords).map((record, index) => (
                                            <Card className="cardEntry" key={record.sick_id || `sick-${index}`} shadow="sm">
                                                <div className="cardEntryContent">
                                                    <div className="cardEntryHeader">
                                                        <h3 className="cardEntryTitle">Sick Day</h3>
                                                        <span className="cardEntryDate">{typeof record.date === 'string' ? new Date(record.date).toLocaleDateString() : new Date(record.date).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="cardEntryDetails">
                                                        {record.temp && (
                                                            <div className="cardEntryDetail">
                                                                <span className="cardEntryDetailLabel">Temperature</span>
                                                                <span className="cardEntryDetailValue">{record.temp}°F</span>
                                                            </div>
                                                        )}
                                                        {record.meds_taken && (
                                                            <div className="cardEntryDetail">
                                                                <span className="cardEntryDetailLabel">Meds Taken</span>
                                                                <span className="cardEntryDetailValue">{record.meds_taken}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </Card>
                                        ))
                                    )}
                                </div>
                            </Scrollbars>
                        </div>
                    </Tab>
                </Tabs>
            )}

            <Navbar />

            <Modal isOpen={isMedsOpen} onOpenChange={setIsMedsOpen} className="modal">
                <ModalContent>
                    <ModalHeader>Add Medication</ModalHeader>
                        <ModalBody className="modalBody">
                            {errorMessage && (
                                <p className="errorMessage">
                                    {errorMessage}
                                </p>
                            )}
                                <Input
                                    variant="bordered"
                                    label="Medication Name"
                                    isRequired
                                    placeholder="Enter medication name"
                                    type="text"
                                    maxLength={200}
                                    onKeyDown={(e) => {
                                        const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End', ' ', '-', '(', ')'];
                                        if ((e.ctrlKey || e.metaKey) || allowedKeys.includes(e.key) || /^[a-zA-Z0-9\-() ]$/.test(e.key)) return;
                                        e.preventDefault();
                                    }}
                                    value={medName}
                                    onChange={(e) => setMedName(e.target.value)}
                                />
                                <TimeInput
                                    variant="bordered"
                                    label="Time take at"
                                    isRequired
                                    value={medsTimeTaken}
                                    onChange={(newTime) => setMedsTimeTaken(newTime)}
                                />
                                <Input
                                    variant="bordered"
                                    label="Date"
                                    isRequired
                                    placeholder="Date"
                                    type="date"
                                    value={medDate}
                                    onChange={(e) => setMedDate(e.target.value)}
                                />
                                <Input
                                    variant="bordered"
                                    label="Amount (fl oz)"
                                    isRequired
                                    placeholder="Amount in fluid ounces"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    onKeyDown={(e) => {
                                        const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End', '.'];
                                        if ((e.ctrlKey || e.metaKey) || allowedKeys.includes(e.key) || /^\d$/.test(e.key)) {
                                        if (e.key === '.' && e.target.value.includes('.')) e.preventDefault();
                                        return;
                                        }
                                        e.preventDefault();
                                    }}
                                    value={medDose}
                                    onChange={(e) => setMedDose(e.target.value)}
                                />
                                <Input
                                    variant="bordered"
                                    label="Sicness/Symptoms"
                                    isRequired
                                    placeholder="Describe how they are feeling"
                                    type="text"
                                    maxLength={500}
                                    onKeyDown={(e) => {
                                        const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End', ' '];
                                        if ((e.ctrlKey || e.metaKey) || allowedKeys.includes(e.key) || /^[a-zA-Z0-9.,!?\-'() ]$/.test(e.key)) return;
                                        e.preventDefault();
                                    }}
                                    value={medSympDescription}
                                    onChange={(e) => setMedSympDescription(e.target.value)}
                                />
                        </ModalBody>
                    <ModalFooter className="modalFooter">
                        <Button onPress={() => setIsMedsOpen(false)}>
                            Cancel
                        </Button>
                        <Button onPress={handleAddMeds}>
                            Add
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isAllergiesOpen} onOpenChange={setIsAllergiesOpen} className="modal" >
                <ModalContent>
                    <ModalHeader>Add Allergy</ModalHeader>
                        <ModalBody className="modalBody">
                            {errorMessage && (
                                <p className="errorMessage">
                                    {errorMessage}
                                </p>
                            )}
                                <Input
                                    variant="bordered"
                                    label="Allergy Name"
                                    isRequired
                                    placeholder="What are they allergic to"
                                    type="text"
                                    maxLength={200}
                                    onKeyDown={(e) => {
                                        const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End', ' '];
                                        if ((e.ctrlKey || e.metaKey) || allowedKeys.includes(e.key) || /^[a-zA-Z0-9.,!?\-'() ]$/.test(e.key)) return;
                                        e.preventDefault();
                                    }}
                                    value={allergy}
                                    onChange={(e) => setAllergy(e.target.value)}
                                />

                                <div className="allergyFieldsContainer">
                                    <div className="severityContainer">
                                        <label className="severity">Severity</label>
                                        <Select
                                            options={[
                                                { value: 'low', label: 'Low' },
                                                { value: 'medium', label: 'Medium' },
                                                { value: 'high', label: 'High' }
                                            ]}
                                            value={severity ? { value: severity, label: severity.charAt(0).toUpperCase() + severity.slice(1) } : null}
                                            onChange={(option) => {
                                                if (option) {
                                                    setSeverity(option.value);
                                                }
                                            }}
                                            placeholder="Select severity"
                                            isSearchable={false}
                                        />
                                    </div>

                                    <div className="epiPenGroup">
                                        <RadioGroup
                                            label="EpiPen"
                                            isRequired
                                            value={epiPen}
                                            onValueChange={(val) => setEpiPen(val)}
                                        >
                                            <Radio className="epiPen" value="yes">Yes</Radio>
                                            <Radio className="epiPen" value="no">No</Radio>
                                        </RadioGroup>
                                    </div>
                                </div>

                                <Input
                                    variant="bordered"
                                    label="Notes"
                                    isRequired
                                    placeholder="Add any other important info"
                                    type="text"
                                    maxLength={1000}
                                    onKeyDown={(e) => {
                                        const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End', ' '];
                                        if ((e.ctrlKey || e.metaKey) || allowedKeys.includes(e.key) || /^[a-zA-Z0-9.,!?\-'():;" ]$/.test(e.key)) return;
                                        e.preventDefault();
                                    }}
                                    value={allergyNotes}
                                    onChange={(e) => setAllergyNotes(e.target.value)}
                                />
                        </ModalBody>
                    <ModalFooter className="modalFooter">
                        <Button onPress={() => setIsAllergiesOpen(false)}>
                            Cancel
                        </Button>
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
                        <ModalBody className="modalBody">
                            {errorMessage && (
                                <p className="errorMessage">
                                    {errorMessage}
                                </p>
                            )}
                                <Input
                                    variant="bordered"
                                    label="Vaccine Name"
                                    isRequired
                                    placeholder="Vaccination they have"
                                    type="text"
                                    maxLength={200}
                                    onKeyDown={(e) => {
                                        const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End', ' '];
                                        if ((e.ctrlKey || e.metaKey) || allowedKeys.includes(e.key) || /^[a-zA-Z0-9.,!?\-'():;" ]$/.test(e.key)) return;
                                        e.preventDefault();
                                    }}
                                    value={vaccineName}
                                    onChange={(e) => setVaccineName(e.target.value)}
                                />
                                <Input
                                    variant="bordered"
                                    type="date"
                                    label="Date of Vaccine"
                                    isRequired
                                    value={vaccineDate}
                                    onChange={(e) => setVaccineDate(e.target.value)}
                                />
                        </ModalBody>
                    <ModalFooter className="modalFooter">
                        <Button onPress={() => setIsVaccinationsOpen(false)}>
                            Cancel
                        </Button>
                        <Button onPress={handleAddVaccinations}>
                            Add
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal
                isOpen={isSickDayOpen}
                onOpenChange={setIsSickDayOpen}
                className="modal"
            >
                <ModalContent>
                    <ModalHeader>Add Sick Day</ModalHeader>
                        <ModalBody className="modalBody">
                            {errorMessage && (
                                <p className="errorMessage">
                                    {errorMessage}
                                </p>
                            )}
                                <Input
                                    variant="bordered"
                                    type="date"
                                    label="Date"
                                    isRequired
                                    value={sickDate}
                                    onChange={(e) => setSickDate(e.target.value)}
                                />
                                <Input
                                    variant="bordered"
                                    label="Medications Taken"
                                    placeholder="Enter medications taken"
                                    type="text"
                                    maxLength={500}
                                    onKeyDown={(e) => {
                                        const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End', ' ', ','];
                                        if ((e.ctrlKey || e.metaKey) || allowedKeys.includes(e.key) || /^[a-zA-Z0-9.,!?\-'() ]$/.test(e.key)) return;
                                        e.preventDefault();
                                    }}
                                    value={medsTaken}
                                    onChange={(e) => setMedsTaken(e.target.value)}
                                />
                                <Input
                                    variant="bordered"
                                    label="Temperature (°F)"
                                    placeholder="Enter temperature"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    onKeyDown={(e) => {
                                        const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End', '.'];
                                        if ((e.ctrlKey || e.metaKey) || allowedKeys.includes(e.key) || /^\d$/.test(e.key)) {
                                            if (e.key === '.' && e.target.value.includes('.')) e.preventDefault();
                                            return;
                                        }
                                        e.preventDefault();
                                    }}
                                    value={sickTemp}
                                    onChange={(e) => setSickTemp(e.target.value)}
                                />
                        </ModalBody>
                    <ModalFooter className="modalFooter">
                        <Button onPress={() => setIsSickDayOpen(false)}>
                            Cancel
                        </Button>
                        <Button onPress={handleAddSickDay}>
                            Add
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
