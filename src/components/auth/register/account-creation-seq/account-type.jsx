import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../register-styles.css";
import { Avatar, Card, CardBody, CardHeader, Image, Progress } from "@heroui/react";

export default function AccountType() {
    const navigate = useNavigate();
    const location = useLocation();
  
    return (
        <div className="mainDiv">
            <button onClick={() => navigate(-1)}>
                <ArrowLeftIcon className="arrowIcon" />
            </button>
            <Progress aria-label="Loading..." className="max-w-md" value={25} />
            <h1>What brings you to our app?!</h1>

            <Card className="py-4" isPressable>
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                    <Avatar
                        isBordered
                        radius="full"
                        size="md"
                        src="https://heroui.com/avatars/avatar-1.png"
                    />
                </CardHeader>
                <CardBody className="overflow-visible py-2">
                    <h4 className="text-tiny uppercase font-bold">I am a Parent</h4>
                    <p className="text-default-500">I am here to keep track and manage my baby's growth and development</p>
                    
                </CardBody>
            </Card>
             <Card className="py-4" isPressable>
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                    <Avatar
                        isBordered
                        radius="full"
                        size="md"
                        src="https://heroui.com/avatars/avatar-1.png"
                    />
                </CardHeader>
                <CardBody className="overflow-visible py-2">
                    <h4 className="text-tiny uppercase font-bold">I am a Babysitter</h4>
                    <p className="text-default-500">I am here to babysit and stay on track for the baby's schedule and development</p>
                    
                </CardBody>
            </Card>

        </div>
    );
}
