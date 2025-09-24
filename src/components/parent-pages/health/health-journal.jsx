import axios from "axios";
import PageMiddleNav from "../../page-components/page-middle-nav/page-middle-nav";
import Navbar from "../../nav-bar/navbar";
import {
  Avatar,
  Button,
  Card,
  Input,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tabs,
  Tab,
  RadioGroup,
  Radio
} from "@heroui/react";
import { TimeInput, Modal } from "@heroui/react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import "../parent-pages.css";

export default function HealthJournal() {
    const location = useLocation();
    const { baby, user } = location.state || {};
    const [activeTab, setActiveTab] = useState("meds");
    const [isMedsOpen, setIsMedsOpen] = useState(false);
    const [isAllergiesOpen, setIsAllergiesOpen] = useState(false);
    const [isVaccinationsOpen, setIsVaccinationsOpen] = useState(false);

    const [medName, setMedName] = useState("");
    const [medsTimeTaken, setMedsTimeTaken] = useState("");
    const [medDate, setMedDate] = useState("");
    const [medDose, setMedDose] = useState("");
    const [medSympDescription, setMedSympDescription] = useState("");

    const [allergy, setAllergy] = useState("");
    const [severity, setSeverity] = useState("");
    const [allergyNotes, setAllergyNotes] = useState("");
    const [epiYes, setEpiYes] = useState("");
    const [epiNo, setEpiNo] = useState("");

    const [vaccineName, setVaccineName] = useState("");
    const [vaccineDate, setVaccineDate] = useState("");

    return (
        <div className="mainDiv">
            {/* Header */}
            <div className="header">
                <div className="headerContainer">
                    <Avatar
                    className="avatar"
                    name={user?.first_name?.charAt(0)?.toUpperCase() || ""}
                    />
                    <Avatar
                    className="mainAvatar"
                    name={baby?.first_name?.charAt(0)?.toUpperCase() || ""}
                    />
                    <FiBell className="notification" />
                </div>

                <div className="userInfo">
                    <h1 className="babysName">{baby?.first_name || "Baby"}'s Health</h1>
                    <div className="cardContainer">
                        {[baby].map((b, index) => (
                            <Card key={index} isPressable shadow="sm" className="cardInfo">
                                <div className="cardContent">
                                    <Avatar
                                        name={b?.first_name?.charAt(0)?.toUpperCase() || ""}
                                        className="avatar"
                                    />
                                    <div className="babyInfo">
                                    <h3 className="baby">{b?.first_name || "Baby"}</h3>
                                    <p className="babyDate">
                                        {b?.birth_date ? new Date(b.birth_date).toLocaleDateString() : "N/A"}
                                    </p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            <PageMiddleNav />

            <Tabs
                aria-label="Options"
                selectedKey={activeTab}
                onSelectionChange={setActiveTab}
                className="tabs"
            >
                <Tab key="meds" title="Meds">
                    <Button className="addButton" onPress={() => setIsMedsOpen(true)}>
                        Add
                    </Button>
                </Tab>

                <Tab key="allergies" title="Allergies">
                    <Button className="addButton" onPress={() => setIsAllergiesOpen(true)}>
                        Add
                    </Button>
                </Tab>

                <Tab key="vaccinations" title="Vaccinations">
                    <Button className="addButton" onPress={() => setIsVaccinationsOpen(true)}>
                        Add
                    </Button>
                </Tab>
            </Tabs>

            <Navbar />

            <Modal isOpen={isMedsOpen} onOpenChange={setIsMedsOpen} className="modal">
            <ModalContent>
                <ModalHeader>Add Medication</ModalHeader>
                    <ModalBody>
                        <Input
                            variant="bordered"
                            label="Medication Name"
                            placeholder="Enter medication name"
                            value={medName}
                            onChange={(e) => setMedName(e.target.value)}
                        />
                        <TimeInput
                            variant="bordered"
                            label="Time take at"
                            value={medsTimeTaken}
                            onChange={(e) => setMedsTimeTaken(e.target.value)}
                        />
                        <Input
                            variant="bordered"
                            label="Date"
                            placeholder="Date"
                            type="date"
                            value={medDate}
                            onChange={(e) => setMedDate(e.target.value)}
                        />
                        <Input
                            variant="bordered"
                            label="Amount"
                            placeholder="Amount of meds taken"
                            type="number"
                            value={medDose}
                            onChange={(e) => setMedDose(e.target.value)}
                        />
                        <Input
                            variant="bordered"
                            label="Sicness/Symptoms"
                            placeholder="Describe how they are feeling"
                            type="text"
                            value={medSympDescription}
                            onChange={(e) => setMedSympDescription(e.target.value)}
                        />
                    </ModalBody>
                <ModalFooter>
                    <Button onPress={() => setIsMedsOpen(false)}>Cancel</Button>
                    <Button >
                        Add
                    </Button>
                </ModalFooter>
            </ModalContent>
            </Modal>

            <Modal isOpen={isAllergiesOpen} onOpenChange={setIsAllergiesOpen} className="modal" >
                <ModalContent>
                    <ModalHeader>Add Allergy</ModalHeader>
                        <ModalBody>
                            <Input
                                variant="bordered"
                                label="Allergy Name"
                                placeholder="What are they allergic to"
                                value={allergy}
                                onChange={(e) => setAllergy(e.target.value)}
                            />
                            <RadioGroup label="EpiPen">
                                <Radio value="yes">
                                    Yes
                                </Radio>
                                <Radio value="no">
                                    No
                                </Radio>
                            </RadioGroup>
                            <Input
                                variant="bordered"
                                label="Notes"
                                placeholder="Add any other important info"
                                value={allergyNotes}
                                onChange={(e) => setAllergyNotes(e.target.value)}
                            />
                        </ModalBody>
                    <ModalFooter>
                        <Button onPress={() => setIsAllergiesOpen(false)}>Cancel</Button>
                        <Button>
                            Add
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal
            isOpen={isVaccinationsOpen}
            onOpenChange={setIsVaccinationsOpen}
            className="modal"
            >
            <ModalContent>
                <ModalHeader>Add Vaccination</ModalHeader>
                <ModalBody>
                <Input
                    variant="bordered"
                    label="Vaccine Name"
                    placeholder="Vaccination they have"
                    value={vaccineName}
                    onChange={(e) => setVaccineName(e.target.value)}
                />
                <Input
                    variant="bordered"
                    type="date"
                    label="Date Given"
                    value={vaccineDate}
                    onChange={(e) => setVaccineDate(e.target.value)}
                />
                </ModalBody>
                <ModalFooter>
                <Button onPress={() => setIsVaccinationsOpen(false)}>Cancel</Button>
                <Button
                    onPress={() => {
                    console.log("Vaccine Added:", { vaccineName, vaccineDate });
                    setVaccineName("");
                    setVaccineDate("");
                    setIsVaccinationsOpen(false);
                    }}
                >
                    Add
                </Button>
                </ModalFooter>
            </ModalContent>
            </Modal>
        </div>
    );
}
