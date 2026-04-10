import React, { useState, memo } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useTasks, TaskProvider } from './context/TaskContext';
import './App.css';

const TaskItem = memo(({ task, index }) => {
  const { toggleTask, deleteTask } = useTasks();
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`task-item ${task.completed ? 'completed' : ''}`}
        >
          <div className="task-content">
            <input 
              type="checkbox" 
              checked={task.completed} 
              onChange={() => toggleTask(task.id)} 
              style={{ width: '18px', height: '18px' }}
            />
            <span style={{ color: 'inherit' }}>{task.text}</span>
          </div>
          <button className="del-btn" onClick={() => deleteTask(task.id)}>Delete</button>
        </div>
      )}
    </Draggable>
  );
});

const TaskApp = () => {
  const [input, setInput] = useState('');
  const { tasks, allTasks, addTask, filter, setFilter, theme, toggleTheme, reorderTasks } = useTasks();

  const handleAdd = (e) => {
    e.preventDefault();
    if (!input.trim()) return alert("Task cannot be empty!");
    addTask(input);
    setInput('');
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(allTasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    reorderTasks(items);
  };

  return (
    <div className={`app-wrapper ${theme === 'dark' ? 'dark' : ''}`}> 
      <div className="container">
        <header>
          <h1>Advanced Tasks</h1>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </header>
  
        <form onSubmit={handleAdd} className="input-group">
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="What needs to be done?" 
          />
          <button type="submit">Add Task</button>
        </form>
  
        <div className="filter-bar">
          {['All', 'Pending', 'Completed'].map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)} 
              className={`filter-btn ${filter === f ? 'active' : ''}`}
            >
              {f}
            </button>
          ))}
        </div>
  
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {tasks.map((task, index) => (
                  <TaskItem key={task.id} task={task} index={index} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <TaskProvider>
      <TaskApp />
    </TaskProvider>
  );
}