import React, { createContext, useContext, useCallback, useMemo, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useLocalStorage('tasks-data', []);
  const [filter, setFilter] = useState('All');
  const [theme, setTheme] = useLocalStorage('theme-mode', 'light');

  const addTask = useCallback((text) => {
    const newTask = { id: Date.now().toString(), text, completed: false };
    setTasks((prev) => [...prev, newTask]);
  }, [setTasks]);

  const toggleTask = useCallback((id) => {
    setTasks((prev) => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }, [setTasks]);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter(t => t.id !== id));
  }, [setTasks]);

  const reorderTasks = (newTasks) => setTasks(newTasks);

  const filteredTasks = useMemo(() => {
    if (filter === 'Completed') return tasks.filter(t => t.completed);
    if (filter === 'Pending') return tasks.filter(t => !t.completed);
    return tasks;
  }, [tasks, filter]);

  return (
    <TaskContext.Provider value={{
      tasks: filteredTasks, allTasks: tasks, filter, setFilter, 
      addTask, toggleTask, deleteTask, reorderTasks, theme, 
      toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light')
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);