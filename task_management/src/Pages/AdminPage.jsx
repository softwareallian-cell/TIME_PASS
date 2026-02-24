import React, { useState } from 'react';
import { useAuth } from '../hooks/AuthContext';
export default function AdminPage() {
    const [users, setUsers] = useState(JSON.parse(localStorage.getItem('users') || '[]'));
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const { user: currentUSER } = useAuth();

    const toggleSuspend = (id) => {
        if (currentUSER && id === currentUSER.id) {
            return alert("Security Error:You Cannont suspend your own admin account");
        }

        const updatedUsers = users.map(u => {
            if (u.id === id) {
                return { ...u, isSuspended: !u.isSuspended };
            }
            return u;
        });

        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
    }

    const deleteUser = (userId) => {

        const confirm = window.confirm("WARNING: This will permanently delete ALL of this user's tasks. Proceed?");
        if (!confirm) return;

        const updatedUsers = users.filter(u => u.id !== userId);
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));

        const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        const cleanedTasks = allTasks.filter(t => String(t.userId) !== (userId));

        localStorage.setItem('tasks', JSON.stringify(cleanedTasks));
        alert(`User ${userId} and all associated tasks have been purged.`);
    };

    return (
        <div className="admin-container">
            <h1>Admin Panel</h1>
            <p>Total Registered Users: {users.length}</p>

            <div className="admin-section">
                <h3>Users Table</h3>
                <table className="admin-table">
                    <thead>
                        <tr><th>ID</th><th>Username</th><th>Role</th><th>Status</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} style={{ opacity: u.isSuspended ? 0.6 : 1 }}>
                                <td>{u.id}</td>
                                <td>{u.username}</td>
                                <td className={u.role === 'admin' ? 'role-admin' : 'role-user'}>
                                    {u.role}
                                </td>
                                <td>
                                    {u.isSuspended ?
                                        <b style={{ color: 'red' }}>Suspended</b>
                                        : <span style={{ color: 'green' }}>Active</span>
                                    }
                                </td>
                                <td>
                                    <button onClick={() => toggleSuspend(u.id)}
                                        className={u.isSuspended ? "unsuspend-btn" : "suspend-btn"}>
                                        {u.isSuspended ? "Unsuspend" : "Suspend"}
                                    </button>
                                    <button
                                        onClick={() => deleteUser(u.id)}
                                        hidden={u.role === 'admin'}
                                        className="delete-btn">
                                        Delete User</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="admin-section">
                <h3>Tasks Table</h3>
                <table>
                    <thead>
                        <tr><th>ID</th><th>Status</th><th>Title</th><th>UserID</th></tr>
                    </thead>
                    <tbody>
                        {tasks.map(t => (
                            <tr key={t.id}>
                                <td>{t.id}</td>
                                <td>{t.status}</td>
                                <td>{t.title}</td>
                                <td>{t.userId}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    );
}