
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";

export default function useTask() {
    const { userId } = useParams();
    const [tasks, setTasks] = useState([]);
    const { user } = useAuth();

    const fetchTasks = () => {
        const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        const userTasks = allTasks.filter(t => String(t.userId) === String(userId));
        setTasks(userTasks);
    }

    const addTask = (title) => {
        const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        const newtask = { id: Date.now(), status: "pending", title, userId: user?.id }
        const updated = [...allTasks, newtask];
        localStorage.setItem('tasks', JSON.stringify(updated));
        fetchTasks();
    }

    const deleteTask = (id) => {
        const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        const updated = allTasks.filter(t => t.id !== id)
        localStorage.setItem('tasks', JSON.stringify(updated));
        fetchTasks();
    }

    const toggleStatus = (id) => {
        const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        const updated = allTasks.map(t => t.id === id ? { ...t, status: t.status === 'pending' ? 'done' : 'pending' } : t);
        localStorage.setItem('tasks', JSON.stringify(updated));
        fetchTasks();
    }

    const updateTask = (id, newTitle) => {
        const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        const updated = allTasks.map(t =>
            t.id === id ? { ...t, title: newTitle } : t
        );
        localStorage.setItem('tasks', JSON.stringify(updated));
        fetchTasks();
    };
    useEffect(() => { fetchTasks(); }, [userId]);
    
    return { tasks, addTask, deleteTask, toggleStatus, updateTask };


}