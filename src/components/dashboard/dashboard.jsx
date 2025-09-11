import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();

    return (
        <div className="mainDiv">
            <h1>Dashboard</h1>
        </div>
    );
}
