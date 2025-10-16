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

    const handleEnableNotifications = async () => {
        try {
            // Temporarily hide sticky header to prevent z-index conflicts on mobile
            const header = document.querySelector('.header');
            const originalPosition = header?.style.position;
            const originalZIndex = header?.style.zIndex;

            if (header) {
                header.style.position = 'relative';
                header.style.zIndex = '1';
            }

            const token = await requestPermission();

            // Restore header styles
            if (header) {
                header.style.position = originalPosition;
                header.style.zIndex = originalZIndex;
            }

            if (token) {
                alert("Push notifications enabled successfully!");
            } else {
                alert("Failed to enable notifications. Please check your browser settings.");
            }
        } catch (error) {
            console.error("Error requesting permission:", error);
            // Restore header styles on error
            const header = document.querySelector('.header');
            if (header) {
                header.style.position = '';
                header.style.zIndex = '';
            }
            alert("An error occurred while enabling notifications.");
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
                {permissionStatus !== 'granted' && (
                    <Card
                        shadow="sm"
                        className="settings-option-card"
                        style={{
                            border: permissionStatus === 'denied' ? '2px solid #ef4444' : '2px solid #f97316'
                        }}
                    >
                        <div className="settings-card-content" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {statusInfo.icon}
                                    <span className="settings-card-title">
                                        {permissionStatus === 'denied' ? 'Push Notifications Blocked' : 'Enable Push Notifications'}
                                    </span>
                                </div>
                                {permissionStatus === 'denied' && (
                                    <span style={{ fontSize: '0.75rem', color: '#999' }}>Check browser settings</span>
                                )}
                            </div>
                            {permissionStatus === 'default' && (
                                <Button
                                    color="warning"
                                    onPress={handleEnableNotifications}
                                    style={{ width: '100%', marginTop: '0.5rem' }}
                                >
                                    Allow Notifications
                                </Button>
                            )}
                        </div>
                    </Card>
                )}

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
