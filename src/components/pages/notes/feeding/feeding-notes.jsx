import React from "react";
import axios from "axios";
import Navbar from "../../nav-bar/navbar";
import { Button, Card, Input, ModalBody, ModalContent, ModalFooter, ModalHeader, TimeInput, Image } from "@heroui/react";
import { Modal } from "@heroui/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import { FiFilter } from "react-icons/fi";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import "../../../../styles/pages.css";
import { Scrollbars } from "react-custom-scrollbars-2";
import { useBabyData } from "../../../../hooks/useBabyData";
import API_URL from "../../../../config/api";
import Select from "../../../custom-select/CustomSelect";


export default function FeedingNotes() {
    const location = useLocation();
    const navigate = useNavigate();
    const { userData, babyData, selectedBaby, setSelectedBaby } = useBabyData(location.state);
    const [isOpen, setIsOpen] = useState(false);
    const [feedTime, setFeedTime] = useState("");
    const [feedDate, setFeedDate] = useState("");
    const [fedFrom, setFedFrom] = useState("");
    const [feedType, setFeedType] = useState("");
    const [feedAmount, setFeedAmount] = useState("");
    const [feedNotes, setFeedNotes] = useState("");
    const [feedingRecords, setFeedingRecords] = useState([]);
    const [feedingFilter, setFeedingFilter] = useState("date-desc");
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

        const fetchFeedingRecords = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/feeding`, {
                    params: { baby_id: selectedBaby.baby_id },
                    withCredentials: true,
                });
                setFeedingRecords(data);
            } catch (err) {
                console.error("Failed to fetch feeding records: ", err)
            }
        };

        fetchFeedingRecords();
    }, [selectedBaby]);

    const handleAddFeeding = async () => {
        setErrorMessage("");

        if (!feedTime || !feedDate || !fedFrom || !feedType || !feedAmount || !feedNotes) {
            setErrorMessage("Please fill out all fields.");
            return;
        }

        const amountFlOz = parseFloat(feedAmount);
        if (isNaN(amountFlOz) || amountFlOz <= 0) {
            setErrorMessage("Feeding amount must be a valid number greater than 0 (in fluid ounces).");
            return;
        }

        const formattedTime = `${String(feedTime.hour).padStart(2, "0")}:${String(feedTime.minute).padStart(2, "0")}`;

        try {
            if (editingRecord) {
                const { data: updatedRecord } = await axios.put(
                    `${API_URL}/api/feeding/${editingRecord.feeding_id}`,
                    {
                        baby_id: selectedBaby.baby_id,
                        time_fed: formattedTime,
                        date: feedDate,
                        fed_from: fedFrom,
                        type_of_food: feedType,
                        amount: amountFlOz,
                        notes: feedNotes,
                    },
                    { withCredentials: true }
                );

                setFeedingRecords((prev) =>
                    prev.map((record) =>
                        record.feeding_id === editingRecord.feeding_id
                            ? updatedRecord
                            : record
                    )
                );
            } else {
                const { data: newRecord } = await axios.post(
                    `${API_URL}/api/feeding`,
                    {
                        baby_id: selectedBaby.baby_id,
                        time_fed: formattedTime,
                        date: feedDate,
                        fed_from: fedFrom,
                        type_of_food: feedType,
                        amount: amountFlOz,
                        notes: feedNotes,
                        created_by_account_id: userData?.account_id,
                        created_by_first_name: userData?.first_name,
                        created_by_last_name: userData?.last_name,
                    },
                    { withCredentials: true }
                );

                setFeedingRecords((prev) => [...prev, newRecord]);
            }

            setFeedTime("");
            setFeedDate("");
            setFedFrom("");
            setFeedType("");
            setFeedAmount("");
            setFeedNotes("");
            setErrorMessage("");
            setEditingRecord(null);
            setIsOpen(false);
        } catch (err) {
            console.error("Failed to save feeding record: ", err);
            setErrorMessage("Failed to save feeding record");
        }
    };

    const handleEditFeeding = (record) => {
        setEditingRecord(record);
        const [hour, minute] = record.time_fed.split(":");
        setFeedTime({ hour: parseInt(hour), minute: parseInt(minute) });
        setFeedDate(record.date);
        setFedFrom(record.fed_from);
        setFeedType(record.type_of_food);
        setFeedAmount(record.amount.toString());
        setFeedNotes(record.notes);
        setIsOpen(true);
    };

    const handleDeleteFeeding = async () => {
        if (!recordToDelete) return;

        try {
            await axios.delete(
                `${API_URL}/api/feeding/${recordToDelete.feeding_id}`,
                { withCredentials: true }
            );

            setFeedingRecords((prev) =>
                prev.filter((record) => record.feeding_id !== recordToDelete.feeding_id)
            );

            setIsDeleteModalOpen(false);
            setRecordToDelete(null);
        } catch (err) {
            console.error("Failed to delete feeding record: ", err);
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

    const currentCategory = logCategories.find(cat => cat.value === "/feeding-notes");

    const sortFeedingRecords = (records) => {
        const sorted = [...records];
        switch (feedingFilter) {
            case "date-desc":
                return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
            case "date-asc":
                return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
            case "amount-high":
                return sorted.sort((a, b) => b.amount - a.amount);
            case "amount-low":
                return sorted.sort((a, b) => a.amount - b.amount);
            case "type-asc":
                return sorted.sort((a, b) => a.feed_type.localeCompare(b.feed_type));
            case "type-desc":
                return sorted.sort((a, b) => b.feed_type.localeCompare(a.feed_type));
            default:
                return sorted;
        }
    };

    return (
        <div className="mainDiv">
            <div className="header feedingHeader">
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
                    <h1>{selectedBaby?.first_name || "Baby"}'s Feeding</h1>
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
                        className="feedingButton"
                    >
                        <FiFilter className="filterIcon" />
                    </Button>
                    {isFilterOpen && (
                        <div className="filterDropdown">
                            {[
                                { value: 'date-desc', label: 'Newest First' },
                                { value: 'date-asc', label: 'Oldest First' },
                                { value: 'amount-high', label: 'Amount (High to Low)' },
                                { value: 'amount-low', label: 'Amount (Low to High)' },
                                { value: 'type-asc', label: 'Type (A-Z)' },
                                { value: 'type-desc', label: 'Type (Z-A)' }
                            ].map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() => {
                                        setFeedingFilter(option.value);
                                        setIsFilterOpen(false);
                                    }}
                                    className="filterOption"
                                    onMouseEnter={(e) => {
                                        if (feedingFilter !== option.value) {
                                            e.currentTarget.style.backgroundColor = '#f8f8f8';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (feedingFilter !== option.value) {
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
                    {feedingRecords.length === 0 ? (
                        <h1>No feeding records yet</h1>
                    ) : (
                        sortFeedingRecords(feedingRecords).map((record) => (
                            <Card className="cardEntry" key={record.feeding_id} shadow="sm">
                                <div className="cardEntryContent">
                                    <div className="cardEntryHeader">
                                        <h3 className="cardEntryTitle">
                                            {record.type_of_food}
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
                                        <span className="cardEntryDate">{new Date(record.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="cardEntryDetails">
                                        <div className="cardEntryDetail">
                                            <span className="cardEntryDetailLabel">Time Fed</span>
                                            <span className="cardEntryDetailValue">{formatTime12Hour(record.time_fed)}</span>
                                        </div>
                                        <div className="cardEntryDetail">
                                            <span className="cardEntryDetailLabel">Fed From</span>
                                            <span className="cardEntryDetailValue">{record.fed_from}</span>
                                        </div>
                                        <div className="cardEntryDetail">
                                            <span className="cardEntryDetailLabel">Amount</span>
                                            <span className="cardEntryDetailValue">{record.amount} fl oz</span>
                                        </div>
                                    </div>
                                    {record.notes && (
                                        <div>
                                            <span className="cardEntryDetailLabel">Notes</span>
                                            <p>{record.notes}</p>
                                        </div>
                                    )}
                                    {!isBabysitter && (
                                        <div className="editDeleteButtonContainer">
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="light"
                                                onPress={() => handleEditFeeding(record)}
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

            <Button className="addButton feedingButton" onPress={() => {
                setEditingRecord(null);
                setFeedTime("");
                setFeedDate("");
                setFedFrom("");
                setFeedType("");
                setFeedAmount("");
                setFeedNotes("");
                setErrorMessage("");
                setIsOpen(true);
            }}>
                Add
            </Button>

            <Navbar />

            <Modal isOpen={isOpen} onOpenChange={setIsOpen} className="modal">
                <ModalContent >
                    <ModalHeader className="modalHeader">
                        {editingRecord ? "Edit Feeding" : "Add Feeding"}
                    </ModalHeader>
                        <ModalBody className="modalBody">
                            {errorMessage && (
                                <p className="errorMessage">
                                    {errorMessage}
                                </p>
                            )}
                                <TimeInput
                                    variant="bordered"
                                    label="Feeding TIme" 
                                    value={feedTime}
                                    onChange={(newTime) => setFeedTime(newTime)}
                                />

                                <Input
                                    variant="bordered"
                                    label="Date"
                                    type="date"
                                    value={feedDate}
                                    onChange={(e) => setFeedDate(e.target.value)}
                                />

                                <div className="form-field">
                                    <label className="form-label">Fed From</label>
                                    <Select
                                        options={[
                                            { value: "bottle", label: "Bottle" },
                                            { value: "breast", label: "Breast" }
                                        ]}
                                        value={fedFrom ? {
                                            value: fedFrom,
                                            label: fedFrom === "bottle" ? "Bottle" : fedFrom === "breast" ? "Breast" : fedFrom
                                        } : null}
                                        onChange={(option) => setFedFrom(option ? option.value : "")}
                                        placeholder="Select where the baby was fed from"
                                    />
                                </div>

                                <div className="form-field">
                                    <label className="form-label">Type of Food</label>
                                    <Select
                                        options={[
                                            { value: "milk", label: "Milk" },
                                            { value: "water", label: "Water" },
                                            { value: "juice", label: "Juice" }
                                        ]}
                                        value={feedType ? { value: feedType, label: feedType.charAt(0).toUpperCase() + feedType.slice(1) } : null}
                                        onChange={(option) => setFeedType(option ? option.value : "")}
                                        placeholder="Select what type of food they had"
                                    />
                                </div>

                                <Input
                                    variant="bordered"
                                    label="Amount (fl oz)"
                                    placeholder="Amount in fluid ounces"
                                    type="number"
                                    step="0.1"
                                    min="0.1"
                                    max="100"
                                    onKeyDown={(e) => {
                                        const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End', '.'];
                                        if ((e.ctrlKey || e.metaKey) || allowedKeys.includes(e.key) || /^\d$/.test(e.key)) {
                                        if (e.key === '.' && e.target.value.includes('.')) e.preventDefault();
                                        return;
                                        }
                                        e.preventDefault();
                                    }}
                                    value={feedAmount}
                                    onChange={(e) => setFeedAmount(e.target.value)}
                                />

                                <Input
                                    variant="bordered"
                                    label="Notes"
                                    placeholder="Add any other important information"
                                    type="text"
                                    maxLength={1000}
                                    onKeyDown={(e) => {
                                        const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End', ' '];
                                        if ((e.ctrlKey || e.metaKey) || allowedKeys.includes(e.key) || /^[a-zA-Z0-9.,!?\-'():;" ]$/.test(e.key)) return;
                                        e.preventDefault();
                                    }}
                                    value={feedNotes}
                                    onChange={(e) => setFeedNotes(e.target.value)}
                                /> 
                        </ModalBody>
                    <ModalFooter className="modalFooter">
                        <Button onPress={() => {
                            setIsOpen(false);
                            setEditingRecord(null);
                            setFeedTime("");
                            setFeedDate("");
                            setFedFrom("");
                            setFeedType("");
                            setFeedAmount("");
                            setFeedNotes("");
                            setErrorMessage("");
                        }}>
                            Cancel
                        </Button>

                        <Button onPress={handleAddFeeding}>
                            {editingRecord ? "Save" : "Add"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} className="modal">
                <ModalContent>
                    <ModalHeader className="modalHeader">
                        Delete Feeding Entry
                    </ModalHeader>
                    <ModalBody className="modalBody">
                        <p>Are you sure you want to delete this feeding entry? This action cannot be undone.</p>
                    </ModalBody>
                    <ModalFooter className="modalFooter">
                        <Button onPress={() => {
                            setIsDeleteModalOpen(false);
                            setRecordToDelete(null);
                        }}>
                            Cancel
                        </Button>
                        <Button color="danger" onPress={handleDeleteFeeding}>
                            Delete
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
