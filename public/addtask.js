const fs = require('fs');

// Read the existing tasks from the JSON file
const todos = JSON.parse(fs.readFileSync('todos.json'));

// Add a new task object to the todos array
const newTask = {
  name: 'Walk the dog',
  dueDate: '2023-05-05',
  priority: 'Low',
  notes: 'Around the block'
};
todos.push(newTask);

// Write the updated todos array back to the JSON file
fs.writeFileSync('todos.json', JSON.stringify(todos));
