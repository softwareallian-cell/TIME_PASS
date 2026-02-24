import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignupPAge.css";
export default function SignupPage() {

    const navigate = useNavigate();
    const [form, setform] = useState({ username: '', password: '', role: 'user' });
    function handleform(e) {
        e.preventDefault();


        if (String(form.username).trim() || String(form.password).trim()) {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            if (users.find(item => item.username == form.username)) {
                alert(`${form.username} already exist`);
                return;
            }

            const newUser = {
                id: Date.now(),
                username: form.username,
                password: form.password,
                role: form.role,
                isSuspended: false
            }
            localStorage.setItem('users', JSON.stringify([...users, newUser]));
            alert(`${form.username} is added`);
            console.log(localStorage.getItem('users'));
            navigate("/login");
        }
        else {
            alert("Use characters not spaces for username & password ");

        }



    }


    return (
        <div className="signup-container" style={{
            width: '500px', margin: '0 auto'
        }}> <form onSubmit={handleform}>
                <h1>Signup Page</h1>
                <label>Username:</label>
                <input type="text" onChange={(e) => setform({ ...form, username: e.target.value })} required />
                <label>Password:</label>
                <input type="password" onChange={(e) => setform({ ...form, password: e.target.value })} required />
                <button type="submit">Sign up</button>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{}} >Select Role</label>
                    <select style={{ marginLeft: '-8px' }}
                        onChange={(e) => setform({ ...form, role: e.target.value })}
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    <div>
                        <p>Already have an account?</p><Link to="/login">Login</Link></div></div>
            </form>
        </div >)

}