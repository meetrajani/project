import axios from "axios";
import React, { useState, useEffect } from "react";

const Usertasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [newTask, setNewTask] = useState("");

  const API_URL = "http://localhost:5000/tasks";

  useEffect(() => {
    axios.get(API_URL)
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  const addTask = () => {
    if (newTask.trim()) {
      const task = { title: newTask, completed: false };
      axios.post(API_URL, task)
        .then((response) => setTasks([...tasks, response.data]))
        .catch((error) => console.error("Error adding task:", error));
      setNewTask("");
    }
  };

  const toggleTask = (id, completed) => {
    axios.patch(`${API_URL}/${id}`, { completed: !completed })
      .then(() => {
        setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
      })
      .catch((error) => console.error("Error updating task:", error));
  };

  const deleteTask = (id) => {
    axios.delete(`${API_URL}/${id}`)
      .then(() => setTasks(tasks.filter((task) => task.id !== id)))
      .catch((error) => console.error("Error deleting task:", error));
  };

  const editTask = (id, newTitle) => {
    axios.patch(`${API_URL}/${id}`, { title: newTitle })
      .then(() => {
        setTasks(tasks.map((task) => (task.id === id ? { ...task, title: newTitle } : task)));
      })
      .catch((error) => console.error("Error updating task title:", error));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "uncompleted") return !task.completed;
    return true;
  });
  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-100 rounded-lg shadow-lg mt-10">
    <h1 className="text-2xl font-bold text-center mb-4">Task Manager</h1>
    <div className="flex gap-2 mb-4">
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Add new task"
        className="w-full p-2 border rounded-lg"
      />
      <button onClick={addTask} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Add</button>
    </div>
    <div className="flex justify-center gap-2 mb-4">
      <button onClick={() => setFilter("all")} className="px-3 py-1 bg-gray-300 rounded">All</button>
      <button onClick={() => setFilter("completed")} className="px-3 py-1 bg-green-300 rounded">Completed</button>
      <button onClick={() => setFilter("uncompleted")} className="px-3 py-1 bg-red-300 rounded">Uncompleted</button>
    </div>
    <ul className="space-y-2">
      {filteredTasks.map((task) => (
        <li key={task.id} className="flex items-center justify-between p-2 bg-white rounded-lg shadow">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTask(task.id, task.completed)}
            className="mr-2"
          />
          <input
            type="text"
            value={task.title}
            onChange={(e) => editTask(task.id, e.target.value)}
            className="flex-1 p-1 border rounded"
          />
          <button onClick={() => deleteTask(task.id)} className="ml-2 px-2 py-1 bg-red-500 text-white rounded">Delete</button>
        </li>
      ))}
    </ul>
  </div>
  );
};

export default Usertasks;
