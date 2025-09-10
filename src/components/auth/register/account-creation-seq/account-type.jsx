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
  
    const handleNext = () => {
    if (selected === "parent") {
      navigate("/parent-info");
    } else if (selected === "babysitter") {
      navigate("/babysitter-info");
    }
  };
    return (
        <div className="mainDiv">
            
            <div className="arrowIcon" onClick={() => navigate(-1)}>
                <ArrowLeftIcon />
            </div>

            <Progress aria-label="Loading..." className="progressBar" value={25} />
            <h1 className="heading">What brings you to our app?</h1>

            {/** Parent Card */}
            <Card 
                className={`card ${selected === "babysitter" ? "faded" : ""} ${
                    selected === "parent" ? "selected" : ""
                }`} 
                isPressable
                onPress={() => setSelected("parent")}
            >
                <CardBody>
                    <div className="cardBody">
                        <div className="circleIcon">
                            P
                        </div>
                        <div className="accountSelectionInfo">
                            <h4 className="heading4">I am a Parent</h4>
                            <p className="textP">I am here to keep track and manage my baby's growth and development</p>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/** Babysitter Card */}
             <Card 
                className={`card ${selected === "parent" ? "faded" : ""} ${
                    selected === "babysitter" ? "selected" : ""
                }`} 
                isPressable
                onPress={() => setSelected("babysitter")}
            >
                <CardBody>
                    <div className="cardBody">
                        <div className="circleIcon">
                            B
                        </div>
                        <div className="accountSelectionInfo">
                            <h4 className="heading4">I am a Babysitter</h4>
                            <p className="textP">I am here to babysit and stay on track for the baby's schedule and development</p>
                        </div>
                    </div>
                </CardBody>
            </Card>
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
