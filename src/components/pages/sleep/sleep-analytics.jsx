import React from "react";
import axios from "axios";
import Navbar from "../nav-bar/navbar";
import { Button, Card, Input, ModalBody, ModalContent, ModalFooter, ModalHeader, Image } from "@heroui/react";
import {TimeInput} from "@heroui/react";
import { Modal } from "@heroui/react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import { FiFilter } from "react-icons/fi";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import "../../../styles/pages.css";
import { Scrollbars } from "react-custom-scrollbars-2";
import { useBabyData } from "../../../hooks/useBabyData";
import API_URL from "../../../config/api";
import Select from "../../custom-select/CustomSelect";


export default function SleepAnalytics() {
    const location = useLocation();
    const navigate = useNavigate();
    const { userData, babyData, selectedBaby, setSelectedBaby, loading: dataLoading } = useBabyData(location.state);
    const [isOpen, setIsOpen] = useState(false);
    const [hours, setHours] = useState("");
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");
    const [sleepRecords, setSleepRecords] = useState([]);
    const [sleepFilter, setSleepFilter] = useState("date-desc");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const formatTime12Hour = (time24) => {
        if (!time24) return "";
        const [hours, minutes] = time24.split(":");
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        // Handle ISO timestamp format (e.g., "2024-01-15T00:00:00.000Z")
        const dateOnly = dateString.split("T")[0];
        const [year, month, day] = dateOnly.split("-");
        return new Date(year, month - 1, day).toLocaleDateString();
    };

    const getInitials = (firstName, lastName) => {
        if (!firstName || !lastName) return null;
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

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
        if (!selectedBaby) return;

        const fetchSleepRecords = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/sleep`, {
                    params: { baby_id: selectedBaby.baby_id },
                    withCredentials: true,
                });
                setSleepRecords(data);
            } catch (err) {
                console.error("Failed to fetch sleep records: ", err)
            }
        };

        fetchSleepRecords();
    }, [selectedBaby]);

    const handleAddSleep = async () => {
        setErrorMessage("");

        if (!hours || !time || !date) {
            setErrorMessage("Please fill out all fields.");
            return;
        }

        const sleepHours = parseFloat(hours);
        if (isNaN(sleepHours) || sleepHours <= 0 || sleepHours > 24) {
            setErrorMessage("Sleep duration must be a valid number between 0 and 24 hours.");
            return;
        }

        const formattedTime = `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}`;

        try {
            if (editingRecord) {
                // Update existing record
                const { data: updatedRecord } = await axios.put(
                    `${API_URL}/api/sleep/${editingRecord.sleep_id}`,
                    {
                        baby_id: selectedBaby.baby_id,
                        sleep_duration: sleepHours,
                        time_fell_asleep: formattedTime,
                        date,
                    },
                    { withCredentials: true }
                );

                setSleepRecords((prev) =>
                    prev.map((record) =>
                        record.sleep_id === editingRecord.sleep_id
                            ? updatedRecord
                            : record
                    )
                );
            } else {
                // Add new record
                const { data: newRecord } = await axios.post(
                    `${API_URL}/api/sleep`,
                    {
                        baby_id: selectedBaby.baby_id,
                        sleep_duration: sleepHours,
                        time_fell_asleep: formattedTime,
                        date,
                        created_by_account_id: userData?.account_id,
                        created_by_first_name: userData?.first_name,
                        created_by_last_name: userData?.last_name,
                    },
                    { withCredentials: true }
                );

                setSleepRecords((prev) => [...prev, newRecord]);
            }

            setHours("");
            setTime("");
            setDate("");
            setErrorMessage("");
            setEditingRecord(null);
            setIsOpen(false);
        } catch (err) {
            console.error("Failed to save sleep record: ", err);
            setErrorMessage("Failed to save sleep record. Please try again.")
        }
    };

    const handleEditSleep = (record) => {
        setEditingRecord(record);
        setHours(record.sleep_duration.toString());
        const [hour, minute] = record.time_fell_asleep.split(":");
        setTime({ hour: parseInt(hour), minute: parseInt(minute) });
        setDate(record.date);
        setIsOpen(true);
    };

    const handleDeleteSleep = async () => {
        if (!recordToDelete) return;

        try {
            await axios.delete(
                `${API_URL}/api/sleep/${recordToDelete.sleep_id}`,
                { withCredentials: true }
            );

            setSleepRecords((prev) =>
                prev.filter((record) => record.sleep_id !== recordToDelete.sleep_id)
            );

            setIsDeleteModalOpen(false);
            setRecordToDelete(null);
        } catch (err) {
            console.error("Failed to delete sleep record: ", err);
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

    const currentCategory = logCategories.find(cat => cat.value === "/sleep-analytics");

    const sortSleepRecords = (records) => {
        const sorted = [...records];
        switch (sleepFilter) {
            case "date-desc":
                return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
            case "date-asc":
                return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
            case "duration-high":
                return sorted.sort((a, b) => b.sleep_duration - a.sleep_duration);
            case "duration-low":
                return sorted.sort((a, b) => a.sleep_duration - b.sleep_duration);
            default:
                return sorted;
        }
    };

    return (
        <div className="mainDiv">
           <div className="header sleepHeader">
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
                    <h1>{selectedBaby?.first_name || "Baby"}'s Sleep</h1>
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
                        className="sleepButton"
                    >
                        <FiFilter className="filterIcon"/>
                    </Button>
                    {isFilterOpen && (
                        <div className="filterDropdown">
                            {[
                                { value: 'date-desc', label: 'Newest First' },
                                { value: 'date-asc', label: 'Oldest First' },
                                { value: 'duration-high', label: 'Duration (Longest to Shortest)' },
                                { value: 'duration-low', label: 'Duration (Shortest to Longest)' }
                            ].map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() => {
                                        setSleepFilter(option.value);
                                        setIsFilterOpen(false);
                                    }}
                                    className="filterOption"
                                    onMouseEnter={(e) => {
                                        if (sleepFilter !== option.value) {
                                            e.currentTarget.style.backgroundColor = '#f8f8f8';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (sleepFilter !== option.value) {
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
                    {sleepRecords.length === 0 ? (
                        <h1>No sleep records yet</h1>
                    ) : (
                        sortSleepRecords(sleepRecords).map((record) => (
                            <Card className="cardEntry" key={record.sleep_id} shadow="sm">
                                <div className="cardEntryContent">
                                    <div className="cardEntryHeader">
                                        <h3 className="cardEntryTitle">
                                            Sleep Log
                                            {record.created_by_first_name && record.created_by_last_name && (
                                                <span style={{
                                                    marginLeft: '8px',
                                                    backgroundColor: '#4CAF50',
                                                    color: 'white',
                                                    padding: '2px 8px',
                                                    borderRadius: '12px',
                                                    fontSize: '11px',
                                                    fontWeight: 'bold',
                                                }}>
                                                    {getInitials(record.created_by_first_name, record.created_by_last_name)}
                                                </span>
                                            )}
                                        </h3>
                                        <span className="cardEntryDate">{formatDate(record.date)}</span>
                                    </div>
                                    <div className="cardEntryDetails">
                                        <div className="cardEntryDetail">
                                            <span className="cardEntryDetailLabel">Duration</span>
                                            <span className="cardEntryDetailValue">{record.sleep_duration} hrs</span>
                                        </div>
                                        <div className="cardEntryDetail">
                                            <span className="cardEntryDetailLabel">Fell Asleep</span>
                                            <span className="cardEntryDetailValue">{formatTime12Hour(record.time_fell_asleep)}</span>
                                        </div>
                                    </div>
                                    {!isBabysitter && (
                                        <div className="editDeleteButtonContainer">
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="light"
                                                onPress={() => handleEditSleep(record)}
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
                                    )}
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </Scrollbars>
       
            <Button className="addButton sleepButton" onPress={() => {
                setEditingRecord(null);
                setHours("");
                setTime("");
                setDate("");
                setErrorMessage("");
                setIsOpen(true);
            }}>
                Add
            </Button>

            <Navbar />

            <Modal isOpen={isOpen} onOpenChange={setIsOpen} className="modal">
                <ModalContent >
                    <ModalHeader className="modalHeader">
                        {editingRecord ? "Edit Sleep" : "Add Sleep"}
                    </ModalHeader>
                    <ModalBody className="modalBody">
                        {errorMessage && (
                            <p className="errorMessage">
                                {errorMessage}
                            </p>
                        )}
                        <Input
                            variant="bordered"
                            label="Sleep Duration (hours)"
                            isRequired
                            placeholder="Hours slept (e.g., 8.5)"
                            type="number"
                            step="0.1"
                            min="0.1"
                            max="24"
                            onKeyDown={(e) => {
                                const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End', '.'];
                                if ((e.ctrlKey || e.metaKey) || allowedKeys.includes(e.key) || /^\d$/.test(e.key)) {
                                if (e.key === '.' && e.target.value.includes('.')) e.preventDefault();
                                return;
                                }
                                e.preventDefault();
                            }}
                            value={hours}
                            onChange={(e) => setHours(e.target.value)}
                        />
                        <TimeInput 
                            variant="bordered"
                            label="Time fell asleep at" 
                            isRequired
                            value={time}
                            onChange={(newTime) => setTime(newTime)}
                            
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
                            setHours("");
                            setTime("");
                            setDate("");
                            setErrorMessage("");
                        }}>
                            Cancel
                        </Button>

                        <Button onPress={handleAddSleep}>
                            {editingRecord ? "Save" : "Add"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} className="modal">
                <ModalContent>
                    <ModalHeader className="modalHeader">
                        Delete Sleep Record
                    </ModalHeader>
                    <ModalBody className="modalBody">
                        <p>Are you sure you want to delete this sleep record? This action cannot be undone.</p>
                    </ModalBody>
                    <ModalFooter className="modalFooter">
                        <Button onPress={() => {
                            setIsDeleteModalOpen(false);
                            setRecordToDelete(null);
                        }}>
                            Cancel
                        </Button>
                        <Button color="danger" onPress={handleDeleteSleep}>
                            Delete
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
