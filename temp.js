import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [cookies, setCookie] = useCookies(['todos']);

  // Read the todo items from cookies on component mount
  useEffect(() => {
    const todosFromCookies = cookies.todos || [];
    setTodos(todosFromCookies);
  }, [cookies]);

  // Write the todo items to cookies whenever the todos state changes
  useEffect(() => {
    setCookie('todos', todos, { path: '/' });
  }, [todos, setCookie]);

  // Create a new task and add it to the tasks array
  function addTask() {
    const newTask = {
      name: 'Walk the dog',
      dueDate: '2023-05-05',
      priority: 'Low',
      notes: 'Around the block'
    };
    setTodos(prevTodos => [...prevTodos, newTask]);
  }

  // Separate the tasks due today from the rest
  const today = new Date().toISOString().substr(0, 10);
  const tasksDueToday = todos.filter(task => task.dueDate === today);
  const tasksDueLater = todos.filter(task => task.dueDate !== today);

  // Group the tasks due later by week
  const tasksByWeek = tasksDueLater.reduce((acc, task) => {
    const dueDate = new Date(task.dueDate);
    const weekStart = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate() - dueDate.getDay());
    const weekEnd = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate() - dueDate.getDay() + 6);
    const week = `${weekStart.toISOString().substr(0, 10)} - ${weekEnd.toISOString().substr(0, 10)}`;
    if (!acc[week]) {
      acc[week] = [];
    }
    acc[week].push(task);
    return acc;
  }, {});

  // Sort the weeks in ascending order
  const sortedWeeks = Object.keys(tasksByWeek).sort();

  return (
    <div>
      <button onClick={addTask}>Add Task</button>
      <h2>Due Today</h2>
      <ul>
        {tasksDueToday.map((todo, index) => (
          <li key={index}>
            <h3>{todo.name}</h3>
            <p>Due date: {todo.dueDate}</p>
            <p>Priority: {todo.priority}</p>
            <p>Notes: {todo.notes}</p>
          </li>
        ))}
      </ul>
      {sortedWeeks.map((week, index) => (
        <div key={index}>
          <h2>{week}</h2>
          <ul>
            {tasksByWeek[week].map((todo, index) => (
              <li key={index}>
                <h3>{todo.name}</h3>
                <p>Due date: {todo.dueDate}</p>
                <p>Priority: {todo.priority}</p>
                <p>Notes: {todo.notes}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
