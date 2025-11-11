import React from "react";
import axios from "axios";
import Navbar from "../../nav-bar/navbar";
import { Button, Card, Input, ModalBody, ModalContent, ModalFooter, ModalHeader, Image } from "@heroui/react";
import { Modal } from "@heroui/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import { FiFilter } from "react-icons/fi";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import "../../pages.css";
import { Scrollbars } from "react-custom-scrollbars-2";
import { useBabyData } from "../../../../hooks/useBabyData";
import API_URL from "../../../../config/api";
import Select from "../../../custom-select/CustomSelect";


export default function ObservationNotes() {
    const location = useLocation();
    const navigate = useNavigate();
    const { userData, babyData, selectedBaby, setSelectedBaby } = useBabyData(location.state);
    const [isOpen, setIsOpen] = useState(false);
    const [priorityLevel, setPriorityLevel] = useState("");
    const [obsNotes, setObsNotes] = useState("");
    const [observationRecords, setObservationRecords] = useState([]);
    const [observationFilter, setObservationFilter] = useState("date-desc");
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
        if (!selectedBaby) return;

        const fetchObservationRecords = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/observation`, {
                    params: { baby_id: selectedBaby.baby_id },
                    withCredentials: true,
                });
                setObservationRecords(data);
            } catch (err) {
                console.error("Failed to fetch observation records: ", err)
            }
        };

        fetchObservationRecords();
    }, [selectedBaby]);

    const handleAddObservation = async () => {
        setErrorMessage("");
        if (!priorityLevel || !obsNotes) {
            setErrorMessage("Please fill out all fields.");
            return;
        }

        try {
            if (editingRecord) {
                const { data: updatedRecord } = await axios.put(
                    `${API_URL}/api/observation/${editingRecord.observation_id}`,
                    {
                        baby_id: selectedBaby.baby_id,
                        priority_level: priorityLevel,
                        notes: obsNotes,
                    },
                    { withCredentials: true }
                );

                setObservationRecords((prev) =>
                    prev.map((record) =>
                        record.observation_id === editingRecord.observation_id
                            ? updatedRecord
                            : record
                    )
                );
            } else {
                const { data: newRecord } = await axios.post(
                    `${API_URL}/api/observation`,
                    {
                        baby_id: selectedBaby.baby_id,
                        priority_level: priorityLevel,
                        notes: obsNotes,
                    },
                    { withCredentials: true }
                );

                setObservationRecords((prev) => [...prev, newRecord]);
            }

            setPriorityLevel("");
            setObsNotes("");
            setErrorMessage("");
            setEditingRecord(null);
            setIsOpen(false);
        } catch (err) {
            console.error("Failed to save observation record: ", err);
            setErrorMessage("Failed to save observation record")
        }
    };

    const handleEditObservation = (record) => {
        setEditingRecord(record);
        setPriorityLevel(record.priority_level);
        setObsNotes(record.notes);
        setIsOpen(true);
    };

    const handleDeleteObservation = async () => {
        if (!recordToDelete) return;

        try {
            await axios.delete(
                `${API_URL}/api/observation/${recordToDelete.observation_id}`,
                { withCredentials: true }
            );

            setObservationRecords((prev) =>
                prev.filter((record) => record.observation_id !== recordToDelete.observation_id)
            );

            setIsDeleteModalOpen(false);
            setRecordToDelete(null);
        } catch (err) {
            console.error("Failed to delete observation record: ", err);
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

    const currentCategory = logCategories.find(cat => cat.value === "/observation-notes");

    const sortObservationRecords = (records) => {
        const sorted = [...records];
        switch (observationFilter) {
            case "date-desc":
                return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            case "date-asc":
                return sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            case "priority-high":
                return sorted.sort((a, b) => {
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.priority_level] - priorityOrder[a.priority_level];
                });
            case "priority-low":
                return sorted.sort((a, b) => {
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    return priorityOrder[a.priority_level] - priorityOrder[b.priority_level];
                });
            default:
                return sorted;
        }
    };

    return (
        <div className="mainDiv">
            <div className="header observationHeader">
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
                    <h1>{selectedBaby?.first_name || "Baby"}'s Observation</h1>
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
                        className="observationButton"
                    >
                        <FiFilter className="filterIcon" />
                    </Button>
                    {isFilterOpen && (
                        <div className="filterDropdown">
                            {[
                                { value: 'date-desc', label: 'Newest First' },
                                { value: 'date-asc', label: 'Oldest First' },
                                { value: 'priority-high', label: 'Priority (High to Low)' },
                                { value: 'priority-low', label: 'Priority (Low to High)' }
                            ].map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() => {
                                        setObservationFilter(option.value);
                                        setIsFilterOpen(false);
                                    }}
                                    className="filterOption"
                                    onMouseEnter={(e) => {
                                        if (observationFilter !== option.value) {
                                            e.currentTarget.style.backgroundColor = '#f8f8f8';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (observationFilter !== option.value) {
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
                    {observationRecords.length === 0 ? (
                        <h1>No observation records yet</h1>
                    ) : (
                        sortObservationRecords(observationRecords).map((record) => (
                            <Card className="cardEntry" key={record.observation_id} shadow="sm">
                                <div className="cardEntryContent">
                                    <div className="cardEntryHeader">
                                        <h3 className="cardEntryTitle">Observation</h3>
                                        <span
                                            className="cardEntryDate"
                                            style={{
                                                backgroundColor: record.priority_level === 'high' ? '#fee' : record.priority_level === 'medium' ? '#ffeaa7' : '#d1f2eb',
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                textTransform: 'capitalize',
                                                fontWeight: '600'
                                            }}>
                                                {record.priority_level}
                                        </span>
                                    </div>
                                    <div>
                                        <p>{record.notes}</p>
                                    </div>
                                    <div className="editDeleteButtonContainer">
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="light"
                                            onPress={() => handleEditObservation(record)}
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
                        ))
                    )}
                </div>
            </Scrollbars>
            
            <Button className="addButton observationButton" onPress={() => {
                setEditingRecord(null);
                setPriorityLevel("");
                setObsNotes("");
                setErrorMessage("");
                setIsOpen(true);
            }}>
                Add
            </Button>

            <Navbar />

            <Modal isOpen={isOpen} onOpenChange={setIsOpen} className="modal">
                <ModalContent >
                    <ModalHeader className="modalHeader">
                        {editingRecord ? "Edit Observation" : "Add Observation"}
                    </ModalHeader>
                        <ModalBody className="modalBody">
                            {errorMessage && (
                                <p className="errorMessage">
                                    {errorMessage}
                                </p>
                            )}
                                <div className="form-field">
                                    <label className="form-label">Priority Level</label>
                                    <Select
                                        options={[
                                            { value: "low", label: "Low" },
                                            { value: "medium", label: "Medium" },
                                            { value: "high", label: "High" }
                                        ]}
                                        value={priorityLevel ? { value: priorityLevel, label: priorityLevel.charAt(0).toUpperCase() + priorityLevel.slice(1) } : null}
                                        onChange={(option) => setPriorityLevel(option ? option.value : "")}
                                        placeholder="Select priority level"
                                    />
                                </div>

                                <Input
                                    variant="bordered"
                                    label="Notes"
                                    placeholder="Describe what you notice"
                                    type="text"
                                    maxLength={2000}
                                    onKeyDown={(e) => {
                                        const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End', ' '];
                                        if ((e.ctrlKey || e.metaKey) || allowedKeys.includes(e.key) || /^[a-zA-Z0-9.,!?\-'():;" ]$/.test(e.key)) return;
                                        e.preventDefault();
                                    }}
                                    value={obsNotes}
                                    onChange={(e) => setObsNotes(e.target.value)}
                                />
                        </ModalBody>
                    <ModalFooter className="modalFooter">
                        <Button onPress={() => {
                            setIsOpen(false);
                            setEditingRecord(null);
                            setPriorityLevel("");
                            setObsNotes("");
                            setErrorMessage("");
                        }}>
                            Cancel
                        </Button>

                        <Button onPress={handleAddObservation}>
                            {editingRecord ? "Save" : "Add"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} className="modal">
                <ModalContent>
                    <ModalHeader className="modalHeader">
                        Delete Observation
                    </ModalHeader>
                    <ModalBody className="modalBody">
                        <p>Are you sure you want to delete this observation? This action cannot be undone.</p>
                    </ModalBody>
                    <ModalFooter className="modalFooter">
                        <Button onPress={() => {
                            setIsDeleteModalOpen(false);
                            setRecordToDelete(null);
                        }}>
                            Cancel
                        </Button>
                        <Button color="danger" onPress={handleDeleteObservation}>
                            Delete
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
