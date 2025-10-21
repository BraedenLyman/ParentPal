import React from "react";
import { Card } from "@heroui/react";
import "./page-middle-nav.css";
import { useNavigate } from "react-router-dom";

export default function PageMiddleNav() {
    const navigate = useNavigate();

    return (
        <div className="container">
            <Card 
                isPressable
                className="middleNavCard growthCard"
                onClick={() => navigate("/growth-tracker")}
            >
                <h1>Growth Tracker</h1>
            </Card>

            <Card 
                isPressable
                className="middleNavCard sleepCard" 
                onClick={() => navigate("/sleep-analytics")}
            >
                <h1>Sleep Analytics</h1>
            </Card>

            <Card 
                isPressable
                className="middleNavCard healthCard"
                onClick={() => navigate("/health-journal")}
            >
                <h1>Health Journal</h1>
            </Card>

            <Card 
                isPressable
                className="middleNavCard feedingCard"
                onClick={() => navigate("/feeding-notes")}
            >
                <h1>Feeding Notes</h1>
            </Card>

            <Card 
                isPressable
                className="middleNavCard observationCard"
                onClick={() => navigate("/observation-notes")}
            >
                <h1>Observation Notes</h1>
            </Card>

            <Card 
                isPressable
                className="middleNavCard assignedCard"
                onClick={() => navigate("/assigned-tasks")}
            >
                <h1>Assigned Tasks</h1>
            </Card>

            <Card 
                isPressable
                className="middleNavCard photoGalleryCard"
                onClick={() => navigate("/photo-gallery")}
            >
                <h1>Photo Gallery</h1>
            </Card>
        </div>
    );
}
