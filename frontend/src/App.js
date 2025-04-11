import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState('All');
  const [darkMode, setDarkMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const API_URL = 'https://lumpia-todo.onrender.com/api/todos/';
  const LOGIN_URL = 'https://lumpia-todo.onrender.com/api-token-auth/';

  // Login function
  const login = async () => {
    try {
      const response = await axios.post(LOGIN_URL, { username, password });
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token); // Persist token
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed!');
    }
  };

  // Axios config with token
  const axiosConfig = token ? {
    headers: { Authorization: `Token ${token}` }
  } : {};

  // Fetch todos
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) setToken(savedToken);

    if (token) {
      axios.get(API_URL, axiosConfig)
        .then((response) => setTodos(response.data))
        .catch((error) => console.error('Fetch todos failed:', error));
    }
  }, [token]);

  // CRUD functions
  const addTodo = () => {
    if (title.trim() && token) {
      axios.post(API_URL, { title, completed: false }, axiosConfig)
        .then((response) => {
          setTodos([response.data, ...todos]);
          setTitle('');
        });
    }
  };

  const toggleTodo = (id, completed) => {
    if (token) {
      axios.patch(`${API_URL}${id}/`, { completed: !completed }, axiosConfig)
        .then((response) => {
          setTodos(todos.map((todo) => (todo.id === id ? response.data : todo)));
        });
    }
  };

  const deleteTodo = (id) => {
    if (token) {
      axios.delete(`${API_URL}${id}/`, axiosConfig)
        .then(() => setTodos(todos.filter((todo) => todo.id !== id)));
    }
  };

  const startEditing = (id, currentTitle) => {
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const saveEdit = (id) => {
    if (editTitle.trim() && token) {
      axios.patch(`${API_URL}${id}/`, { title: editTitle }, axiosConfig)
        .then((response) => {
          setTodos(todos.map((todo) => (todo.id === id ? response.data : todo)));
          setEditingId(null);
          setEditTitle('');
        });
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'Completed') return todo.completed;
    if (filter === 'Pending') return !todo.completed;
    return true;
  });

  if (!token) {
    return (
      <div className={`app ${darkMode ? 'dark' : ''}`}>
        <h1>Lumpia To-Do List - Login</h1>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button onClick={login}>Login</button>
      </div>
    );
  }

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