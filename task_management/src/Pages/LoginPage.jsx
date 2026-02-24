import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import "./LoginPage.css"
export default function LoginPage() {


    const navigate = useNavigate();
    const [form, setform] = useState({ username: '', password: '' });
    const { login } = useAuth();
    function handleform(e) {
        e.preventDefault();

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.username === form.username && u.password === form.password)

        if (user) {


            if (user.isSuspended) {
                return alert("ACCESS DENIED: Your account has been suspended by an admin.");
            }

            login(user);
            alert("USER LOGGED IN" + user.id);

            if (user.role === 'admin') {
                navigate("/admin");
            } else {
                navigate(`/dashboard/${user.id}`);
            }
        }
        else {
            alert("Invalid username or password");
        }
        console.log("USERS", localStorage.getItem('users'), "CURRENTUSERS", localStorage.getItem('currentUSER'));
        return;
    }

    return (<main className="login-container">
        <div style={{
            width: '500px', margin: '0 auto'
        }}><form onSubmit={handleform}>
                <h1>Login Page</h1>
                <label>Username:</label>
                <input type="text" onChange={(e) => setform({ ...form, username: e.target.value })} required />
                <label>Password:</label>
                <input type="password" onChange={(e) => setform({ ...form, password: e.target.value })} required />
                <button type="submit">LOGIN</button>
                <p>You dont have account,then<Link to="/signup">Sign up</Link></p>
            </form>
        </div>
    </main>
    )
}