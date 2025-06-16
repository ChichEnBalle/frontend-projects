import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [formData, setFormData] = useState("");

  useEffect(() => {
    fetch("/api/todos")
      .then(res => res.json())
      .then(data => setTodos(data));
      
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!formData.trim()) return;

    fetch("/api/todos", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: formData }),
    })
      .then(res => res.json())
      .then(data => {
        setTodos(data);
        setFormData("");
      });
  };

  const handleDelete = (id) => {
    fetch("/api/todos/" + id, { method: "DELETE" })
      .then(res => res.json())
      .then(data => setTodos(data));
  };

  const handleToggleDone = (id, done) => {
    fetch("/api/todos/" + id, {
      method: "PATCH",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done }),
    })
      .then(res => res.json())
      .then(data => setTodos(data));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>ToDo List ({todos.length})</h1>

      <form onSubmit={handleAdd}>
        <input
          type="text"
          value={formData}
          onChange={(e) => setFormData(e.target.value)}
          placeholder="New Task"
        />
        <button type="submit">Add</button>
      </form>

      <div style={{ display: 'flex', marginTop: '30px' }}>
        <Column
          title="All"
          todos={todos}
          onDelete={handleDelete}

        />
        <Column
          title="ToDo"
          todos={todos.filter(todo => !todo.done)}
          onToggleDone={id => handleToggleDone(id, true)}
        />
        <Column
          title="Done"
          todos={todos.filter(todo => todo.done)}
          onToggleDone={id => handleToggleDone(id, false)}
        />
      </div>
    </div>
  );
}

function Column({ title, todos, onDelete, onToggleDone }) {
  return (
    <div style={{ flex: 1, padding: '10px' }}>
      <h2>{title}</h2>
      {todos.map(todo => (
        <div key={todo._id} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
          {(title === "ToDo") && (
            <input
              type="checkbox"
              checked={false}
              onChange={() => onToggleDone && onToggleDone(todo._id)}
              style={{ marginRight: '8px' }}
            />
          )}
          {(title === "Done") && (
            <input
              type="checkbox"
              checked={true}
              onChange={() => onToggleDone && onToggleDone(todo._id)}
              style={{ marginRight: '8px' }}
            />
          )}
          {todo.text}
          {title === "All" && (
            <span
              onClick={() => onDelete && onDelete(todo._id)}
              style={{
                cursor: 'pointer',
                color: 'red',
                marginLeft: '10px',
                fontSize: '18px',
                userSelect: 'none'
              }}
              title="Supprimer"
            >
              🗑️
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;