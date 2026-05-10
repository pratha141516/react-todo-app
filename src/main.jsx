import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Check, Circle, ListTodo, Plus, Trash2, X } from 'lucide-react';
import './styles.css';

const initialTodos = [
  { id: crypto.randomUUID(), text: 'Plan the day', completed: true },
  { id: crypto.randomUUID(), text: 'Build the todo app', completed: false },
  { id: crypto.randomUUID(), text: 'Review finished tasks', completed: false }
];

function App() {
  const [todos, setTodos] = useState(initialTodos);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  const visibleTodos = useMemo(() => {
    if (filter === 'active') return todos.filter((todo) => !todo.completed);
    if (filter === 'completed') return todos.filter((todo) => todo.completed);
    return todos;
  }, [todos, filter]);

  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.length - activeCount;

  function addTodo(event) {
    event.preventDefault();
    const text = newTodo.trim();
    if (!text) return;

    setTodos((current) => [
      { id: crypto.randomUUID(), text, completed: false },
      ...current
    ]);
    setNewTodo('');
  }

  function toggleTodo(id) {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  function deleteTodo(id) {
    setTodos((current) => current.filter((todo) => todo.id !== id));
  }

  function startEditing(todo) {
    setEditingId(todo.id);
    setEditingText(todo.text);
  }

  function saveEdit(id) {
    const text = editingText.trim();
    if (!text) {
      deleteTodo(id);
    } else {
      setTodos((current) =>
        current.map((todo) => (todo.id === id ? { ...todo, text } : todo))
      );
    }
    setEditingId(null);
    setEditingText('');
  }

  function clearCompleted() {
    setTodos((current) => current.filter((todo) => !todo.completed));
  }

  return (
    <main className="app-shell">
      <section className="todo-panel" aria-labelledby="todo-heading">
        <header className="panel-header">
          <div className="title-group">
            <span className="app-icon" aria-hidden="true">
              <ListTodo size={24} />
            </span>
            <div>
              <h1 id="todo-heading">PRATHA'S Todo App</h1>
              <p>{activeCount} active, {completedCount} completed</p>
            </div>
          </div>
        </header>

        <form className="add-form" onSubmit={addTodo}>
          <input
            value={newTodo}
            onChange={(event) => setNewTodo(event.target.value)}
            placeholder="Add a new task"
            aria-label="Add a new task"
          />
          <button type="submit" aria-label="Add task">
            <Plus size={20} />
          </button>
        </form>

        <div className="toolbar">
          <div className="filters" aria-label="Todo filter">
            {['all', 'active', 'completed'].map((item) => (
              <button
                key={item}
                type="button"
                className={filter === item ? 'active' : ''}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="clear-button"
            onClick={clearCompleted}
            disabled={completedCount === 0}
          >
            Clear done
          </button>
        </div>

        <ul className="todo-list">
          {visibleTodos.map((todo) => (
            <li key={todo.id} className={todo.completed ? 'completed' : ''}>
              <button
                type="button"
                className="toggle-button"
                onClick={() => toggleTodo(todo.id)}
                aria-label={todo.completed ? 'Mark active' : 'Mark completed'}
              >
                {todo.completed ? <Check size={18} /> : <Circle size={18} />}
              </button>

              {editingId === todo.id ? (
                <input
                  className="edit-input"
                  value={editingText}
                  autoFocus
                  onChange={(event) => setEditingText(event.target.value)}
                  onBlur={() => saveEdit(todo.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') saveEdit(todo.id);
                    if (event.key === 'Escape') {
                      setEditingId(null);
                      setEditingText('');
                    }
                  }}
                />
              ) : (
                <button
                  type="button"
                  className="todo-text"
                  onClick={() => startEditing(todo)}
                >
                  {todo.text}
                </button>
              )}

              <button
                type="button"
                className="delete-button"
                onClick={() => deleteTodo(todo.id)}
                aria-label="Delete task"
              >
                <Trash2 size={18} />
              </button>
            </li>
          ))}
        </ul>

        {visibleTodos.length === 0 && (
          <div className="empty-state">
            <X size={24} />
            <p>No tasks in this view.</p>
          </div>
        )}
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
