import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Image, Card, Switch } from "@heroui/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Navbar from "../../nav-bar/navbar";
import { auth } from "../../../firebase/firebaseAuth";
import axios from "axios";
import API_URL from "../../../config/api";
import "./settings.css";
import { FiBell } from "react-icons/fi";

export default function NotificationPreferences() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [accountId, setAccountId] = useState(null);
    const [preferences, setPreferences] = useState({
        sleep_reminders: true,
        feeding_reminders: true,
        doctors_appointments: true,
        games_development: true,
        playdates_development: true
    });

    useEffect(() => {
        const fetchPreferences = async () => {
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

                const response = await axios.get(
                    `${API_URL}/api/notification-preferences/${userId}`,
                    { withCredentials: true }
                );

                setPreferences({
                    sleep_reminders: response.data.sleep_reminders,
                    feeding_reminders: response.data.feeding_reminders,
                    doctors_appointments: response.data.doctors_appointments,
                    games_development: response.data.games_development,
                    playdates_development: response.data.playdates_development
                });
            } catch (error) {
                console.error("Error fetching notification preferences:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPreferences();
    }, []);

    const handleToggle = async (key) => {
        const newPreferences = {
            ...preferences,
            [key]: !preferences[key]
        };
        setPreferences(newPreferences);
        setSaving(true);
        
        try {
            await axios.put(
                `${API_URL}/api/notification-preferences/${accountId}`,
                newPreferences,
                { withCredentials: true }
            );
        } catch (error) {
            console.error("Error saving notification preferences:", error);
            setPreferences(preferences);
        } finally {
            setSaving(false);
        }
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
                    <h1>Notification Preferences</h1>
                </div>
            </div>

            <div className="settings-content preferences-content">
                {loading ? (
                    <p>Loading preferences...</p>
                ) : (
                    <>
                        <Card shadow="sm" className="preference-card">
                            <h3 className="preference-section-title">Reminders</h3>
                            <div className="preference-item">
                                <span>Sleep</span>
                                <Switch
                                    isSelected={preferences.sleep_reminders}
                                    onValueChange={() => handleToggle("sleep_reminders")}
                                    color="secondary"
                                />
                            </div>
                            <div className="preference-item">
                                <span>Feeding</span>
                                <Switch
                                    isSelected={preferences.feeding_reminders}
                                    onValueChange={() => handleToggle("feeding_reminders")}
                                    color="secondary"
                                />
                            </div>
                        </Card>

                        <Card shadow="sm" className="preference-card">
                            <h3 className="preference-section-title">Appointments</h3>
                            <div className="preference-item">
                                <span>Doctors</span>
                                <Switch
                                    isSelected={preferences.doctors_appointments}
                                    onValueChange={() => handleToggle("doctors_appointments")}
                                    color="secondary"
                                />
                            </div>
                        </Card>

                        <Card shadow="sm" className="preference-card">
                            <h3 className="preference-section-title">Development</h3>
                            <div className="preference-item">
                                <span>Games</span>
                                <Switch
                                    isSelected={preferences.games_development}
                                    onValueChange={() => handleToggle("games_development")}
                                    color="secondary"
                                />
                            </div>
                            <div className="preference-item">
                                <span>Playdates</span>
                                <Switch
                                    isSelected={preferences.playdates_development}
                                    onValueChange={() => handleToggle("playdates_development")}
                                    color="secondary"
                                />
                            </div>
                        </Card>

                        {saving && (
                            <p className="saving-message">
                                Saving...
                            </p>
                        )}
                    </>
                )}
            </div>

            <Navbar />
        </div>
    );
}
