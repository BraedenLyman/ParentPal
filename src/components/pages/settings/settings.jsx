import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Card, Avatar, Image } from "@heroui/react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { auth } from "../../../firebase/firebaseAuth";
import { deleteUser, signOut } from "firebase/auth";
import axios from "axios";
import Navbar from "../nav-bar/navbar";
import API_URL from "../../../config/api";
import "./settings.css";
import { FiBell } from "react-icons/fi";

export default function Settings() {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const currentUser = auth.currentUser;
            if (!currentUser) return;

            try {
                const idToken = await currentUser.getIdToken();
                const response = await axios.post(
                    `${API_URL}/api/sign-in`,
                    { idToken },
                    { withCredentials: true }
                );
                setUserData(response.data.user);
            } catch (error) {
                console.error("Error fetching user data: ", error);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/sign-in");
        } catch (error) {
            console.error("Error logging out: ", error);
            alert("Failed to log out. Please try again.");
        }
    };

    const handleDeleteAccount = async () => {
        const user = auth.currentUser;
        if (!user) {
            alert("No user found. Please log in again.");
            return;
        }

        try {
            console.log("Starting account deletion for user:", user.uid);
            console.log("Deleting from database...");

            await axios.delete(`${API_URL}/api/user`, {
                params: { firebase_uid: user.uid },
                withCredentials: true,
            });

            console.log("Database deletion successful");
            console.log("Deleting from Firebase...");

            await deleteUser(user);
            console.log("Firebase deletion successful");
            navigate("/sign-in");

        } catch (error) {
            console.error("Error deleting account: ", error);

            if (error.response) {
                console.error("Database deletion failed:", error.response.data);
                alert(`Failed to delete account from database: ${error.response.data.message || error.response.statusText}`);
            } else if (error.code) {
                console.error("Firebase deletion failed:", error.code, error.message);
                alert(`Failed to delete Firebase account: ${error.message}`);
            } else {
                alert("Failed to delete account. Please try again.");
            }
        }
    };

    return (
        <>
            <div className="settings-container">
                <div className="header">
                    <div className="headerContainer">
                        <Avatar
                            className="avatar"
                            name={userData?.first_name?.charAt(0)?.toUpperCase() || ""}
                        />
                        <Image
                            alt="Parent Pal Logo"
                            src="/images/ParentPal.png"
                            width={80}
                            className="logo"
                        />
                        <FiBell className="notification" />
                    </div>
                    <div className="headerTitle">
                        <h1>Settings</h1>
                    </div>
                </div>

                <div className="settings-cards-container">
                    <Card
                        isPressable
                        shadow="sm"
                        className="settings-option-card"
                        onPress={() => navigate("/settings/personal-information")}
                    >
                        <div className="settings-card-content">
                            <span className="settings-card-title">Personal Information</span>
                            <ChevronRightIcon className="settings-arrow-icon" />
                        </div>
                    </Card>

                    {userData?.account_type === "parent" && (
                        <Card
                            isPressable
                            shadow="sm"
                            className="settings-option-card"
                            onPress={() => navigate("/settings/shared-accounts")}
                        >
                            <div className="settings-card-content">
                                <span className="settings-card-title">Shared Accounts</span>
                                <ChevronRightIcon className="settings-arrow-icon" />
                            </div>
                        </Card>
                    )}

                    {userData?.account_type === "babysitter" && (
                        <Card
                            isPressable
                            shadow="sm"
                            className="settings-option-card"
                            onPress={() => navigate("/settings/babysitter-shared-accounts")}
                        >
                            <div className="settings-card-content">
                                <span className="settings-card-title">Shared Accounts</span>
                                <ChevronRightIcon className="settings-arrow-icon" />
                            </div>
                        </Card>
                    )}

                    {userData?.account_type === "parent" && (
                        <Card
                            isPressable
                            shadow="sm"
                            className="settings-option-card"
                            onPress={() => navigate("/settings/data-export")}
                        >
                            <div className="settings-card-content">
                                <span className="settings-card-title">Data Export</span>
                                <ChevronRightIcon className="settings-arrow-icon" />
                            </div>
                        </Card>
                    )}
                </div>

                <div className="settings-buttons-container">
                    <Button
                        color="danger"
                        onPress={() => setIsDeleteModalOpen(true)}
                        className="settings-button"
                    >
                        Delete Account
                    </Button>

                    <Button
                        color="primary"
                        onPress={handleLogout}
                        className="settings-button"
                    >
                        Log Out
                    </Button>
                </div>

                <Modal isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} className="settings-modal">
                    <ModalContent>

                        <ModalHeader>
                            Delete Account
                        </ModalHeader>

                        <ModalBody>
                            <p>Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.</p>
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                variant="light"
                                onPress={() => setIsDeleteModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="danger"
                                onPress={() => {
                                    setIsDeleteModalOpen(false);
                                    handleDeleteAccount();
                                }}
                            >
                                Yes, Delete Account
                            </Button>
                        </ModalFooter>
                        
                    </ModalContent>
                </Modal>
            </div>
            <Navbar/>
        </>
    );
}