import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Image, Card, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Select, SelectItem, Textarea } from "@heroui/react";
import { ArrowLeftIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Navbar from "../../nav-bar/navbar";
import { auth } from "../../../firebase/firebaseAuth";
import axios from "axios";
import API_URL from "../../../config/api";
import "./settings.css";
import { FiBell } from "react-icons/fi";

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
                await axios.put(
                    `${API_URL}/api/custom-notifications/${editingNotification.custom_notification_id}`,
                    formData,
                    { withCredentials: true }
                );
            } else {
                await axios.post(
                    `${API_URL}/api/custom-notifications`,
                    { ...formData, parent_id: accountId },
                    { withCredentials: true }
                );
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

            <div className="settings-content custom-notifications-content">
                <Button
                    color="primary"
                    onPress={() => handleOpenModal()}
                    className="add-notification-button"
                >
                    Add Custom Notification
                </Button>

                {loading ? (
                    <p>Loading notifications...</p>
                ) : notifications.length === 0 ? (
                    <p className="no-notifications-message">
                        No custom notifications yet. Click "Add Custom Notification" to create one.
                    </p>
                ) : (
                    <div className="notifications-list">
                        {notifications.map((notification) => (
                            <Card
                                key={notification.custom_notification_id}
                                shadow="sm"
                                className="notification-card"
                            >
                                <div className="notification-card-layout">
                                    <div className="notification-details">
                                        <div className="notification-header">
                                            <span className="notification-baby-name">
                                                {notification.baby_first_name}
                                            </span>
                                            <span className="notification-type-badge">
                                                {notification.notification_type}
                                            </span>
                                        </div>
                                        <p className="notification-datetime">
                                            {formatDate(notification.date)} @ {formatTime(notification.time)}
                                        </p>
                                        {notification.notes && (
                                            <p className="notification-notes">
                                                {notification.notes}
                                            </p>
                                        )}
                                    </div>
                                    <div className="notification-actions">
                                        <Button
                                            isIconOnly
                                            variant="light"
                                            size="sm"
                                            onPress={() => handleOpenModal(notification)}
                                        >
                                            <PencilIcon className="w-5 h-5" />
                                        </Button>
                                        <Button
                                            isIconOnly
                                            variant="light"
                                            size="sm"
                                            color="danger"
                                            onPress={() => handleDelete(notification.custom_notification_id)}
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onOpenChange={handleCloseModal} className="settings-modal">
                <ModalContent>
                    <ModalHeader>
                        {editingNotification ? "Edit Custom Notification" : "Add Custom Notification"}
                    </ModalHeader>
                    <ModalBody>
                        <div className="modal-form">
                            <Select
                                label="Type of Notification"
                                placeholder="Select baby/sitter"
                                selectedKeys={formData.baby_id ? [formData.baby_id.toString()] : []}
                                onChange={(e) => setFormData({ ...formData, baby_id: parseInt(e.target.value) })}
                            >
                                {babies.map((baby) => (
                                    <SelectItem key={baby.baby_id} value={baby.baby_id}>
                                        {baby.first_name} {baby.last_name}
                                    </SelectItem>
                                ))}
                            </Select>

                            <Select
                                label="Type of Notification"
                                placeholder="Select type"
                                selectedKeys={formData.notification_type ? [formData.notification_type] : []}
                                onChange={(e) => setFormData({ ...formData, notification_type: e.target.value })}
                            >
                                {notificationTypes.map((type) => (
                                    <SelectItem key={type.key} value={type.key}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </Select>

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
