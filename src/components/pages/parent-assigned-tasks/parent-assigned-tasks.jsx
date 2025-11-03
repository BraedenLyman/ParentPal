import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Image,
    Card,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    Textarea,
    Checkbox
} from "@heroui/react";
import CustomSelect from "../../custom-select/CustomSelect";
import { ArrowLeftIcon, PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Navbar from "../nav-bar/navbar";
import axios from "axios";
import { auth } from "../../../firebase/firebaseAuth";
import API_URL from "../../../config/api";
import "../settings/settings.css";
import "./parent-assigned-tasks.css";

export default function ParentAssignedTasks() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [babies, setBabies] = useState([]);
    const [babysitters, setBabysitters] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [selectedBabysitter, setSelectedBabysitter] = useState(null);
    const [selectedBaby, setSelectedBaby] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
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

            const { user, babyData } = response.data;
            setUserData(user);
            setBabies(babyData || []);

            const babysittersResponse = await axios.get(
                `${API_URL}/api/babysitter-sharing/babysitters/${user.account_id}`,
                { withCredentials: true }
            );

            const verifiedBabysitters = (babysittersResponse.data.babysitters || []).filter(
                babysitter => babysitter.is_verified && babysitter.babysitter_id !== null
            );
            setBabysitters(verifiedBabysitters);

            const tasksResponse = await axios.get(
                `${API_URL}/api/shared-tasks/parent/${user.account_id}`,
                { withCredentials: true }
            );
            setTasks(tasksResponse.data.tasks || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const openAddModal = () => {
        setTaskTitle("");
        setTaskDescription("");
        setDueDate("");
        setSelectedBabysitter(null);
        setSelectedBaby(null);
        setIsAddModalOpen(true);
    };

    const openEditModal = (task) => {
        setSelectedTask(task);
        setTaskTitle(task.task_title);
        setTaskDescription(task.task_description || "");
        setDueDate(task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : "");

        const babysitter = babysitters.find(b => b.babysitter_id === task.babysitter_id);
        if (babysitter) {
            const babysitterName = babysitter.babysitter_first_name && babysitter.babysitter_last_name
                ? `${babysitter.babysitter_first_name} ${babysitter.babysitter_last_name}`
                : babysitter.babysitter_name;
            setSelectedBabysitter({ value: babysitter.babysitter_id, label: babysitterName });
        } else {
            setSelectedBabysitter(null);
        }

        const baby = babies.find(b => b.baby_id === task.baby_id);
        if (baby) {
            setSelectedBaby({ value: baby.baby_id, label: baby.first_name });
        } else {
            setSelectedBaby(null);
        }

        setIsEditModalOpen(true);
    };

    const openDeleteModal = (task) => {
        setSelectedTask(task);
        setIsDeleteModalOpen(true);
    };

    const handleAddTask = async () => {
        if (!taskTitle.trim() || !selectedBabysitter || !selectedBaby) {
            alert("Please fill in task title, select a babysitter, and select a baby");
            return;
        }

        try {
            const babysitter = babysitters.find(b => b.babysitter_id === selectedBabysitter.value);

            await axios.post(
                `${API_URL}/api/shared-tasks`,
                {
                    share_id: babysitter.share_id,
                    parent_id: userData.account_id,
                    babysitter_id: selectedBabysitter.value,
                    baby_id: selectedBaby.value,
                    task_title: taskTitle,
                    task_description: taskDescription,
                    due_date: dueDate || null
                },
                { withCredentials: true }
            );

            await fetchData();
            setIsAddModalOpen(false);
        } catch (error) {
            console.error("Error adding task:", error);
            alert("Failed to add task");
        }
    };

    const handleEditTask = async () => {
        if (!taskTitle.trim() || !selectedBabysitter || !selectedBaby) {
            alert("Please fill in task title, select a babysitter, and select a baby");
            return;
        }

        try {
            const babysitter = babysitters.find(b => b.babysitter_id === selectedBabysitter.value);

            await axios.put(
                `${API_URL}/api/shared-tasks/${selectedTask.task_id}`,
                {
                    share_id: babysitter.share_id,
                    babysitter_id: selectedBabysitter.value,
                    baby_id: selectedBaby.value,
                    task_title: taskTitle,
                    task_description: taskDescription,
                    due_date: dueDate || null
                },
                { withCredentials: true }
            );

            await fetchData();
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Error updating task:", error);
            alert("Failed to update task");
        }
    };

    const handleDeleteTask = async () => {
        try {
            await axios.delete(
                `${API_URL}/api/shared-tasks/${selectedTask.task_id}`,
                { withCredentials: true }
            );

            await fetchData();
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error("Error deleting task:", error);
            alert("Failed to delete task");
        }
    };

    const handleToggleComplete = async (task) => {
        try {
            if (task.is_completed) {
                await axios.patch(
                    `${API_URL}/api/shared-tasks/${task.task_id}/incomplete`,
                    {},
                    { withCredentials: true }
                );
            } else {
                await axios.patch(
                    `${API_URL}/api/shared-tasks/${task.task_id}/complete`,
                    { babysitter_notes: "" },
                    { withCredentials: true }
                );
            }
            await fetchData();
        } catch (error) {
            console.error("Error toggling task completion:", error);
        }
    };

    const getBabyName = (babyId) => {
        const baby = babies.find(b => b.baby_id === babyId);
        return baby ? baby.first_name : "Unknown";
    };

    const getBabysitterName = (babysitterId) => {
        const babysitter = babysitters.find(b => b.babysitter_id === babysitterId);
        if (babysitter) {
            if (babysitter.babysitter_first_name && babysitter.babysitter_last_name) {
                return `${babysitter.babysitter_first_name} ${babysitter.babysitter_last_name}`;
            }
            return babysitter.babysitter_name || "Unknown";
        }
        return "Unknown";
    };

    const babysitterOptions = babysitters.map(babysitter => ({
        value: babysitter.babysitter_id,
        label: babysitter.babysitter_first_name && babysitter.babysitter_last_name
            ? `${babysitter.babysitter_first_name} ${babysitter.babysitter_last_name}`
            : babysitter.babysitter_name
    }));

    const babyOptions = babies.map(baby => ({
        value: baby.baby_id,
        label: baby.first_name
    }));

    if (loading) {
        return <p>Loading tasks...</p>;
    }

    return (
        <div className="settings-container">
            <div className="header">
                <div className="headerContainer">
                    <Button
                        isIconOnly
                        variant="light"
                        onPress={() => navigate("/parent-dashboard")}
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
                </div>
                <div className="headerTitle">
                    <h1>Assigned Tasks</h1>
                </div>
            </div>

            <div className="settings-content">
                <div className="babysitter-section">
                    <div className="section-header">
                        <Button
                            color="primary"
                            size="lg"
                            startContent={<PlusIcon className="w-5 h-5" />}
                            onPress={openAddModal}
                            className="add-babysitter-button"
                            isDisabled={babysitters.length === 0}
                        >
                            Add Task
                        </Button>
                    </div>

                    {babysitters.length === 0 ? (
                        <Card className="empty-state-card no-babysitter-warning">
                            <div className="empty-state-content">
                                <div className="warning-icon-container">
                                    <svg className="warning-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <h3 className="warning-title">No Babysitters Added Yet</h3>
                                <p className="warning-message">
                                    To create and assign tasks, you need to add a babysitter first.
                                </p>
                                <Button
                                    color="primary"
                                    variant="flat"
                                    onPress={() => navigate("/settings/shared-accounts")}
                                    className="add-babysitter-cta"
                                    style={{ marginTop: '16px' }}
                                >
                                    Go to Shared Accounts
                                </Button>
                            </div>
                        </Card>
                    ) : tasks.length > 0 ? (
                        <div className="babysitter-list">
                            {tasks.map((task) => (
                                <Card key={task.task_id} className="babysitter-card-wrapper">
                                    <div className="card-content">
                                        <div className="task-checkbox">
                                            <Checkbox
                                                isSelected={task.is_completed}
                                                onValueChange={() => handleToggleComplete(task)}
                                                color="success"
                                            />
                                        </div>
                                        <div className={`babysitter-info ${task.is_completed ? 'completed' : ''}`}>
                                            <div className="info">
                                                <h3>{task.task_title}</h3>
                                                {task.task_description && (
                                                    <p>{task.task_description}</p>
                                                )}
                                                <div className="task-meta">
                                                    <p>Baby: {getBabyName(task.baby_id)}</p>
                                                    <p>Babysitter: {getBabysitterName(task.babysitter_id)}</p>
                                                    {task.due_date && (
                                                        <p className="status">
                                                            Due: {new Date(task.due_date).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                                {task.is_completed && (
                                                    <div className="task-completion-info">
                                                        <CheckCircleIcon className="w-5 h-5 text-green-600" />
                                                        <span>Completed {new Date(task.completed_at).toLocaleDateString()}</span>
                                                        {task.babysitter_notes && (
                                                            <p>Notes: {task.babysitter_notes}</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="card-actions">
                                            <Button
                                                isIconOnly
                                                variant="light"
                                                onPress={() => openEditModal(task)}
                                            >
                                                <PencilIcon className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                isIconOnly
                                                color="danger"
                                                variant="light"
                                                onPress={() => openDeleteModal(task)}
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="empty-state-card">
                            <div className="empty-state-content">
                                <p className="no-babysitters">No tasks created yet. Click "Add Task" to create your first task.</p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} size="2xl">
                <ModalContent>
                    <ModalHeader>Add New Task</ModalHeader>
                    <ModalBody>
                        <Input
                            label="Task Title"
                            placeholder="Enter task title"
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            required
                        />
                        <Textarea
                            label="Description"
                            placeholder="Enter task description (optional)"
                            value={taskDescription}
                            onChange={(e) => setTaskDescription(e.target.value)}
                        />
                        <div className="select-field">
                            <label className="select-label">Assign to Babysitter *</label>
                            <CustomSelect
                                options={babysitterOptions}
                                value={selectedBabysitter}
                                onChange={setSelectedBabysitter}
                                placeholder="Select a babysitter"
                                isClearable
                            />
                        </div>
                        <div className="select-field">
                            <label className="select-label">Related to Baby *</label>
                            <CustomSelect
                                options={babyOptions}
                                value={selectedBaby}
                                onChange={setSelectedBaby}
                                placeholder="Select a baby"
                                isClearable
                            />
                        </div>
                        <Input
                            type="date"
                            label="Due Date (Optional)"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={() => setIsAddModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button color="primary" onPress={handleAddTask}>
                            Add Task
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} size="2xl">
                <ModalContent>
                    <ModalHeader>Edit Task</ModalHeader>
                    <ModalBody>
                        <Input
                            label="Task Title"
                            placeholder="Enter task title"
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            required
                        />
                        <Textarea
                            label="Description"
                            placeholder="Enter task description (optional)"
                            value={taskDescription}
                            onChange={(e) => setTaskDescription(e.target.value)}
                        />
                        <div className="select-field">
                            <label className="select-label">Assign to Babysitter *</label>
                            <CustomSelect
                                options={babysitterOptions}
                                value={selectedBabysitter}
                                onChange={setSelectedBabysitter}
                                placeholder="Select a babysitter"
                                isClearable
                            />
                        </div>
                        <div className="select-field">
                            <label className="select-label">Related to Baby *</label>
                            <CustomSelect
                                options={babyOptions}
                                value={selectedBaby}
                                onChange={setSelectedBaby}
                                placeholder="Select a baby"
                                isClearable
                            />
                        </div>
                        <Input
                            type="date"
                            label="Due Date (Optional)"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={() => setIsEditModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button color="primary" onPress={handleEditTask}>
                            Save Changes
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                <ModalContent>
                    <ModalHeader>Delete Task</ModalHeader>
                    <ModalBody>
                        <p>Are you sure you want to delete this task?</p>
                        <p className="font-semibold">{selectedTask?.task_title}</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={() => setIsDeleteModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button color="danger" onPress={handleDeleteTask}>
                            Delete
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Navbar />
        </div>
    );
}
