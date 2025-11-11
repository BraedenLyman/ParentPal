import React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Image } from "@heroui/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { FiBell } from "react-icons/fi";
import { Scrollbars } from "react-custom-scrollbars-2";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import Navbar from "../nav-bar/navbar";
import Select from "../../custom-select/CustomSelect";
import { auth } from "../../../firebase/firebaseAuth";
import API_URL from "../../../config/api";
import ReportsCharts from "./ReportsCharts";
import "../pages.css";
import "./reports.css";

export default function Reports() {
    const location = useLocation();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [babyData, setBabyData] = useState([]);
    const [selectedBaby, setSelectedBaby] = useState(null);
    const [growthRecords, setGrowthRecords] = useState([]);
    const [sleepRecords, setSleepRecords] = useState([]);
    const [feedingRecords, setFeedingRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedChart, setSelectedChart] = useState("growth");

    useEffect(() => {
        const fetchDashboardData = async () => {
            const currentUser = auth.currentUser;

            if (!currentUser) return;

            try {
                const idToken = await currentUser.getIdToken();
                const response = await axios.post(
                    `${API_URL}/api/sign-in`,
                    { idToken },
                    { withCredentials: true }
                );

                const { user, babyData } = response.data;
                setUserData(user);
                setBabyData(babyData || []);

                const passedBaby = location.state?.baby;
                if (passedBaby) {
                    setSelectedBaby(passedBaby);
                } else if (babyData && babyData.length > 0) {
                    setSelectedBaby(babyData[0]);
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        fetchDashboardData();
    }, [location.state]);

    useEffect(() => {
        if (!selectedBaby) return;

        const fetchAllRecords = async () => {
            setLoading(true);
            try {
                const [growthRes, sleepRes, feedingRes] = await Promise.all([
                    axios.get(`${API_URL}/api/growth`, {
                        params: { baby_id: selectedBaby.baby_id },
                        withCredentials: true,
                    }),
                    axios.get(`${API_URL}/api/sleep`, {
                        params: { baby_id: selectedBaby.baby_id },
                        withCredentials: true,
                    }),
                    axios.get(`${API_URL}/api/feeding`, {
                        params: { baby_id: selectedBaby.baby_id },
                        withCredentials: true,
                    }),
                ]);

                setGrowthRecords(growthRes.data);
                setSleepRecords(sleepRes.data);
                setFeedingRecords(feedingRes.data);
            } catch (err) {
                console.error("Failed to fetch records: ", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllRecords();
    }, [selectedBaby]);

    const isBabysitter = location.state?.isBabysitter;

    const chartCategories = [
        { value: "growth", label: "Growth Patterns" },
        { value: "sleep", label: "Sleep Patterns" },
        { value: "feeding", label: "Feeding Patterns" }
    ];

    const currentChartCategory = chartCategories.find(cat => cat.value === selectedChart);

    return (
        <div className="mainDiv">
            <div className="header reportsHeader">
                <div className="headerContainer">
                    <Button
                        isIconOnly
                        variant="light"
                        onPress={() => navigate(isBabysitter ? "/babysitter-dashboard" : "/parent-dashboard")}
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
                    <FiBell className="notification"/>
                </div>
                <div className="headerTitle">
                    <h1>{selectedBaby?.first_name || "Baby"}'s Reports</h1>
                </div>
                <div className="userInfo">
                    <div className="logCategorySelect">
                        <Select
                            options={chartCategories}
                            value={currentChartCategory}
                            onChange={(option) => {
                                if (option) {
                                    setSelectedChart(option.value);
                                }
                            }}
                            placeholder="Select Chart"
                            isSearchable={false}
                        />
                    </div>
                    <div className="babySelect">
                        <Select
                            options={babyData.map(baby => ({
                                value: baby.baby_id,
                                label: baby.first_name
                            }))}
                            value={selectedBaby ? {
                                value: selectedBaby.baby_id,
                                label: selectedBaby.first_name
                            } : null}
                            onChange={(option) => {
                                if (option) {
                                    const baby = babyData.find(b => b.baby_id === option.value);
                                    setSelectedBaby(baby);
                                }
                            }}
                            placeholder="Select Baby"
                            isSearchable={false}
                        />
                    </div>
                </div>
            </div>

            <Scrollbars className="scrollContainer">
                <div className="scrollContent reportsContent">
                    <ChakraProvider value={defaultSystem}>
                        <ReportsCharts
                            loading={loading}
                            selectedChart={selectedChart}
                            growthRecords={growthRecords}
                            sleepRecords={sleepRecords}
                            feedingRecords={feedingRecords}
                            selectedBaby={selectedBaby}
                        />
                    </ChakraProvider>
                </div>
            </Scrollbars>

            <Navbar />
        </div>
    );
}
