import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../../register-styles.css";
import { Button, Card, CardBody, Progress } from "@heroui/react";

export default function AddBaby() {
    const navigate = useNavigate();
    const location = useLocation();
    const [selected, setSelected] = useState(null);
    const [fName, setFName] = useState("");
    const [lName, setLName] = useState("");

    const categories = [
        { name: "Baby", description: "0–12 months old." },
        { name: "Toddler", description: "1–3 years old." },
        { name: "Pre-Schooler", description: "3–5 years old." },
        { name: "Grade-Schooler", description: "5–12 years old." },
    ];
  
    const handleNext = () => {
        navigate("/baby-info", { state: { category: selected, fName, lName } })
    };

    return (
        <div className="mainDiv">
            
            <div className="arrowIcon" onClick={() => navigate("/parent-info")}>
                <ArrowLeftIcon />
            </div>

            <Progress aria-label="Loading..." className="progressBar" value={60} />
            <h1 className="heading">Add your baby</h1>

            {categories.map((cat) => (
                <Card
                    key={cat.name}
                    className={`card 
                        ${selected && selected !== cat.name ? "faded" : ""} 
                        ${selected === cat.name ? "selected" : ""}`
                    }
                    isPressable
                    onPress={() => setSelected(cat.name)}
                >
                    <CardBody>
                        <div className="cardBody">
                            <div className="circleIcon">{cat.name.charAt(0)}</div>
                            <div className="accountSelectionInfo">
                                <h4 className="heading4">{cat.name}</h4>
                                <p className="textP">{cat.description}</p>
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
