import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../register-styles.css";
import { Link as RouterLink } from "react-router-dom";
import { Button, Card, CardBody, Progress } from "@heroui/react";

export default function AccountType() {
    const navigate = useNavigate();
    const location = useLocation();
    const [selected, setSelected] = useState(null);
    const {email, fName, lName} = location.state || {};
  
    const accountTypes = [
        {
            key: "parent",
            icon: "P",
            title: "I am a Parent",
            description: "I am here to keep track and manage my baby's growth and development",
            route: "/parent-info",
        },
        {
            key: "babysitter",
            icon: "B",
            title: "I am a Babysitter",
            description: "I am here to babysit and stay on track for the baby's schedule and development",
            route: "/babysitter-info",
        },
    ];    

    const handleNext = () => {
        const selectedType = accountTypes.find((type) => type.key === selected);
        if (selectedType) {
            navigate(selectedType.route, {
                state: {email, fName, lName}
            });
        }
    };

    return (
        <div className="mainDiv">
            
            {/** Placeholder div so progress bar can be at same height */}
            <div className="arrowIcon"></div>

            <Progress aria-label="Loading..." className="progressBar" value={20} />
            <h1 className="heading">What brings you to our app?</h1>

            {accountTypes.map((type) => (
                <Card
                    key={type.key}
                    className={`card 
                        ${selected && selected !== type.key ? "faded" : ""} 
                        ${selected === type.key ? "selected" : ""}`}
                    isPressable
                    onPress={() => setSelected(type.key)}
                >
                <CardBody>
                    <div className="cardBody">
                        <div className="circleIcon">{type.icon}</div>
                        <div className="accountSelectionInfo">
                            <h4 className="heading4">{type.title}</h4>
                            <p className="textP">{type.description}</p>
                        </div>
                    </div>
                </CardBody>
                </Card>
            ))}

            <div className="buttonContainer">
                <Button
                    color="primary"
                    className="button"
                    onPress={handleNext}
                    isDisabled={!selected}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
