import { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebase/firebaseAuth';
import API_URL from "../config/api";

/**
 * Custom hook to fetch baby data for both parents and babysitters
 * Handles the difference between parent-owned babies and babysitter-shared babies
 */
export function useBabyData(locationState) {
    const [userData, setUserData] = useState(null);
    const [babyData, setBabyData] = useState([]);
    const [selectedBaby, setSelectedBaby] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const currentUser = auth.currentUser;

            if (!currentUser) {
                setLoading(false);
                return;
            }

            try {
                // Get user data from sign-in
                const idToken = await currentUser.getIdToken();
                const response = await axios.post(
                    `${API_URL}/api/sign-in`,
                    { idToken },
                    { withCredentials: true }
                );

                const { user, babyData: parentBabies } = response.data;
                setUserData(user);

                let babies = [];

                // Check if user is a babysitter
                if (user.account_type === 'babysitter') {
                    console.log('Fetching shared children for babysitter');
                    // Fetch shared children for babysitter
                    const childrenResponse = await axios.get(
                        `${API_URL}/api/babysitter-sharing/children/${user.account_id}`,
                        { withCredentials: true }
                    );
                    babies = childrenResponse.data.children || [];
                    console.log('Shared children found:', babies.length);
                } else {
                    babies = parentBabies || [];
                }

                setBabyData(babies);

                const passedBaby = locationState?.baby;
                if (passedBaby) {
                    console.log('Using baby from navigation state:', passedBaby.first_name);
                    setSelectedBaby(passedBaby);
                } else if (babies.length > 0) {
                    console.log('Using first baby from list:', babies[0].first_name);
                    setSelectedBaby(babies[0]);
                } else {
                    console.log('No babies available');
                    setSelectedBaby(null);
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [locationState]);

    return {
        userData,
        babyData,
        selectedBaby,
        setSelectedBaby,
        loading,
        isBabysitter: userData?.account_type === 'babysitter'
    };
}
