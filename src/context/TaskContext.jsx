import React, { createContext, useState, useEffect } from "react";

export const TaskContext = createContext();

export function TaskProvider({ children }) {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetch("http://localhost:6001/tasks")
            .then((r) => r.json())
            .then((data) => setTasks(data));
    }, []);

    function addTask(title) {
        const newTask = { title, completed: false };

        fetch("http://localhost:6001/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTask),
        })
            .then((r) => r.json())
            .then((newTaskFromServer) => {
                const taskWithId = {
                    ...newTask,
                    id: newTaskFromServer?.id ?? Date.now(), 
                };
            setTasks((prevTasks) => [...prevTasks, taskWithId]);
            });
}

    function toggleTaskCompletion(id) {
        const task = tasks.find((t) => t.id === id);
        if (!task) return;

        const updatedTask = { ...task, completed: !task.completed };

        fetch(`http://localhost:6001/tasks/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: updatedTask.completed }),
        })
            .then((r) => r.json())
            .then((data) => {
            const safeUpdated = { ...updatedTask, ...data }; 
            setTasks((prev) =>
                prev.map((t) => (t.id === id ? safeUpdated : t))
            );
            });
}

    return (
        <TaskContext.Provider value={{ tasks, addTask, toggleTaskCompletion}}>
            {children}
        </TaskContext.Provider>
    )
}
