import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import './App.css';

const Create = () => {
    const [task, setTask] = useState('');
    const [dueDate, setDueDate] = useState('');
    const { token } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!task.trim() || !dueDate) {
            alert('Please enter both task and due date');
            return;
        }
        
        try {
            await axios.post('https://taskbloom-backend-1.onrender.com/add', 
                { 
                    task: task.trim(),
                    dueDate: new Date(dueDate).toISOString()
                },
                { headers: { 'x-auth-token': token } }
            );
            
            window.location.reload();
            setTask('');
            setDueDate('');
        } catch (err) {
            console.error('Error creating task:', err);
            alert('Failed to create task. Please try again.');
        }
    };

    // Get today's date in YYYY-MM-DD format for min attribute
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className='create-form'>
            <form onSubmit={handleSubmit}>
                <input
                    type='text'
                    placeholder='Enter a task'
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    required
                />
                <input
                    type='date'
                    value={dueDate}
                    min={today}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                />
                <button type='submit'>Add Task</button>
            </form>
        </div>
    );
};

export default Create;
