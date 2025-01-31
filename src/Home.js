import React, { useEffect, useState, useCallback } from 'react';
import Create from './Create';
import EditTask from './EditTask';
import axios from 'axios';
import { BsCircleFill, BsFillCheckCircleFill, BsFillTrashFill, BsCalendarEvent, BsPencilSquare } from 'react-icons/bs';
import { useAuth } from './AuthContext';
import './App.css';

const Home = () => {
    const [todos, setTodos] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [editingTask, setEditingTask] = useState(null);
    const { token, logout } = useAuth();

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const fetchTodos = useCallback(() => {
        axios.get('http://localhost:5000/get', {
            headers: { 'x-auth-token': token }
        })
        .then(result => {
            // Sort todos by due date
            const sortedTodos = result.data.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
            setTodos(sortedTodos);
        })
        .catch(err => {
            console.error(err);
            if (err.response?.status === 401) {
                logout();
            }
        });
    }, [token, logout]);

    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    const handleEdit = (id) => {
        axios.put(`http://localhost:5000/edit/${id}`, {}, {
            headers: { 'x-auth-token': token }
        })
        .then(() => {
            fetchTodos();
        })
        .catch(err => {
            console.error(err);
            if (err.response?.status === 401) {
                logout();
            }
        });
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:5000/delete/${id}`, {
            headers: { 'x-auth-token': token }
        })
        .then(() => {
            fetchTodos();
        })
        .catch(err => {
            console.error(err);
            if (err.response?.status === 401) {
                logout();
            }
        });
    };

    const startEditing = (task) => {
        setEditingTask(task);
    };

    const formatDate = (date) => {
        const dueDate = new Date(date);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Reset time part for comparison
        today.setHours(0, 0, 0, 0);
        tomorrow.setHours(0, 0, 0, 0);
        const dueDateNoTime = new Date(dueDate);
        dueDateNoTime.setHours(0, 0, 0, 0);

        if (dueDateNoTime.getTime() === today.getTime()) {
            return 'Today';
        } else if (dueDateNoTime.getTime() === tomorrow.getTime()) {
            return 'Tomorrow';
        } else {
            return dueDate.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: dueDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
            });
        }
    };

    const getDueDateColor = (date) => {
        const dueDate = new Date(date);
        const today = new Date();
        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'overdue';
        if (diffDays === 0) return 'due-today';
        if (diffDays === 1) return 'due-tomorrow';
        if (diffDays <= 3) return 'due-soon';
        return 'due-later';
    };

    return (
        <div className="home">
            <div className="header">
                <h2>TASKBLOOM</h2>
                <div className="header-right">
                    <div className="time">{currentTime.toLocaleTimeString()}</div>
                    <button onClick={logout} className="logout-button">Logout</button>
                </div>
            </div>
            <Create />
            {editingTask && (
                <EditTask
                    task={editingTask}
                    onClose={() => setEditingTask(null)}
                    onUpdate={fetchTodos}
                />
            )}
            {todos.length === 0 ? (
                <div className="no-todos">No Tasks</div>
            ) : (
                <div className="list">
                    {todos.map((item) => (
                        <div className="task" key={item._id}>
                            <div className="checkbox" onClick={() => handleEdit(item._id)}>
                                {item.done ? 
                                    <BsFillCheckCircleFill className="icon"></BsFillCheckCircleFill>
                                : <BsCircleFill className="icon"></BsCircleFill>}
                                <p className={item.done ? "line_through" : ""}>{item.task}</p>
                            </div>
                            <div className="task-actions">
                                <div className={`due-date ${getDueDateColor(item.dueDate)}`}>
                                    <BsCalendarEvent className="calendar-icon" />
                                    <span>{formatDate(item.dueDate)}</span>
                                </div>
                                <button className="edit-btn" onClick={() => startEditing(item)}>
                                    <BsPencilSquare />
                                </button>
                                <button className="delete-btn" onClick={() => handleDelete(item._id)}>
                                    <BsFillTrashFill />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
