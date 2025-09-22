import PageHeader from "../../page-components/page-header/page-header";
import PageMiddleNav from "../../page-components/page-middle-nav/page-middle-nav";
import Navbar from "../../nav-bar/navbar";
import "./growth.css";
import { Button, Input, InputOtp, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { Modal } from "@heroui/react";
import { useState } from "react";


export default function GrowthTracker() {
    const [isOpen, setIsOpen] = useState(false);
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [date, setDate] = useState("");

    function addInfo() {
        
    }

    return (
        <div className="mainDiv">
            <PageHeader />
            <PageMiddleNav />
            <Navbar />
            <Button className="addButton" onPress={() => setIsOpen(true)}>
                Add
            </Button >

            <Modal isOpen={isOpen} onOpenChange={setIsOpen} className="modal">
                <ModalContent >
                    <ModalHeader className="modalHeader">
                        Add Growth
                    </ModalHeader>
                    <ModalBody className="modalBody">
                        <Input 
                            variant="bordered"
                            label="Height" 
                            placeholder="How tall are they" 
                            type="text"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                        />
                        <p>{height}</p>

                        <Input 
                            variant="bordered"
                            label="Weight" 
                            placeholder="How much do they weigh" 
                            type="text"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                        />
                        <p>{weight}</p>

                        <Input
                            variant="bordered"
                            label="Date"
                            placeholder="Date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                        <p>{date}</p>
                    </ModalBody>
                    <ModalFooter className="modalFooter">
                        <Button >
                            Cancel
                        </Button>

                        <Button onClick={addInfo()}>
                            Add
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
