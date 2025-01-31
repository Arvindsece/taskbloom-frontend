import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import './App.css';

const EditTask = ({ task, onClose, onUpdate }) => {
    const [editedTask, setEditedTask] = useState(task.task);
    const [editedDueDate, setEditedDueDate] = useState(new Date(task.dueDate).toISOString().split('T')[0]);
    const { token } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!editedTask.trim() || !editedDueDate) {
            alert('Please enter both task and due date');
            return;
        }

        try {
            await axios.put(`http://localhost:5000/update/${task._id}`,
                {
                    task: editedTask.trim(),
                    dueDate: new Date(editedDueDate).toISOString()
                },
                { headers: { 'x-auth-token': token } }
            );
            onUpdate();
            onClose();
        } catch (err) {
            console.error('Error updating task:', err);
            alert('Failed to update task. Please try again.');
        }
    };

    return (
        <div className="edit-modal-overlay">
            <div className="edit-modal">
                <h2>Edit Task</h2>
                <form onSubmit={handleSubmit} className="edit-form">
                    <div className="form-group">
                        <label htmlFor="task">Task:</label>
                        <input
                            type="text"
                            id="task"
                            value={editedTask}
                            onChange={(e) => setEditedTask(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="dueDate">Due Date:</label>
                        <input
                            type="date"
                            id="dueDate"
                            value={editedDueDate}
                            onChange={(e) => setEditedDueDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="button-group">
                        <button type="submit" className="save-btn">Save</button>
                        <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTask;
