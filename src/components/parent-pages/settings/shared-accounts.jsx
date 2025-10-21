import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Image, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Card, Avatar, useDisclosure } from "@heroui/react";
import { ArrowLeftIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Navbar from "../../nav-bar/navbar";
import "./settings.css";
import { FiBell } from "react-icons/fi";
import axios from "axios";
import { auth } from "../../../firebase/firebaseAuth";
import API_URL from "../../../config/api";

export default function SharedAccounts() {
    const navigate = useNavigate();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [babysitterName, setBabysitterName] = useState("");
    const [babysitterEmail, setBabysitterEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [babysitters, setBabysitters] = useState([]);
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchUserDataAndBabysitters();
    }, []);

    const fetchUserDataAndBabysitters = async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        try {
            const idToken = await currentUser.getIdToken();
            const response = await axios.post(
                `${API_URL}/api/sign-in`,
                { idToken },
                { withCredentials: true }
            );

            const { user } = response.data;
            setUserData(user);

            const babysittersResponse = await axios.get(
                `${API_URL}/api/babysitter-sharing/babysitters/${user.account_id}`,
                { withCredentials: true }
            );
            setBabysitters(babysittersResponse.data.babysitters);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleSendInvitation = async () => {
        if (!babysitterName || !babysitterEmail || !userData) {
            setError("Please fill in all fields");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await axios.post(
                `${API_URL}/api/babysitter-sharing/invite`,
                {
                    parent_id: userData.account_id,
                    babysitter_email: babysitterEmail,
                    babysitter_name: babysitterName
                },
                { withCredentials: true }
            );

            setBabysitterName("");
            setBabysitterEmail("");
            onOpenChange();

            await fetchUserDataAndBabysitters();
        } catch (error) {
            setError(error.response?.data?.error || "Failed to send invitation");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveBabysitter = async (shareId) => {
        try {
            await axios.delete(
                `${API_URL}/api/babysitter-sharing/remove/${shareId}`,
                {
                    data: { parent_id: userData.account_id },
                    withCredentials: true
                }
            );

            await fetchUserDataAndBabysitters();
        } catch (error) {
            console.error("Error removing babysitter:", error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

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
                    <h1>Shared Accounts</h1>
                </div>
            </div>

            <div className="settings-content">
                <div className="babysitter-section">
                    <div className="section-header">
                        <Button
                            color="primary"
                            size="lg"
                            onPress={onOpen}
                            startContent={<PlusIcon className="w-5 h-5" />}
                            className="add-babysitter-button"
                        >
                            Add Babysitter
                        </Button>
                    </div>

                    {babysitters.length > 0 ? (
                        <div className="babysitter-list">
                            {babysitters.map((babysitter) => (
                                <Card key={babysitter.share_id} className="babysitter-card-wrapper">
                                    <div className="card-content">
                                        <div className="babysitter-info">
                                            <Avatar
                                                name={babysitter.babysitter_name.charAt(0)}
                                                size="md"
                                            />
                                            <div className="info">
                                                <h3>{babysitter.babysitter_name}</h3>
                                                <p>{babysitter.babysitter_email}</p>
                                                <p className={`status ${babysitter.is_verified ? 'verified' : 'pending'}`}>
                                                    {babysitter.is_verified
                                                        ? `Verified on ${formatDate(babysitter.verified_at)}`
                                                        : `Invited on ${formatDate(babysitter.created_at)} - Pending`
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        <div className="card-actions">
                                            <Button
                                                isIconOnly
                                                color="danger"
                                                variant="light"
                                                onPress={() => handleRemoveBabysitter(babysitter.share_id)}
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="empty-state-card">
                            <div className="empty-state-content">
                                <p className="no-babysitters">No babysitters added yet. Add a babysitter to share your child's information.</p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Add Babysitter
                            </ModalHeader>
                            <ModalBody>
                                <Input
                                    label="Babysitter Name"
                                    placeholder="Enter babysitter's full name"
                                    value={babysitterName}
                                    onChange={(e) => setBabysitterName(e.target.value)}
                                    variant="bordered"
                                />
                                <Input
                                    label="Email Address"
                                    placeholder="Enter babysitter's email"
                                    type="email"
                                    value={babysitterEmail}
                                    onChange={(e) => setBabysitterEmail(e.target.value)}
                                    variant="bordered"
                                />
                                {error && (
                                    <p className="text-danger text-sm">{error}</p>
                                )}
                                <p className="text-sm text-gray-600">
                                    The babysitter will receive an email with a verification code to access your child's information.
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={handleSendInvitation}
                                    isLoading={loading}
                                >
                                    Send Share Link
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <Navbar />
        </div>
    );
}