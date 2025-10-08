import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Image, Card } from "@heroui/react";
import { ArrowLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Navbar from "../../nav-bar/navbar";
import "./settings.css";
import { FiBell } from "react-icons/fi";

export default function Notifications() {
    const navigate = useNavigate();

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