import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Avatar, Image, Card, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input } from "@heroui/react";
import { ArrowLeftIcon, PlusIcon, EyeIcon, EyeSlashIcon, TrashIcon } from "@heroicons/react/24/outline";
import { auth } from "../../../firebase/firebaseAuth";
import { updatePassword } from "firebase/auth";
import axios from "axios";
import Navbar from "../nav-bar/navbar";
import API_URL from "../../../config/api";
import "./settings.css";
import Select from "../../custom-select/CustomSelect";

export default function PersonalInformation() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [babyData, setBabyData] = useState([]);
    const [isAddBabyModalOpen, setIsAddBabyModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [babyToDelete, setBabyToDelete] = useState(null);
    const [newBaby, setNewBaby] = useState({
        firstName: "",
        lastName: "",
        birthDate: "",
        gender: "",
        customGender: "",
        category: ""
    });
    const [passwordData, setPasswordData] = useState({
        newPassword: "",
        confirmPassword: ""
    });
    const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState({
        newPassword: false,
        confirmPassword: false
    });
    const [passwordErrors, setPasswordErrors] = useState([]);
    const isBabysitter = userData?.account_type === "babysitter";

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
                setBabyData(response.data.babyData || []);
            } catch (error) {
                console.error("Error fetching user data: ", error);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        if (passwordTouched.newPassword && passwordData.newPassword) {
            const newErrors = [];
            if (passwordData.newPassword.length < 8) {
                newErrors.push("Password must be at least 8 characters long.");
            }
            if ((passwordData.newPassword.match(/[A-Z]/g) || []).length < 1) {
                newErrors.push("Password must include at least 1 upper case letter.");
            }
            if ((passwordData.newPassword.match(/[0-9]/g) || []).length < 1) {
                newErrors.push("Password must include at least 1 number.");
            }
            if ((passwordData.newPassword.match(/[^a-z0-9]/gi) || []).length < 1) {
                newErrors.push("Password must include at least 1 symbol.");
            }
            if (passwordTouched.confirmPassword && passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword) {
                newErrors.push("Passwords do not match.");
            }
            setPasswordErrors(newErrors);
        } else {
            setPasswordErrors([]);
        }
    }, [passwordData.newPassword, passwordData.confirmPassword, passwordTouched]);

    const handleAddBaby = async () => {
        if (!newBaby.firstName || !newBaby.lastName || !newBaby.birthDate || !newBaby.gender || !newBaby.category) {
            alert("Please fill out all fields.");
            return;
        }

        if (newBaby.gender === "other" && !newBaby.customGender.trim()) {
            alert("Please specify the custom gender.");
            return;
        }

        try {
            const user = auth.currentUser;
            if (!user) return;

            const response = await axios.post(
                `${API_URL}/api/babies`,
                {
                    parent_id: userData.account_id,
                    first_name: newBaby.firstName,
                    last_name: newBaby.lastName,
                    birth_date: newBaby.birthDate,
                    gender: newBaby.gender === "other" ? newBaby.customGender : newBaby.gender,
                    category: newBaby.category
                },
                { withCredentials: true }
            );

            setBabyData(prev => [...prev, response.data]);
            setNewBaby({ firstName: "", lastName: "", birthDate: "", gender: "", category: "" });
            setIsAddBabyModalOpen(false);
        } catch (error) {
            console.error("Error adding baby: ", error);
            alert("Failed to add baby. Please try again.");
        }
    };

    const handleChangePassword = async () => {
        setPasswordTouched({ newPassword: true, confirmPassword: true });

        if (!passwordData.newPassword || !passwordData.confirmPassword) {
            alert("Please fill out both password fields.");
            return;
        }

        if (passwordErrors.length > 0) {
            alert("Please fix the password validation errors before continuing.");
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("Passwords do not match. Please try again.");
            return;
        }

        try {
            const user = auth.currentUser;
            if (!user) {
                alert("No user found. Please log in again.");
                return;
            }

            await updatePassword(user, passwordData.newPassword);

            setPasswordData({ newPassword: "", confirmPassword: "" });
            setPasswordTouched({ newPassword: false, confirmPassword: false });
            setPasswordErrors([]);

            alert("Password updated successfully!");
        } catch (error) {
            console.error("Error updating password: ", error);

            if (error.code === 'auth/requires-recent-login') {
                alert("For security reasons, please log out and log back in before changing your password.");
            } else {
                alert("Failed to update password. Please try again.");
            }
        }
    };

    const handleDeleteBaby = (baby) => {
        setBabyToDelete(baby);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteBaby = async () => {
        if (!babyToDelete) return;

        try {
            await axios.delete(`${API_URL}/api/babies/${babyToDelete.baby_id}`, {
                withCredentials: true
            });

            setBabyData(prev => prev.filter(baby => baby.baby_id !== babyToDelete.baby_id));
            setIsDeleteModalOpen(false);
            setBabyToDelete(null);
        } catch (error) {
            console.error("Error deleting baby: ", error);
            alert("Failed to delete baby. Please try again.");
        }
    };

    const cancelDeleteBaby = () => {
        setIsDeleteModalOpen(false);
        setBabyToDelete(null);
    };

    return (
        <>
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
                    </div>
                    <div className="headerTitle">
                        <h1>Personal Info</h1>
                    </div>
                </div>
             
                <div className="settings-content">
                    <div className="personal-data-section">
                        <h2>Personal Data</h2>
                        <Input
                            label="Email Address"
                            disabled
                            value={userData?.email_address || "Loading..."}
                        />
                    </div>

                    {!isBabysitter && (
                        <div className="little-ones-section">
                            <h2>Your Little Ones</h2>
                            <div className="babies-grid">
                                {babyData.map((baby, index) => (
                                    <Card key={baby.baby_id || index} className="baby-card">
                                        <Button
                                            isIconOnly
                                            variant="light"
                                            size="sm"
                                            className="delete-baby-button"
                                            onPress={() => handleDeleteBaby(baby)}
                                        >
                                            <TrashIcon className="w-4 h-4 text-red-500" />
                                        </Button>
                                        <div className="baby-card-content">
                                            <Avatar
                                                name={baby.first_name?.charAt(0)?.toUpperCase() || ""}
                                                size="md"
                                                className="baby-avatar"
                                            />
                                            <div className="baby-info">
                                                <h3 className="baby-name">{baby.first_name}</h3>
                                                <p className="baby-dob">
                                                    {baby.birth_date
                                                        ? new Date(baby.birth_date).toLocaleDateString()
                                                        : "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                ))}

                                <Card
                                    isPressable
                                    className="baby-card add-baby-card"
                                    onPress={() => setIsAddBabyModalOpen(true)}
                                >
                                    <div className="baby-card-content add-baby-content">
                                        <PlusIcon className="add-baby-icon" />
                                        <p className="add-baby-text">Add Baby</p>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    )}

                    <div className="change-password-section">
                        <h2>Change Password</h2>
                        <div className="password-fields">
                            <Input
                                type={isNewPasswordVisible ? "text" : "password"}
                                label="New Password"
                                placeholder="Enter new password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                onBlur={() => setPasswordTouched(prev => ({ ...prev, newPassword: true }))}
                                isInvalid={passwordTouched.newPassword && passwordErrors.length > 0}
                                errorMessage={passwordTouched.newPassword && passwordErrors.length > 0 ? passwordErrors[0] : ""}
                                endContent={
                                    <button
                                        type="button"
                                        onClick={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
                                        className="focus:outline-none"
                                    >
                                        {isNewPasswordVisible ?
                                            <EyeSlashIcon className="w-5 h-5 text-gray-400" /> :
                                            <EyeIcon className="w-5 h-5 text-gray-400" />
                                        }
                                    </button>
                                }
                            />

                            <Input
                                type={isConfirmPasswordVisible ? "text" : "password"}
                                label="Confirm Password"
                                placeholder="Confirm new password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                onBlur={() => setPasswordTouched(prev => ({ ...prev, confirmPassword: true }))}
                                isInvalid={passwordTouched.confirmPassword && passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword}
                                errorMessage={passwordTouched.confirmPassword && passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword ? "Passwords do not match." : ""}
                                endContent={
                                    <button
                                        type="button"
                                        onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                                        className="focus:outline-none"
                                    >
                                        {isConfirmPasswordVisible ?
                                            <EyeSlashIcon className="w-5 h-5 text-gray-400" /> :
                                            <EyeIcon className="w-5 h-5 text-gray-400" />
                                        }
                                    </button>
                                }
                            />

                            <Button
                                color="primary"
                                size="lg"
                                onPress={handleChangePassword}
                                className="change-password-button"
                            >
                                Accept Changes
                            </Button>
                        </div>
                    </div>
                </div>

                <Modal isOpen={isAddBabyModalOpen} onOpenChange={setIsAddBabyModalOpen} className="settings-modal">
                    <ModalContent>

                        <ModalHeader>
                            Add New Baby
                        </ModalHeader>

                        <ModalBody>
                            <Input
                                label="First Name"
                                placeholder="Enter baby's first name"
                                value={newBaby.firstName}
                                onChange={(e) => setNewBaby(prev => ({ ...prev, firstName: e.target.value }))}
                            />

                            <Input
                                label="Last Name"
                                placeholder="Enter baby's last name"
                                value={newBaby.lastName}
                                onChange={(e) => setNewBaby(prev => ({ ...prev, lastName: e.target.value }))}
                            />

                            <Input
                                type="date"
                                label="Birth Date"
                                value={newBaby.birthDate}
                                onChange={(e) => setNewBaby(prev => ({ ...prev, birthDate: e.target.value }))}
                            />

                            <div className="form-field">
                                <label className="form-label">Gender</label>
                                <Select
                                    options={[
                                        { value: "male", label: "Male" },
                                        { value: "female", label: "Female" },
                                        { value: "other", label: "Other" }
                                    ]}
                                    value={newBaby.gender ? { value: newBaby.gender, label: newBaby.gender.charAt(0).toUpperCase() + newBaby.gender.slice(1) } : null}
                                    onChange={(option) => setNewBaby(prev => ({ ...prev, gender: option ? option.value : "" }))}
                                    placeholder="Select gender"
                                />
                            </div>

                            {newBaby.gender === "other" && (
                                <Input
                                    label="Other Gender"
                                    placeholder="Enter baby's gender"
                                    maxLength={10}
                                    value={newBaby.customGender}
                                    onChange={(e) => setNewBaby(prev => ({ ...prev, customGender: e.target.value }))}
                                />
                            )}

                            <div className="form-field">
                                <label className="form-label">Category</label>
                                <Select
                                    options={[
                                        { value: "Baby", label: "Baby (0–12 months old)" },
                                        { value: "Toddler", label: "Toddler (1–3 years old)" },
                                        { value: "Pre-Schooler", label: "Pre-Schooler (3–5 years old)" },
                                        { value: "Grade-Schooler", label: "Grade-Schooler (5–12 years old)" }
                                    ]}
                                    value={newBaby.category ? [
                                        { value: "Baby", label: "Baby (0–12 months old)" },
                                        { value: "Toddler", label: "Toddler (1–3 years old)" },
                                        { value: "Pre-Schooler", label: "Pre-Schooler (3–5 years old)" },
                                        { value: "Grade-Schooler", label: "Grade-Schooler (5–12 years old)" }
                                    ].find(opt => opt.value === newBaby.category) : null}
                                    onChange={(option) => setNewBaby(prev => ({ ...prev, category: option ? option.value : "" }))}
                                    placeholder="Select baby's category"
                                />
                            </div>
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                variant="light"
                                onPress={() => setIsAddBabyModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="primary"
                                onPress={handleAddBaby}
                            >
                                Add Baby
                            </Button>
                        </ModalFooter>

                    </ModalContent>
                </Modal>

                <Modal isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} className="settings-modal">
                    <ModalContent>
                        <ModalHeader>
                            Delete Baby
                        </ModalHeader>

                        <ModalBody>
                            <p>Are you sure you want to delete <strong>{babyToDelete?.first_name}</strong>?</p>
                            <p className="text-small text-red-500 mt-2">
                                This action cannot be undone. All records and data associated with this baby will be permanently deleted.
                            </p>
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                variant="light"
                                onPress={cancelDeleteBaby}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="danger"
                                onPress={confirmDeleteBaby}
                            >
                                Delete
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
            <Navbar />
        </>
    );
}