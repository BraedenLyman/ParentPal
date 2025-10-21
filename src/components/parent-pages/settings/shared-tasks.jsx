import React from "react";
import { useState, useEffect } from "react";
import { Button, Card, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Textarea } from "@heroui/react";
import { PlusIcon, PencilIcon, TrashIcon, CheckCircleIcon, ClockIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import API_URL from "../../../config/api";
import "./shared-tasks.css";

export default function SharedTasks({ shareId, parentId, babysitterId, isParent = true }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const [formData, setFormData] = useState({
        task_title: "",
        task_description: "",
        due_date: ""
    });

    useEffect(() => {
        fetchTasks();
    }, [shareId]);

    const fetchTasks = async () => {
        try {
            const response = await axios.get(
                `${API_URL}/api/shared-tasks/share/${shareId}`,
                { withCredentials: true }
            );
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    const openAddModal = () => {
        setEditingTask(null);
        setFormData({
            task_title: "",
            task_description: "",
            due_date: ""
        });
        setIsModalOpen(true);
    };

    const openEditModal = (task) => {
        setEditingTask(task);
        setFormData({
            task_title: task.task_title,
            task_description: task.task_description || "",
            due_date: task.due_date || ""
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        if (!formData.task_title.trim()) {
            alert("Please enter a task title");
            return;
        }

        try {
            if (editingTask) {
                await axios.put(
                    `${API_URL}/api/shared-tasks/${editingTask.task_id}`,
                    formData,
                    { withCredentials: true }
                );
            } else {
                await axios.post(
                    `${API_URL}/api/shared-tasks`,
                    {
                        share_id: shareId,
                        parent_id: parentId,
                        babysitter_id: babysitterId,
                        ...formData
                    },
                    { withCredentials: true }
                );
            }

            await fetchTasks();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving task:", error);
            alert("Failed to save task");
        }
    };

    const openDeleteModal = (task) => {
        setTaskToDelete(task);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!taskToDelete) return;

        setDeleting(true);
        try {
            await axios.delete(
                `${API_URL}/api/shared-tasks/${taskToDelete.task_id}`,
                { withCredentials: true }
            );
            await fetchTasks();
            setIsDeleteModalOpen(false);
            setTaskToDelete(null);
        } catch (error) {
            console.error("Error deleting task:", error);
            alert("Failed to delete task");
        } finally {
            setDeleting(false);
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
                if (!isParent) {
                    const notes = prompt("Add completion notes (optional):");
                    await axios.patch(
                        `${API_URL}/api/shared-tasks/${task.task_id}/complete`,
                        { babysitter_notes: notes },
                        { withCredentials: true }
                    );
                } else {
                    await axios.patch(
                        `${API_URL}/api/shared-tasks/${task.task_id}/complete`,
                        {},
                        { withCredentials: true }
                    );
                }
            }
            await fetchTasks();
        } catch (error) {
            console.error("Error toggling task completion:", error);
            alert("Failed to update task");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="shared-tasks">
            {isParent && (
                <Button
                    color="primary"
                    size="sm"
                    onPress={openAddModal}
                    startContent={<PlusIcon className="w-4 h-4" />}
                    className="add-task-btn"
                >
                    Add Task
                </Button>
            )}

            {loading ? (
                <p>Loading tasks...</p>
            ) : tasks.length === 0 ? (
                <p className="no-tasks">
                    {isParent
                        ? "No tasks yet. Add a task for your babysitter."
                        : "No tasks assigned yet."}
                </p>
            ) : (
                <div className="tasks-list">
                    {tasks.map((task) => (
                        <Card key={task.task_id} className="task-card">
                            <div className="task-content">
                                <div className="task-checkbox">
                                    <button
                                        onClick={() => handleToggleComplete(task)}
                                        className={`checkbox ${task.is_completed ? 'checked' : ''}`}
                                    >
                                        {task.is_completed && <CheckCircleIcon className="w-5 h-5" />}
                                    </button>
                                </div>
                                <div className="task-details">
                                    <h4 className={task.is_completed ? 'completed' : ''}>
                                        {task.task_title}
                                    </h4>
                                    {task.task_description && (
                                        <p className="task-description">{task.task_description}</p>
                                    )}
                                    <div className="task-meta">
                                        {task.due_date && (
                                            <span className="due-date">
                                                <ClockIcon className="w-4 h-4" />
                                                Due: {formatDate(task.due_date)}
                                            </span>
                                        )}
                                        {task.is_completed && task.babysitter_notes && (
                                            <span className="babysitter-notes">
                                                Note: {task.babysitter_notes}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {isParent && (
                                    <div className="task-actions">
                                        <Button
                                            isIconOnly
                                            variant="light"
                                            size="sm"
                                            onPress={() => openEditModal(task)}
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            isIconOnly
                                            variant="light"
                                            size="sm"
                                            color="danger"
                                            onPress={() => openDeleteModal(task)}
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen} className="settings-modal">
                <ModalContent>
                    <ModalHeader>
                        {editingTask ? "Edit Task" : "Add New Task"}
                    </ModalHeader>
                    <ModalBody>
                        <Input
                            label="Task Title"
                            placeholder="Enter task title"
                            value={formData.task_title}
                            onChange={(e) => setFormData({ ...formData, task_title: e.target.value })}
                            isRequired
                        />
                        <Textarea
                            label="Description (Optional)"
                            placeholder="Enter task description"
                            value={formData.task_description}
                            onChange={(e) => setFormData({ ...formData, task_description: e.target.value })}
                        />
                        <Input
                            type="date"
                            label="Due Date (Optional)"
                            value={formData.due_date}
                            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onPress={handleSubmit}>
                            {editingTask ? "Update" : "Add"}
                        </Button>
                        <Button
                            variant="light"
                            onPress={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} className="settings-modal">
                <ModalContent>
                    <ModalHeader>Delete Task</ModalHeader>
                    <ModalBody>
                        <p>Are you sure you want to delete this task?</p>
                        {taskToDelete && (
                            <div className="delete-task-preview">
                                <h4>{taskToDelete.task_title}</h4>
                                {taskToDelete.task_description && (
                                    <p>{taskToDelete.task_description}</p>
                                )}
                            </div>
                        )}
                        <p style={{ fontSize: '0.875rem', color: '#999' }}>
                            This action cannot be undone.
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="danger"
                            onPress={confirmDelete}
                            isLoading={deleting}
                        >
                            Delete
                        </Button>
                        <Button
                            variant="light"
                            onPress={() => {
                                setIsDeleteModalOpen(false);
                                setTaskToDelete(null);
                            }}
                        >
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
