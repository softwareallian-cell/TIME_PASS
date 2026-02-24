import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useTask from "../hooks/useTask";
import { useAuth } from "../hooks/AuthContext";
import "./HomePage.css"
export default function HomePage() {
    const { userId } = useParams();
    const { user, useDebounce } = useAuth();
    const { tasks, deleteTask, toggleStatus, updateTask, addTask, } = useTask();



    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 1000);

    const isSearching = searchTerm !== debouncedSearchTerm;

    const [statusFilter, setStatusFilter] = useState("all");

    const filterTasks = tasks.filter(task => task.title.toLowerCase().includes(debouncedSearchTerm.trim().toLowerCase()))
        .filter(task => {
            if (statusFilter === "all") return true;
            return task.status === statusFilter;
        })

    // console.log("searchTerm", searchTerm,)
    // console.log("debouncedSearchTerm", debouncedSearchTerm);

    if (user && String(user.id) !== String(userId)) {
        return (
            <div>
                <h1>Access Denied</h1>
                <p>You can only view your own dashboard.</p>
                <button onClick={() => window.history.back()}>Go Back</button>
            </div>
        );
    }




    const [newTaskTitle, setNewTaskTitle] = useState("");
    const handleAddtask = (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        addTask(newTaskTitle);
        setNewTaskTitle("");
    };


    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState("");

    const startEdit = (task) => {
        setEditingId(task.id);
        setEditValue(task.title);
    };
    const saveEdit = (id) => {
        updateTask(id, editValue);
        setEditingId(null);
    };



    return (<div className="home-container" style={{
        width: '800px', margin: '0 auto'
    }}>
        <header className="home-header">
            <div>
                <h1>My Dashboard</h1>
                <p>Welcome back, {user?.username}!</p>
            </div>

            <div className="filter-search" style={{ display: 'flex', gap: '10px' }}>
                {isSearching && <span style={{ marginTop: '10px' }}>Searching...</span>}
                <input className="search-input" type="text" placeholder="Search tasks" onChange={(e) => setSearchTerm(e.target.value)} />
                <div className="status-tabs">{['all', 'pending', 'done'].map((status) => (<button key={status}
                    onClick={() => setStatusFilter(status)} >{status}</button>))}</div>
            </div>
        </header>




        <hr></hr>
        <form onSubmit={handleAddtask} className="quick-add-form" style={{ display: 'flex' }} >
            <input type="text" placeholder="Enter new task..." onChange={(e) => setNewTaskTitle(e.target.value)} />
            <button type="submit">+ Quick Add</button>
        </form>


        <ul className="task-list">
            {filterTasks.map((task) => (
                <li key={task.id} className={`task-item-${task.status === 'done' ? 'done' : ''}`}  >
                    {editingId === task.id ? (

                        <div className="edit-wrapper" >
                            <input
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}

                            />
                            <div className="button-group">
                                <button className="save-btn" onClick={() => saveEdit(task.id)}>Save</button>
                                <button className="cancel-btn" onClick={() => setEditingId(null)}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <span className="task-text">{task.title}</span>
                            <div className="button-group">
                                <button className="status-btn" onClick={() => toggleStatus(task.id)}>
                                    {task.status === 'pending' ? 'Done' : 'Pending'}
                                </button>
                                <button className="edit-btn" onClick={() => startEdit(task)}>Edit</button>
                                <button className="delete-btn" onClick={() => deleteTask(task.id)}>Delete</button>
                            </div>
                        </>
                    )}
                </li>
            ))}
        </ul>
        {(filterTasks.length === 0) && (<p className="empty-msg">{tasks.length === 0 ? "No tasks found" : "No matches for your filters"}</p>)}
    </div >);

}