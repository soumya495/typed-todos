const todoForm = document.querySelector('[data-todo-form]') as HTMLFormElement;
const todoInput = document.querySelector('[data-todo-input]') as HTMLInputElement;
const totalTodosEl = document.querySelector('[data-total-todos]') as HTMLParagraphElement;
const completedTodosEl = document.querySelector('[data-completed-todos]') as HTMLParagraphElement;
const notFoundContainer = document.querySelector('.not-found') as HTMLDivElement;
const todosContainer = document.querySelector('.todo-container') as HTMLDivElement;

import { v4 as uuidv4 } from 'uuid';

type Todo = {
    id: string;
    title: string;
    completed: boolean;
}

class TodoList {
    todos: Todo[];

    constructor() {
        const typedTodos: string | null = localStorage.getItem('typed-todos');
        if (typedTodos === null) this.todos = [];
        else {
            this.todos = JSON.parse(typedTodos);
            this.updateTodoHeader();
            this.renderAllTodos();
        }
    }

    // Add a new todo
    addNewTodo(title: string) {
        const newTodo: Todo = {
            id: uuidv4(),
            title: title,
            completed: false
        };

        console.log('New Todo', newTodo);

        this.todos.push(newTodo);

        todoInput.value = '';

        this.renderTodo(newTodo);

        this.updateTodoHeader();

        localStorage.setItem('typed-todos', JSON.stringify(this.todos));
    }

    // Create a Todo Element
    createTodoElement(todo: Todo): HTMLDivElement {
        const todoEl: HTMLDivElement = document.createElement('div');
        todoEl.classList.add('todo');
        const todoTitleEl: HTMLParagraphElement = document.createElement('p');
        todoTitleEl.innerText = todo.title;

        const btnContainer: HTMLDivElement = document.createElement('div');
        btnContainer.classList.add('todo-btn-container');
        const completeBtnEl: HTMLButtonElement = document.createElement('button');
        completeBtnEl.innerText = '✅';
        const editBtnEl: HTMLButtonElement = document.createElement('button');
        editBtnEl.innerText = '✏️';
        const delBtnEl: HTMLButtonElement = document.createElement('button');
        delBtnEl.innerText = '🗑️';
        btnContainer.appendChild(completeBtnEl);
        btnContainer.appendChild(editBtnEl);
        btnContainer.appendChild(delBtnEl);

        todoEl.appendChild(todoTitleEl);
        todoEl.appendChild(btnContainer);

        return todoEl;
    }

    // Render a Todo
    renderTodo(todo: Todo) {
        if (this.todos.length === 1) {
            notFoundContainer?.classList.remove('active');
        }
        const todoEl = this.createTodoElement(todo);
        todosContainer.appendChild(todoEl);
    }

    // Render all Todos
    renderAllTodos() {
        notFoundContainer?.classList.remove('active');
        this.todos.forEach(todo => {
            const todoEl = this.createTodoElement(todo);
            todosContainer.appendChild(todoEl);
        })
    }

    // Update Todo Header
    updateTodoHeader() {
        totalTodosEl.innerText = this.todos.length.toString();
        let completed = 0;
        this.todos.forEach(todo => {
            if (todo.completed) completed++;
        })
        completedTodosEl.innerText = completed.toString();
    }
}

const todolist = new TodoList();

todoForm?.addEventListener('submit', (e: SubmitEvent) => {
    e.preventDefault();
    const todoTitle: string = todoInput.value;
    if (todoTitle.trim() === '') return;
    todolist.addNewTodo(todoTitle);
})
