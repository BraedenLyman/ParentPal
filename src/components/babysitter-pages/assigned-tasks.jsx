import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Image, Card, Checkbox, Textarea, Chip } from "@heroui/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon, ClockIcon, CalendarIcon } from "@heroicons/react/24/solid";
import { FiBell } from "react-icons/fi";
import Navbar from "../nav-bar/navbar";
import axios from "axios";
import { auth } from "../../firebase/firebaseAuth";
import API_URL from "../../config/api";
import "./assigned-tasks.css";

export default function AssignedTasks() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [expandedTask, setExpandedTask] = useState(null);
    const [completionNotes, setCompletionNotes] = useState({});

    useEffect(() => {
        fetchBabysitterData();
    }, []);

    const fetchBabysitterData = async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            navigate("/sign-in");
            return;
        }

        try {
            const idToken = await currentUser.getIdToken();
            const response = await axios.post(
                `${API_URL}/api/sign-in`,
                { idToken },
                { withCredentials: true }
            );

            const { user } = response.data;
            setUserData(user);

            await fetchTasks(user.account_id);
        } catch (error) {
            console.error("Error fetching babysitter data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTasks = async (accountId) => {
        try {
            const tasksResponse = await axios.get(
                `${API_URL}/api/shared-tasks/babysitter/${accountId}`,
                { withCredentials: true }
            );
            setTasks(tasksResponse.data.tasks || []);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            setTasks([]);
        }
    };

    const handleToggleExpand = (taskId) => {
        if (expandedTask === taskId) {
            setExpandedTask(null);
        } else {
            setExpandedTask(taskId);
        }
    };

    const handleCompleteTask = async (task) => {
        try {
            const notes = completionNotes[task.task_id] || "";
            await axios.patch(
                `${API_URL}/api/shared-tasks/${task.task_id}/complete`,
                { babysitter_notes: notes },
                { withCredentials: true }
            );

            setCompletionNotes(prev => {
                const updated = { ...prev };
                delete updated[task.task_id];
                return updated;
            });

            setExpandedTask(null);

            await fetchTasks(userData.account_id);
        } catch (error) {
            console.error("Error completing task:", error);
        }
    };

    const handleMarkIncomplete = async (task) => {
        try {
            await axios.patch(
                `${API_URL}/api/shared-tasks/${task.task_id}/incomplete`,
                {},
                { withCredentials: true }
            );
            await fetchTasks(userData.account_id);
        } catch (error) {
            console.error("Error marking task incomplete:", error);
        }
    };

    const updateNotes = (taskId, value) => {
        setCompletionNotes(prev => ({
            ...prev,
            [taskId]: value
        }));
    };

    const getStatusColor = (task) => {
        if (task.is_completed) return "success";
        if (task.due_date) {
            const today = new Date();
            const dueDate = new Date(task.due_date);
            const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

            if (daysUntilDue < 0) return "danger";
            if (daysUntilDue <= 2) return "warning";
        }
        return "primary";
    };

    const getStatusText = (task) => {
        if (task.is_completed) return "Completed";
        if (task.due_date) {
            const today = new Date();
            const dueDate = new Date(task.due_date);
            const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

            if (daysUntilDue < 0) return "Overdue";
            if (daysUntilDue === 0) return "Due Today";
            if (daysUntilDue === 1) return "Due Tomorrow";
            if (daysUntilDue <= 7) return `Due in ${daysUntilDue} days`;
        }
        return "Pending";
    };

    const pendingTasks = tasks.filter(task => !task.is_completed);
    const completedTasks = tasks.filter(task => task.is_completed);

    if (loading) {
        return <p>Loading tasks...</p>;
    }

    return (
        <div className="babysitter-tasks-container">
            <div className="header">
                <div className="headerContainer">
                    <Button
                        isIconOnly
                        variant="light"
                        onPress={() => navigate("/babysitter-dashboard")}
                        className="back-button-header"
                    >
                        <ArrowLeftIcon className="w-6 h-6" />
                    </Button>
                    <Image
                        alt="Parent Pal Logo"
                        src="/images/ParentPal.png"
                        width={80}
                        className="logo"
                    />
                    <FiBell className="notification" />
                </div>
                <div className="headerTitle">
                    <h1>My Assigned Tasks</h1>
                    <p className="task-summary">
                        {pendingTasks.length} pending • {completedTasks.length} completed
                    </p>
                </div>
            </div>

            <div className="babysitter-tasks-content">
            
                {pendingTasks.length > 0 && (
                    <div className="tasks-section">
                        <h2 className="section-title">
                            <ClockIcon className="section-icon" />
                            Pending Tasks
                        </h2>
                        <div className="tasks-grid">
                            {pendingTasks.map((task) => (
                                <Card
                                    key={task.task_id}
                                    className={`task-card ${expandedTask === task.task_id ? 'expanded' : ''}`}
                                    isPressable
                                    onPress={() => handleToggleExpand(task.task_id)}
                                >
                                    <div className="task-card-header">
                                        <div className="task-header-left">
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <Checkbox
                                                    isSelected={task.is_completed}
                                                    onValueChange={() => {
                                                        if (!expandedTask || expandedTask !== task.task_id) {
                                                            setExpandedTask(task.task_id);
                                                        }
                                                    }}
                                                    color="success"
                                                    size="lg"
                                                    className="task-checkbox"
                                                />
                                            </div>
                                            <div className="task-header-info">
                                                <h3 className="task-card-title">{task.task_title}</h3>
                                                <div className="task-meta-row">
                                                    <span className="task-parent">
                                                        👤 {task.parent_first_name} {task.parent_last_name}
                                                    </span>
                                                    {task.baby_first_name && (
                                                        <span className="task-baby">
                                                            👶 {task.baby_first_name}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <Chip
                                            color={getStatusColor(task)}
                                            variant="flat"
                                            size="sm"
                                        >
                                            {getStatusText(task)}
                                        </Chip>
                                    </div>

                                    {task.task_description && (
                                        <p className="task-card-description">{task.task_description}</p>
                                    )}

                                    {task.due_date && (
                                        <div className="task-due-date">
                                            <CalendarIcon className="due-date-icon" />
                                            <span>Due: {new Date(task.due_date).toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}</span>
                                        </div>
                                    )}

                                    {expandedTask === task.task_id && (
                                        <div className="task-completion-section" onClick={(e) => e.stopPropagation()}>
                                            <div className="completion-divider"></div>
                                            <h4 className="completion-title">Complete this task</h4>
                                            <Textarea
                                                placeholder="Add completion notes (optional)..."
                                                value={completionNotes[task.task_id] || ""}
                                                onChange={(e) => updateNotes(task.task_id, e.target.value)}
                                                minRows={3}
                                                maxRows={6}
                                                className="completion-notes"
                                            />
                                            <div className="completion-actions">
                                                <Button
                                                    size="sm"
                                                    variant="flat"
                                                    onPress={() => {
                                                        setExpandedTask(null);
                                                        setCompletionNotes(prev => {
                                                            const updated = { ...prev };
                                                            delete updated[task.task_id];
                                                            return updated;
                                                        });
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    color="success"
                                                    onPress={() => handleCompleteTask(task)}
                                                    startContent={<CheckCircleIcon className="w-4 h-4" />}
                                                >
                                                    Mark Complete
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {completedTasks.length > 0 && (
                    <div className="tasks-section">
                        <h2 className="section-title">
                            <CheckCircleIcon className="section-icon completed-icon" />
                            Completed Tasks
                        </h2>
                        <div className="tasks-grid">
                            {completedTasks.map((task) => (
                                <Card key={task.task_id} className="task-card completed">
                                    <div className="task-card-header">
                                        <div className="task-header-left">
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <Checkbox
                                                    isSelected={task.is_completed}
                                                    onValueChange={() => handleMarkIncomplete(task)}
                                                    color="success"
                                                    size="lg"
                                                    className="task-checkbox"
                                                />
                                            </div>
                                            <div className="task-header-info">
                                                <h3 className="task-card-title completed-title">{task.task_title}</h3>
                                                <div className="task-meta-row">
                                                    <span className="task-parent">
                                                        👤 {task.parent_first_name} {task.parent_last_name}
                                                    </span>
                                                    {task.baby_first_name && (
                                                        <span className="task-baby">
                                                            👶 {task.baby_first_name}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <Chip
                                            color="success"
                                            variant="flat"
                                            size="sm"
                                        >
                                            Completed
                                        </Chip>
                                    </div>

                                    <div className="completed-info">
                                        <span className="completed-date">
                                            ✓ Completed {new Date(task.completed_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>

                                    {task.babysitter_notes && (
                                        <div className="completion-notes-display">
                                            <strong>Your notes:</strong>
                                            <p>{task.babysitter_notes}</p>
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {tasks.length === 0 && (
                    <Card className="empty-state-card">
                        <div className="empty-state-content">
                            <CheckCircleIcon className="empty-state-icon" />
                            <h3>No Tasks Yet</h3>
                            <p>When a parent assigns you tasks, they will appear here.</p>
                        </div>
                    </Card>
                )}
            </div>

            <Navbar />
        </div>
    );
}
