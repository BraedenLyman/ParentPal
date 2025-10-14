import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Image, Card } from "@heroui/react";
import { ArrowLeftIcon, ChevronRightIcon, BellAlertIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import Navbar from "../../nav-bar/navbar";
import { useFCMToken } from "../../../hooks/useFCMToken";
import "./settings.css";
import { FiBell } from "react-icons/fi";

export default function Notifications() {
    const navigate = useNavigate();
    const { permissionStatus, requestPermission } = useFCMToken();
    const [isRequesting, setIsRequesting] = useState(false);

    const handleEnableNotifications = async () => {
        setIsRequesting(true);
        try {
            const token = await requestPermission();
            if (token) {
                alert("Push notifications enabled successfully!");
            } else {
                alert("Failed to enable notifications. Please check your browser settings.");
            }
        } catch (error) {
            console.error("Error requesting permission:", error);
            alert("An error occurred while enabling notifications.");
        } finally {
            setIsRequesting(false);
        }
    };

    const getPermissionStatusInfo = () => {
        switch (permissionStatus) {
            case 'granted':
                return {
                    icon: <CheckCircleIcon className="w-6 h-6 text-green-600" />,
                    text: "Push notifications are enabled",
                    color: "success"
                };
            case 'denied':
                return {
                    icon: <XCircleIcon className="w-6 h-6 text-red-600" />,
                    text: "Push notifications are blocked. Please enable them in your browser settings.",
                    color: "danger"
                };
            default:
                return {
                    icon: <BellAlertIcon className="w-6 h-6 text-orange-600" />,
                    text: "Enable push notifications to receive alerts",
                    color: "warning"
                };
        }
    };

    const statusInfo = getPermissionStatusInfo();

    return (
        <div className="settings-container">
            <div className="header">
                <div className="headerContainer">
                    <Button
                        isIconOnly
                        variant="light"
                        onPress={() => navigate("/settings")}
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
                    <h1>Notifications</h1>
                </div>
            </div>

            <div className="settings-cards-container">
                <Card
                    shadow="sm"
                    className="settings-option-card"
                    style={{
                        marginBottom: '1rem',
                        border: permissionStatus === 'granted' ? '2px solid #22c55e' :
                                permissionStatus === 'denied' ? '2px solid #ef4444' :
                                '2px solid #f97316'
                    }}
                >
                    <div style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                            {statusInfo.icon}
                            <span style={{ fontWeight: '600', fontSize: '1rem' }}>
                                Push Notifications
                            </span>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1rem' }}>
                            {statusInfo.text}
                        </p>
                        {permissionStatus !== 'granted' && permissionStatus !== 'denied' && (
                            <Button
                                color="primary"
                                onPress={handleEnableNotifications}
                                isLoading={isRequesting}
                                fullWidth
                            >
                                Enable Push Notifications
                            </Button>
                        )}
                        {permissionStatus === 'denied' && (
                            <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.5rem' }}>
                                To enable notifications, go to your browser settings and allow notifications for this site.
                            </p>
                        )}
                    </div>
                </Card>

                <Card
                    isPressable
                    shadow="sm"
                    className="settings-option-card"
                    onPress={() => navigate("/settings/notifications/preferences")}
                >
                    <div className="settings-card-content">
                        <span className="settings-card-title">Notification Preferences</span>
                        <ChevronRightIcon className="settings-arrow-icon" />
                    </div>
                </Card>

                <Card
                    isPressable
                    shadow="sm"
                    className="settings-option-card"
                    onPress={() => navigate("/settings/notifications/custom")}
                >
                    <div className="settings-card-content">
                        <span className="settings-card-title">Custom Notifications</span>
                        <ChevronRightIcon className="settings-arrow-icon" />
                    </div>
                </Card>
            </div>

            <Navbar />
        </div>
    );
}
