import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState('All');
  const [darkMode, setDarkMode] = useState(false);
  const [editingId, setEditingId] = useState(null); // Track which todo is being edited
  const [editTitle, setEditTitle] = useState('');   // Store the edited title

  const API_URL = 'http://localhost:8000/api/todos/'; // Update to your Render URL for deployment

  // Fetch todos
  useEffect(() => {
    axios.get(API_URL).then((response) => setTodos(response.data));
  }, []);

  // Add a todo
  const addTodo = () => {
    if (title.trim()) {
      axios.post(API_URL, { title, completed: false }).then((response) => {
        setTodos([response.data, ...todos]);
        setTitle('');
      });
    }
  };

  // Toggle completion
  const toggleTodo = (id, completed) => {
    axios.patch(`${API_URL}${id}/`, { completed: !completed }).then((response) => {
      setTodos(todos.map((todo) => (todo.id === id ? response.data : todo)));
    });
  };

  // Delete a todo
  const deleteTodo = (id) => {
    axios.delete(`${API_URL}${id}/`).then(() => {
      setTodos(todos.filter((todo) => todo.id !== id));
    });
  };

  // Start editing a todo
  const startEditing = (id, currentTitle) => {
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  // Save edited todo
  const saveEdit = (id) => {
    if (editTitle.trim()) {
      axios.patch(`${API_URL}${id}/`, { title: editTitle }).then((response) => {
        setTodos(todos.map((todo) => (todo.id === id ? response.data : todo)));
        setEditingId(null); // Exit editing mode
        setEditTitle('');   // Clear edit input
      });
    }
  };

  // Filter todos
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'Completed') return todo.completed;
    if (filter === 'Pending') return !todo.completed;
    return true;
  });

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <h1>Lumpia To-Do List</h1>
      <button onClick={() => setDarkMode(!darkMode)}>
        Toggle {darkMode ? 'Light' : 'Dark'} Mode
      </button>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a tasty task..."
      />
      <button onClick={addTodo}>Roll It Up!</button>
      <div>
        <button onClick={() => setFilter('All')}>All Fillings</button>
        <button onClick={() => setFilter('Completed')}>Cooked</button>
        <button onClick={() => setFilter('Pending')}>Raw</button>
      </div>
      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id, todo.completed)}
            />
            {editingId === todo.id ? (
              <>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="edit-input"
                />
                <button onClick={() => saveEdit(todo.id)}>Save</button>
              </>
            ) : (
              <>
                <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                  {todo.title}
                </span>
                <button onClick={() => startEditing(todo.id, todo.title)}>Edit</button>
                <button onClick={() => deleteTodo(todo.id)}>Toss It</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;