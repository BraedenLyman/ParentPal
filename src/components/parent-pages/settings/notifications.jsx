import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Image } from "@heroui/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
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

            <div className="settings-content">
                <p>Notification settings</p>
            </div>

            <Navbar />
        </div>
    );
}