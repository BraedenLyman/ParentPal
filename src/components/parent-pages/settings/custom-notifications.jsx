import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Image, Card, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Textarea, Avatar } from "@heroui/react";
import { ArrowLeftIcon, PencilIcon, TrashIcon, CheckCircleIcon, ClockIcon, PlusIcon } from "@heroicons/react/24/outline";
import Navbar from "../../nav-bar/navbar";
import { auth } from "../../../firebase/firebaseAuth";
import axios from "axios";
import API_URL from "../../../config/api";
import "./settings.css";
import { FiBell } from "react-icons/fi";
import Select from "../../custom-select/CustomSelect";

export default function CustomNotifications() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNotification, setEditingNotification] = useState(null);
    const [accountId, setAccountId] = useState(null);
    const [babies, setBabies] = useState([]);

    const [formData, setFormData] = useState({
        baby_id: "",
        notification_type: "",
        date: "",
        time: "",
        notes: ""
    });

    const notificationTypes = [
        { key: "sleep", label: "Sleep" },
        { key: "feeding", label: "Feeding" },
        { key: "doctors", label: "Doctors" },
        { key: "games", label: "Games" },
        { key: "playdates", label: "Playdates" }
    ];

    useEffect(() => {
        const fetchData = async () => {
            const currentUser = auth.currentUser;
            if (!currentUser) return;

            try {
                const idToken = await currentUser.getIdToken();
                const userResponse = await axios.post(
                    `${API_URL}/api/sign-in`,
                    { idToken },
                    { withCredentials: true }
                );

                const userId = userResponse.data.user.account_id;
                setAccountId(userId);

                const babiesResponse = await axios.get(
                    `${API_URL}/api/babies/${userId}`,
                    { withCredentials: true }
                );
                setBabies(babiesResponse.data);

                const notificationsResponse = await axios.get(
                    `${API_URL}/api/custom-notifications/${userId}`,
                    { withCredentials: true }
                );
                setNotifications(notificationsResponse.data);

                if (babiesResponse.data.length > 0) {
                    setFormData(prev => ({ ...prev, baby_id: babiesResponse.data[0].baby_id }));
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleOpenModal = (notification = null) => {
        if (notification) {
            setEditingNotification(notification);
            setFormData({
                baby_id: notification.baby_id,
                notification_type: notification.notification_type,
                date: notification.date,
                time: notification.time,
                notes: notification.notes || ""
            });
        } else {
            setEditingNotification(null);
            setFormData({
                baby_id: babies.length > 0 ? babies[0].baby_id : "",
                notification_type: "",
                date: "",
                time: "",
                notes: ""
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingNotification(null);
        setFormData({
            baby_id: babies.length > 0 ? babies[0].baby_id : "",
            notification_type: "",
            date: "",
            time: "",
            notes: ""
        });
    };

    const handleSubmit = async () => {
        if (!formData.baby_id || !formData.notification_type || !formData.date || !formData.time) {
            alert("Please fill in all required fields");
            return;
        }

        try {
            if (editingNotification) {
                const updateResponse = await axios.put(
                    `${API_URL}/api/custom-notifications/${editingNotification.custom_notification_id}`,
                    formData,
                    { withCredentials: true }
                );

                if (updateResponse.data.willBeSent) {
                    alert("Notification updated and scheduled to be sent at the new time!");
                } else {
                    alert("Notification updated. Note: Past date/time will not trigger notification.");
                }
            } else {
                await axios.post(
                    `${API_URL}/api/custom-notifications`,
                    { ...formData, parent_id: accountId },
                    { withCredentials: true }
                );
                alert("Notification created successfully!");
            }

            const response = await axios.get(
                `${API_URL}/api/custom-notifications/${accountId}`,
                { withCredentials: true }
            );
            setNotifications(response.data);
            handleCloseModal();
        } catch (error) {
            console.error("Error saving notification:", error);
            alert("Failed to save notification");
        }
    };

    const handleDelete = async (notificationId) => {
        if (!confirm("Are you sure you want to delete this notification?")) {
            return;
        }

        try {
            await axios.delete(
                `${API_URL}/api/custom-notifications/${notificationId}`,
                { withCredentials: true }
            );

            const response = await axios.get(
                `${API_URL}/api/custom-notifications/${accountId}`,
                { withCredentials: true }
            );
            setNotifications(response.data);
        } catch (error) {
            console.error("Error deleting notification:", error);
            alert("Failed to delete notification");
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    const getNotificationTypeColor = (type) => {
        const colors = {
            sleep: {
                background: '#ede9fe', 
                text: '#7c3aed'       
            },
            feeding: {
                background: '#dbeafe', 
                text: '#2563eb'       
            },
            doctors: {
                background: '#fee2e2',
                text: '#dc2626'      
            },
            games: {
                background: '#d1fae5',
                text: '#059669'       
            },
            playdates: {
                background: '#fef3c7',
                text: '#d97706'      
            }
        };
        return colors[type] || { background: '#f3f4f6', text: '#6b7280' };
    };

    return (
        <div className="settings-container">
            <div className="header">
                <div className="headerContainer">
                    <Button
                        isIconOnly
                        variant="light"
                        onPress={() => navigate("/settings/notifications")}
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
                    <h1>Custom Notifications</h1>
                </div>
            </div>

            <div className="settings-content">
                <div className="babysitter-section">
                    <div className="section-header">
                        
                        <Button
                            color="primary"
                            onPress={() => handleOpenModal()}
                            startContent={<PlusIcon className="w-4 h-4" />}
                        >
                            Add Custom Notification
                        </Button>
                    </div>

                    {loading ? (
                        <p>Loading notifications...</p>
                    ) : notifications.length > 0 ? (
                        <div className="babysitter-list">
                            {notifications.map((notification) => (
                                <Card key={notification.custom_notification_id} className="babysitter-card-wrapper">
                                    <div className="card-actions">
                                        <Button
                                            isIconOnly
                                            variant="light"
                                            onPress={() => handleOpenModal(notification)}
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            isIconOnly
                                            color="danger"
                                            variant="light"
                                            onPress={() => handleDelete(notification.custom_notification_id)}
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="card-content">
                                        <div className="babysitter-info">
                                            <Avatar
                                                name={notification.baby_first_name?.charAt(0) || "?"}
                                                size="md"
                                            />
                                            <div className="info">
                                                <h3>{notification.baby_first_name}</h3>
                                                <p>{formatDate(notification.date)} @ {formatTime(notification.time)}</p>
                                                <div className="notification-badges">
                                                    <span
                                                        className="notification-type-badge"
                                                        style={{
                                                            backgroundColor: getNotificationTypeColor(notification.notification_type).background,
                                                            color: getNotificationTypeColor(notification.notification_type).text
                                                        }}
                                                    >
                                                        {notification.notification_type}
                                                    </span>
                                                    <span className={`status ${notification.is_sent ? 'verified' : 'pending'}`}>
                                                        {notification.is_sent ? '✓ Sent' : '⏱ Pending'}
                                                    </span>
                                                </div>
                                                {notification.notes && (
                                                    <p className="notification-notes-text">{notification.notes}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="empty-state-card">
                            <div className="empty-state-content">
                                <p className="no-babysitters">
                                    No custom notifications yet. Click "Add Custom Notification" to create one.
                                </p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            <Modal isOpen={isModalOpen} onOpenChange={handleCloseModal} className="settings-modal">
                <ModalContent>
                    <ModalHeader>
                        {editingNotification ? "Edit Custom Notification" : "Add Custom Notification"}
                    </ModalHeader>
                    <ModalBody>
                        <div className="modal-form">
                            <div className="form-field">
                                <label className="form-label">Baby/Sitter</label>
                                <Select
                                    placeholder="Select baby/sitter"
                                    options={babies.map((baby) => ({
                                        value: baby.baby_id,
                                        label: `${baby.first_name} ${baby.last_name}`
                                    }))}
                                    value={babies.find(baby => baby.baby_id === formData.baby_id) ? {
                                        value: formData.baby_id,
                                        label: `${babies.find(b => b.baby_id === formData.baby_id).first_name} ${babies.find(b => b.baby_id === formData.baby_id).last_name}`
                                    } : null}
                                    onChange={(option) => setFormData({ ...formData, baby_id: option ? option.value : "" })}
                                />
                            </div>

                            <div className="form-field">
                                <label className="form-label">Type of Notification</label>
                                <Select
                                    placeholder="Select type"
                                    options={notificationTypes.map((type) => ({
                                        value: type.key,
                                        label: type.label
                                    }))}
                                    value={formData.notification_type ? {
                                        value: formData.notification_type,
                                        label: notificationTypes.find(t => t.key === formData.notification_type)?.label
                                    } : null}
                                    onChange={(option) => setFormData({ ...formData, notification_type: option ? option.value : "" })}
                                />
                            </div>

                            <Input
                                type="date"
                                label="Date"
                                placeholder="YYYY/MM/DD"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />

                            <Input
                                type="time"
                                label="Time"
                                placeholder="HH:MM"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            />

                            <Textarea
                                label="Notes"
                                placeholder="Any extra important information"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="primary"
                            onPress={handleSubmit}
                            className="modal-button"
                        >
                            {editingNotification ? "Update" : "Add"}
                        </Button>
                        <Button
                            color="danger"
                            onPress={handleCloseModal}
                            className="modal-button"
                        >
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Navbar />
        </div>
    );
}
