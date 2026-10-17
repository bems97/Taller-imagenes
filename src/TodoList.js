import React, { useState, useEffect } from 'react';
import './TodoList.css';

export default function TodoList() {
  // Inicialización directa leyendo de LocalStorage
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [text, setText] = useState('');
  const [filter, setFilter] = useState('all');

  // Guardar en LocalStorage cada vez que cambien las tareas
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (text.trim() === '') return;

    const newTask = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setText('');
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Filtrado de tareas
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  return (
    <section className="todo-section">
      <div className="todo-card">
        <div className="todo-header">
          <h2>Lista de Tareas</h2>
          <span className="todo-storage-badge">💾 LocalStorage</span>
        </div>

        <form onSubmit={addTask} className="todo-form">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="¿Qué tarea tienes pendiente?"
            className="todo-input"
          />
          <button type="submit" className="btn-todo-add">
            Agregar
          </button>
        </form>

        <div className="todo-filters">
          <button
            type="button"
            className={`filter-pill ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Todas ({tasks.length})
          </button>
          <button
            type="button"
            className={`filter-pill ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pendientes ({tasks.filter((t) => !t.completed).length})
          </button>
          <button
            type="button"
            className={`filter-pill ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completadas ({tasks.filter((t) => t.completed).length})
          </button>
        </div>

        <ul className="todo-list">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <li
                key={task.id}
                className={`todo-item ${task.completed ? 'completed' : ''}`}
              >
                <label className="todo-label">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="todo-checkbox"
                  />
                  <span className="todo-text">{task.text}</span>
                </label>
                <button
                  type="button"
                  className="btn-todo-delete"
                  onClick={() => deleteTask(task.id)}
                  title="Eliminar tarea"
                >
                  ✕
                </button>
              </li>
            ))
          ) : (
            <li className="todo-empty">
              No hay tareas en esta categoría.
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}