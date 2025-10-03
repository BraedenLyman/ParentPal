import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebase/firebaseAuth';
import API_URL from "../config/api";

const BabyContext = createContext();

export function useBabyContext() {
    const context = useContext(BabyContext);
    if (!context) {
        throw new Error('useBabyContext must be used within BabyProvider');
    }
    return context;
}

export function BabyProvider({ children }) {
    const [userData, setUserData] = useState(null);
    const [babies, setBabies] = useState([]);
    const [selectedBaby, setSelectedBaby] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserAndBabies();
    }, []);

    const fetchUserAndBabies = async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            setLoading(false);
            return;
        }

        try {
            const idToken = await currentUser.getIdToken();
            const response = await axios.post(
                `${API_URL}/api/sign-in`,
                { idToken },
                { withCredentials: true }
            );

            const { user, babyData } = response.data;
            setUserData(user);

            if (user.account_type === 'parent') {
                setBabies(babyData || []);
                if (babyData && babyData.length > 0 && !selectedBaby) {
                    setSelectedBaby(babyData[0]);
                }
            } else if (user.account_type === 'babysitter') {
                const childrenResponse = await axios.get(
                    `${API_URL}/api/babysitter-sharing/children/${user.account_id}`,
                    { withCredentials: true }
                );

                const sharedBabies = childrenResponse.data.children || [];
                setBabies(sharedBabies);
                if (sharedBabies.length > 0 && !selectedBaby) {
                    setSelectedBaby(sharedBabies[0]);
                }
            }
        } catch (error) {
            console.error("Error fetching user and babies:", error);
        } finally {
            setLoading(false);
        }
    };

    const refreshBabies = () => {
        fetchUserAndBabies();
    };

    const value = {
        userData,
        babies,
        selectedBaby,
        setSelectedBaby,
        loading,
        refreshBabies,
        isBabysitter: userData?.account_type === 'babysitter',
        isParent: userData?.account_type === 'parent'
    };

    return (
        <BabyContext.Provider value={value}>
            {children}
        </BabyContext.Provider>
    );
}
