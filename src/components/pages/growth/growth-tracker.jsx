import React from "react";
import axios from "axios";
import Navbar from "../nav-bar/navbar";
import { Button, Card, Input, ModalBody, ModalContent, ModalFooter, ModalHeader, Image } from "@heroui/react";
import { Modal } from "@heroui/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import { FiFilter } from "react-icons/fi";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import "../../../styles/pages.css";
import { auth } from "../../../firebase/firebaseAuth";
import { Scrollbars } from "react-custom-scrollbars-2";
import API_URL from "../../../config/api";
import Select from "../../custom-select/CustomSelect";


export default function GrowthTracker() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [heightFeet, setHeightFeet] = useState("");
    const [heightInches, setHeightInches] = useState("");
    const [weight, setWeight] = useState("");
    const [date, setDate] = useState("");
    const [userData, setUserData] = useState(null);
    const [babyData, setBabyData] = useState([]);
    const [selectedBaby, setSelectedBaby] = useState(null);
    const [growthRecords, setGrowthRecords] = useState([]);
    const [growthFilter, setGrowthFilter] = useState("date-desc");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isFilterOpen && !event.target.closest('.filter-dropdown-container')) {
                setIsFilterOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isFilterOpen]);

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
        setErrorMessage("");

        if (!heightFeet || !heightInches || !weight || !date) {
            setErrorMessage("Please fill out all fields.");
            return;
        }

        const feet = parseFloat(heightFeet);
        if (isNaN(feet) || feet < 0) {
            setErrorMessage("Height (feet) must be a valid number greater than or equal to 0.");
            return;
        }

        const inches = parseFloat(heightInches);
        if (isNaN(inches) || inches < 0 || inches >= 12) {
            setErrorMessage("Height (inches) must be a valid number between 0 and 11.99.");
            return;
        }

        const weightLbs = parseFloat(weight);
        if (isNaN(weightLbs) || weightLbs <= 0) {
            setErrorMessage("Weight must be a valid number greater than 0 (in lbs).");
            return;
        }

        const totalInches = feet * 12 + inches;

        try {
            if (editingRecord) {
                const { data: updatedRecord } = await axios.put(
                    `${API_URL}/api/growth/${editingRecord.growth_id}`,
                    {
                        baby_id: selectedBaby.baby_id,
                        height: totalInches,
                        weight: weightLbs,
                        date,
                    },
                    { withCredentials: true }
                );

                setGrowthRecords((prev) =>
                    prev.map((record) =>
                        record.growth_id === editingRecord.growth_id
                            ? updatedRecord
                            : record
                    )
                );
            } else {
                const { data: newRecord } = await axios.post(
                    `${API_URL}/api/growth`,
                    {
                        baby_id: selectedBaby.baby_id,
                        height: totalInches,
                        weight: weightLbs,
                        date,
                    },
                    { withCredentials: true }
                );

                setGrowthRecords((prev) => [...prev, newRecord]);
            }

            setHeightFeet("");
            setHeightInches("");
            setWeight("");
            setDate("");
            setErrorMessage("");
            setEditingRecord(null);
            setIsOpen(false);
        } catch (err) {
            console.error("Failed to save growth record: ", err);
            setErrorMessage("Failed to save growth record. Please try again.");
        }
    };

    const handleEditGrowth = (record) => {
        setEditingRecord(record);
        const totalInches = record.height;
        const feet = Math.floor(totalInches / 12);
        const inches = (totalInches % 12).toFixed(1);
        setHeightFeet(feet.toString());
        setHeightInches(inches);
        setWeight(record.weight.toString());
        setDate(record.date);
        setIsOpen(true);
    };

    const handleDeleteGrowth = async () => {
        if (!recordToDelete) return;

        try {
            await axios.delete(
                `${API_URL}/api/growth/${recordToDelete.growth_id}`,
                { withCredentials: true }
            );

            setGrowthRecords((prev) =>
                prev.filter((record) => record.growth_id !== recordToDelete.growth_id)
            );

            setIsDeleteModalOpen(false);
            setRecordToDelete(null);
        } catch (err) {
            console.error("Failed to delete growth record: ", err);
        }
    };

    const openDeleteModal = (record) => {
        setRecordToDelete(record);
        setIsDeleteModalOpen(true);
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

    const currentCategory = logCategories.find(cat => cat.value === "/growth-tracker");

    const sortGrowthRecords = (records) => {
        const sorted = [...records];
        switch (growthFilter) {
            case "date-desc":
                return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
            case "date-asc":
                return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
            case "weight-high":
                return sorted.sort((a, b) => b.weight - a.weight);
            case "weight-low":
                return sorted.sort((a, b) => a.weight - b.weight);
            case "height-high":
                return sorted.sort((a, b) => b.height - a.height);
            case "height-low":
                return sorted.sort((a, b) => a.height - b.height);
            default:
                return sorted;
        }
    };

    return (
        <div className="mainDiv">
            <div className="header growthHeader">
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

            <div className="filterContainer">
                <div className="filter-dropdown-container">
                    <Button
                        isIconOnly
                        onPress={() => setIsFilterOpen(!isFilterOpen)}
                        className="growthButton"
                    >
                        <FiFilter className="filterIcon" />
                    </Button>
                    {isFilterOpen && (
                        <div className="filterDropdown">
                            {[
                                { value: 'date-desc', label: 'Newest First' },
                                { value: 'date-asc', label: 'Oldest First' },
                                { value: 'weight-high', label: 'Weight (High to Low)' },
                                { value: 'weight-low', label: 'Weight (Low to High)' },
                                { value: 'height-high', label: 'Height (Tallest to Shortest)' },
                                { value: 'height-low', label: 'Height (Shortest to Tallest)' }
                            ].map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() => {
                                        setGrowthFilter(option.value);
                                        setIsFilterOpen(false);
                                    }}
                                    className="filterOption"
                                    onMouseEnter={(e) => {
                                        if (growthFilter !== option.value) {
                                            e.currentTarget.style.backgroundColor = '#f8f8f8';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (growthFilter !== option.value) {
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

            <Scrollbars className="scrollContainer" >
                <div className="scrollContent">
                    {growthRecords.length === 0 ? (
                        <h1>No growth records yet</h1>
                    ) : (
                        sortGrowthRecords(growthRecords).map((record) => {
                            const totalInches = record.height;
                            const feet = Math.floor(totalInches / 12);
                            const inches = (totalInches % 12).toFixed(1);

                            return (
                                <Card className="cardEntry" key={record.growth_id} shadow="sm">
                                    <div className="cardEntryContent">
                                        <div className="cardEntryHeader">
                                            <h3 className="cardEntryTitle">Growth Record</h3>
                                            <span className="cardEntryDate">{new Date(record.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="cardEntryDetails">
                                            <div className="cardEntryDetail">
                                                <span className="cardEntryDetailLabel">Height</span>
                                                <span className="cardEntryDetailValue">{feet}' {inches}"</span>
                                            </div>
                                            <div className="cardEntryDetail">
                                                <span className="cardEntryDetailLabel">Weight</span>
                                                <span className="cardEntryDetailValue">{record.weight} lbs</span>
                                            </div>
                                        </div>
                                        <div className="editDeleteButtonContainer">
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="light"
                                                onPress={() => handleEditGrowth(record)}
                                            >
                                                <FiEdit2 size={16} />
                                            </Button>
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="light"
                                                color="danger"
                                                onPress={() => openDeleteModal(record)}
                                                
                                            >
                                                <FiTrash2 size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })
                    )}
                </div>
            </Scrollbars>
          
            <Button className="addButton growthButton" onPress={() => {
                setEditingRecord(null);
                setHeightFeet("");
                setHeightInches("");
                setWeight("");
                setDate("");
                setErrorMessage("");
                setIsOpen(true);
            }}>
                Add
            </Button >

            <Navbar />

            <Modal isOpen={isOpen} onOpenChange={setIsOpen} className="modal">
                <ModalContent >
                    <ModalHeader className="modalHeader">
                        {editingRecord ? "Edit Growth" : "Add Growth"}
                    </ModalHeader>
                    <ModalBody className="modalBody">
                        {errorMessage && (
                            <p className="errorMessage">
                                {errorMessage}
                            </p>
                        )}
                            <Input
                                variant="bordered"
                                label="Height (feet)"
                                isRequired
                                placeholder="Feet"
                                type="number"
                                step="1"
                                min="0"
                                max="10"
                                value={heightFeet}
                                onChange={(e) => setHeightFeet(e.target.value)}
                                onKeyDown={(e) => {
                                    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
                                    if ((e.ctrlKey || e.metaKey) || allowedKeys.includes(e.key) || /^\d$/.test(e.key)) return;
                                    e.preventDefault();
                                }}
                               
                            />
                            <Input
                                variant="bordered"
                                label="Height (inches)"
                                isRequired
                                placeholder="Inches"
                                type="number"
                                step="0.1"
                                min="0"
                                max="11.99"
                                value={heightInches}
                                onChange={(e) => setHeightInches(e.target.value)}
                                onKeyDown={(e) => {
                                    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End', '.'];
                                    if ((e.ctrlKey || e.metaKey) || allowedKeys.includes(e.key) || /^\d$/.test(e.key)) {
                                        if (e.key === '.' && e.target.value.includes('.')) e.preventDefault();
                                        return;
                                    }
                                    e.preventDefault();
                                }}
                            />

                        <Input
                            variant="bordered"
                            label="Weight (lbs)"
                            isRequired
                            placeholder="Weight in pounds"
                            type="number"
                            step="0.1"
                            min="0.1"
                            max="500"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            onKeyDown={(e) => {
                                const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End', '.'];
                                if ((e.ctrlKey || e.metaKey) || allowedKeys.includes(e.key) || /^\d$/.test(e.key)) {
                                    if (e.key === '.' && e.target.value.includes('.')) e.preventDefault();
                                    return;
                                }
                                e.preventDefault();
                            }}
                        />

                        <Input
                            variant="bordered"
                            label="Date"
                            isRequired
                            placeholder="Date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                      
                    </ModalBody>
                    <ModalFooter className="modalFooter">
                        <Button onPress={() => {
                            setIsOpen(false);
                            setEditingRecord(null);
                            setHeightFeet("");
                            setHeightInches("");
                            setWeight("");
                            setDate("");
                            setErrorMessage("");
                        }}>
                            Cancel
                        </Button>

                        <Button onPress={handleAddGrowth}>
                            {editingRecord ? "Save" : "Add"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} className="modal">
                <ModalContent>
                    <ModalHeader className="modalHeader">
                        Delete Growth Record
                    </ModalHeader>
                    <ModalBody className="modalBody">
                        <p>Are you sure you want to delete this growth record? This action cannot be undone.</p>
                    </ModalBody>
                    <ModalFooter className="modalFooter">
                        <Button onPress={() => {
                            setIsDeleteModalOpen(false);
                            setRecordToDelete(null);
                        }}>
                            Cancel
                        </Button>
                        <Button color="danger" onPress={handleDeleteGrowth}>
                            Delete
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
