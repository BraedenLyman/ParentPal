import { useNavigate } from "react-router-dom";

export default function ParentDashboard() {
    const navigate = useNavigate();

    return (
        <div className="mainDiv">
            <h1>Parent Dashboard</h1>
        </div>
    );
}
