// app.js

document.addEventListener('DOMContentLoaded', () => {
    const addTaskForm = document.getElementById('add-task-form');
    const taskTitleInput = document.getElementById('task-title');
    const taskDescriptionInput = document.getElementById('task-description');
    const taskList = document.getElementById('task-list');
    const progress = document.getElementById('progress');
    const taskCountDisplay = document.getElementById('task-count');

    let tasks = loadTasks();
    updateTaskList();

    addTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = taskTitleInput.value.trim();
        const description = taskDescriptionInput.value.trim();

        if (title) {
            addTask({ id: Date.now(), title, description, completed: false });
            taskTitleInput.value = '';
            taskDescriptionInput.value = '';
            showNotification('Task added successfully!');
        }
    });

    function loadTasks() {
        const storedTasks = localStorage.getItem('tasks');
        return storedTasks ? JSON.parse(storedTasks) : [];
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function addTask(newTask) {
        tasks.push(newTask);
        saveTasks();
        updateTaskList();
    }

    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        updateTaskList();
        showNotification('Task deleted.');
    }

    function toggleComplete(id) {
        tasks = tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        saveTasks();
        updateTaskList();
    }

    function updateTaskList() {
        taskList.innerHTML = '';
        let completedCount = 0;

        tasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${task.title} ${task.description ? `- ${task.description}` : ''}</span>
                <div class="task-actions">
                    <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;

            const completeButton = listItem.querySelector('.complete-btn');
            const deleteButton = listItem.querySelector('.delete-btn');

            completeButton.addEventListener('click', () => toggleComplete(task.id));
            deleteButton.addEventListener('click', () => deleteTask(task.id));

            if (task.completed) {
                listItem.classList.add('completed');
                completedCount++;
            }

            taskList.appendChild(listItem);
        });

        updateProgress(tasks.length, completedCount);
    }

    function updateProgress(total, completed) {
        const percentage = total === 0 ? 0 : (completed / total) * 100;
        progress.style.width = `${percentage}%`;
        taskCountDisplay.textContent = `${completed} of ${total} tasks`;
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300); 
            }, 2000); 
        }, 100);     }
});