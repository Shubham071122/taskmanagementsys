import React, { createContext, ReactNode, useEffect, useState } from "react";
import axios from "axios";
import toast from 'react-hot-toast';

interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
    dueDate: string;
    createdAt: string;
    updatedAt: string;
}

interface TaskContextType {
    createTask: (title: string, description: string, status: string, dueDate: string) => Promise<void>;
    getTasks: () => Promise<void>;
    getTaskById: (id: string) => Promise<Task | null>;
    updateTask: (id: string, title: string, description: string, status: string, dueDate: string) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    tasks: Task[];
    isLoading: boolean;
}

interface TaskProviderProps {
    children: ReactNode;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const SERVER_URL = 'http://localhost:5000/api';

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch all tasks on component mount

    // Fetch all tasks
    const getTasks = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${SERVER_URL}/tasks`, { withCredentials: true });
            if (response.status === 200) {
                setTasks(response.data);
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
            toast.error("Error fetching tasks");
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch a single task by ID
    const getTaskById = async (id: string): Promise<Task | null> => {
        try {
            const response = await axios.get(`${SERVER_URL}/tasks/${id}`, { withCredentials: true });
            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            console.error("Error fetching task:", error);
            toast.error("Error fetching task");
        }
        return null;
    };

    // Create a new task
    const createTask = async (title: string, description: string, status: string, dueDate: string) => {
        try {
            const response = await axios.post(
                `${SERVER_URL}/tasks`,
                { title, description, status, dueDate },
                { withCredentials: true }
            );

            if (response.status === 201) {
                setTasks(prevTasks => [...prevTasks, response.data]);
                toast.success("Task created successfully");
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error creating task:", error);
            toast.error("Error creating task");
            setIsLoading(false);
        }finally{
            setIsLoading(false);
        }
    };

    // Update an existing task
    const updateTask = async (id: string, title: string, description: string, status: string, dueDate: string) => {
        try {
            const response = await axios.put(
                `${SERVER_URL}/tasks/${id}`,
                { title, description, status, dueDate },
                { withCredentials: true }
            );

            if (response.status === 200) {
                setTasks(prevTasks => prevTasks.map(task => task.id === id ? response.data : task));
                toast.success("Task updated successfully");
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error updating task:", error);
            toast.error("Error updating task");
            setIsLoading(false);
        }finally{
            setIsLoading(false);
        }
    };

    // Delete a task
    const deleteTask = async (id: string) => {
        try {
            const response = await axios.delete(`${SERVER_URL}/tasks/${id}`, { withCredentials: true });

            if (response.status === 204) {
                setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
                toast.success("Task deleted successfully");
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error deleting task:", error);
            toast.error("Error deleting task");
            setIsLoading(false);
        }finally{
            setIsLoading(false);
        }
    };

    return (
        <TaskContext.Provider value={{ createTask, getTasks, getTaskById, updateTask, deleteTask, tasks, isLoading }}>
            {children}
        </TaskContext.Provider>
    );
};

export default TaskContext;
