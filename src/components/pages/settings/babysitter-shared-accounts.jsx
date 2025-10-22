import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Image, Card, Avatar, InputOtp } from "@heroui/react";
import { ArrowLeftIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { FiBell } from "react-icons/fi";
import Navbar from "../nav-bar/navbar";
import axios from "axios";
import { auth } from "../../../firebase/firebaseAuth";
import API_URL from "../../../config/api";
import "./settings.css";

export default function BabysitterSharedAccounts() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [sharedAccounts, setSharedAccounts] = useState([]);
    const [verificationCode, setVerificationCode] = useState("");
    const [verifyError, setVerifyError] = useState("");
    const [verifySuccess, setVerifySuccess] = useState("");
    const [verifyLoading, setVerifyLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            navigate("/sign-in");
            return;
        }

        try {
            const idToken = await currentUser.getIdToken();
            const response = await axios.post(
                `${API_URL}/api/sign-in`,
                { idToken },
                { withCredentials: true }
            );

            const user = response.data.user;
            setUserData(user);

            // Fetch shared accounts (children the babysitter has access to)
            const childrenResponse = await axios.get(
                `${API_URL}/api/babysitter-sharing/children/${user.account_id}`,
                { withCredentials: true }
            );

            setSharedAccounts(childrenResponse.data.children || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async () => {
        if (verificationCode.length !== 4) {
            setVerifyError("Please enter a 4-digit code");
            return;
        }

        setVerifyLoading(true);
        setVerifyError("");
        setVerifySuccess("");

        try {
            await axios.post(
                `${API_URL}/api/babysitter-sharing/verify`,
                {
                    babysitter_id: userData.account_id,
                    verification_code: verificationCode
                },
                { withCredentials: true }
            );

            setVerifySuccess("Verification successful! You now have access to the child's information.");
            setVerificationCode("");

            // Refresh shared accounts after successful verification
            setTimeout(() => {
                fetchData();
                setVerifySuccess("");
            }, 2000);
        } catch (error) {
            setVerifyError(error.response?.data?.error || "Failed to verify code. Please try again.");
        } finally {
            setVerifyLoading(false);
        }
    };

    const groupByParent = (accounts) => {
        const grouped = {};
        accounts.forEach(account => {
            const parentKey = `${account.parent_first_name} ${account.parent_last_name}`;
            if (!grouped[parentKey]) {
                grouped[parentKey] = {
                    parentName: parentKey,
                    children: []
                };
            }
            grouped[parentKey].children.push(account);
        });
        return Object.values(grouped);
    };

    const groupedAccounts = groupByParent(sharedAccounts);

    if (loading) {
        return <p>Loading...</p>;
    }

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
                {/* Verification Code Section */}
                <Card shadow="sm" className="settings-option-card verification-card">
                    <div className="verification-section">
                        <h3>Add New Shared Account</h3>
                        <p>Enter the 4-digit verification code you received from a parent to access their child's information.</p>

                        <div className="verification-input-container">
                            <InputOtp
                                value={verificationCode}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setVerificationCode(value);
                                    setVerifyError("");
                                    setVerifySuccess("");
                                }}
                                variant="bordered"
                                maxLength={4}
                                className="verification-input"
                            />
                        </div>

                        {verifyError && (
                            <p className="verification-error">{verifyError}</p>
                        )}

                        {verifySuccess && (
                            <p className="verification-success">{verifySuccess}</p>
                        )}

                        <Button
                            color="primary"
                            onPress={handleVerifyCode}
                            isLoading={verifyLoading}
                            isDisabled={verificationCode.length !== 4}
                            className="verify-button"
                        >
                            Verify Code
                        </Button>
                    </div>
                </Card>

                {/* My Shared Accounts Section */}
                <div className="section-divider" style={{ margin: '2rem 0' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                        My Shared Accounts
                    </h2>
                </div>

                {groupedAccounts.length > 0 ? (
                    <div className="shared-accounts-list">
                        {groupedAccounts.map((group, index) => (
                            <Card
                                key={index}
                                shadow="sm"
                                className="parent-group-card"
                                style={{ marginBottom: '1rem' }}
                            >
                                <div className="parent-header" style={{
                                    padding: '1rem 1.5rem',
                                    borderBottom: '1px solid #e5e7eb',
                                    background: '#f9fafb'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <Avatar
                                            name={group.parentName.charAt(0)}
                                            size="md"
                                            style={{ background: '#3b82f6' }}
                                        />
                                        <div>
                                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>
                                                {group.parentName}
                                            </h3>
                                            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                                                {group.children.length} {group.children.length === 1 ? 'child' : 'children'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="children-list" style={{ padding: '1rem 1.5rem' }}>
                                    {group.children.map((child, childIndex) => (
                                        <div
                                            key={childIndex}
                                            className="child-item"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1rem',
                                                padding: '0.75rem',
                                                borderRadius: '0.5rem',
                                                background: childIndex % 2 === 0 ? '#fff' : '#f9fafb',
                                                marginBottom: childIndex < group.children.length - 1 ? '0.5rem' : 0
                                            }}
                                        >
                                            <Avatar
                                                name={child.first_name?.charAt(0) || ""}
                                                size="sm"
                                                style={{ background: '#10b981' }}
                                            />
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontWeight: '500', margin: 0 }}>
                                                    {child.first_name} {child.last_name}
                                                </p>
                                                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                                                    Born: {child.birth_date
                                                        ? new Date(child.birth_date).toLocaleDateString()
                                                        : "N/A"}
                                                </p>
                                            </div>
                                            <div className="access-badge" style={{
                                                padding: '0.25rem 0.75rem',
                                                background: '#dcfce7',
                                                color: '#16a34a',
                                                borderRadius: '9999px',
                                                fontSize: '0.75rem',
                                                fontWeight: '500'
                                            }}>
                                                Access Granted
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="empty-state-card">
                        <div className="empty-state-content" style={{ padding: '2rem', textAlign: 'center' }}>
                            <UserGroupIcon className="w-16 h-16" style={{ margin: '0 auto 1rem', color: '#9ca3af' }} />
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                No Shared Accounts Yet
                            </h3>
                            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                                Ask a parent to share their child's information with you.
                            </p>
                            <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                                Once they send you a verification code, enter it above to gain access.
                            </p>
                        </div>
                    </Card>
                )}
            </div>

            <Navbar />
        </div>
    );
}
