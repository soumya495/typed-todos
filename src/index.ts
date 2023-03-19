const todoForm = document.querySelector('[data-todo-form]') as HTMLFormElement;
const todoInput = document.querySelector('[data-todo-input]') as HTMLInputElement;
const todoFormBtn = document.querySelector('[data-todo-form-button]') as HTMLButtonElement;
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
    editMode: boolean;
    editIds: string[];
    editId: string | null;

    constructor() {
        const typedTodos: string | null = localStorage.getItem('typed-todos');
        // No Todos in localStorage
        if (typedTodos === null) this.todos = [];
        // Render todos present in localStorage
        else {
            this.todos = JSON.parse(typedTodos);
            this.updateTodoHeader();
            this.renderAllTodos();
        }
        this.editMode = false;
        this.editIds = [];
        this.editId = null;
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

        completeBtnEl.addEventListener('click', () => this.handleCompleted(todo, todoEl));
        editBtnEl.addEventListener('click', () => this.handleEdit(todo));
        delBtnEl.addEventListener('click', () => this.handleDelete(todo.id));

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
        todosContainer.innerHTML = '';
        if (this.todos.length === 0) {
            notFoundContainer?.classList.add('active');
            return;
        }
        notFoundContainer?.classList.remove('active');
        this.todos.forEach(todo => {
            const todoEl = this.createTodoElement(todo);
            if (todo.completed) todoEl.classList.add('completed')
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

    // Handle Complete state of todo
    handleCompleted(myTodo: Todo, todoEl: HTMLDivElement) {
        this.todos = this.todos.map((todo) => {
            if (todo.id === myTodo.id) {
                if (todo.completed) {
                    todoEl.classList.remove('completed')
                } else {
                    todoEl.classList.add('completed')
                }
                return {
                    ...todo,
                    completed: !todo.completed
                }

            } else {
                return todo
            }
        })
        localStorage.setItem('typed-todos', JSON.stringify(this.todos));
        this.updateTodoHeader();
    }

    // handle editing of Todo
    handleEdit(myTodo: Todo) {
        if (this.editIds.length === 0 || !this.editIds.includes(myTodo.id)) {
            this.editMode = true;
            this.editIds.push(myTodo.id);
            this.editId = myTodo.id;
            todoInput.value = myTodo.title;
            todoInput.placeholder = 'Edit Your Todo ...';
            todoFormBtn.innerText = 'Edit';
        } else { // Undo Edit
            this.editMode = false;
            this.editIds = this.editIds.filter(editId => editId !== myTodo.id);
            this.editId = null;
            todoInput.value = '';
            todoInput.placeholder = 'Add Your Todo ...';
            todoFormBtn.innerText = 'Add';
        }
    }

    // Update Todo
    updateTodo(updatedTitle: string) {
        this.todos = this.todos.map(todo => {
            if (todo.id === this.editId) {
                return {
                    ...todo,
                    title: updatedTitle
                }
            } else {
                return todo;
            }
        })
        this.renderAllTodos();
        todoInput.value = '';
        todoInput.placeholder = 'Add Your Todo ...';
        todoFormBtn.innerText = 'Add';
        this.editMode = false;
        this.editIds = [];
        this.editId = null;
        localStorage.setItem('typed-todos', JSON.stringify(this.todos));
    }

    //Delete Todo
    handleDelete(todoId: string) {
        this.todos = this.todos.filter(todo => todo.id !== todoId);
        if (this.todos.length === 0) {
            localStorage.removeItem('typed-todos');
        } else {
            localStorage.setItem('typed-todos', JSON.stringify(this.todos));
        }
        this.renderAllTodos();
        this.updateTodoHeader();
    }
}

const todolist = new TodoList();

todoForm?.addEventListener('submit', (e: SubmitEvent) => {
    e.preventDefault();
    const todoTitle: string = todoInput.value;
    if (todoTitle.trim() === '') return;
    if (!todolist.editMode)
        todolist.addNewTodo(todoTitle);
    else todolist.updateTodo(todoTitle);
})
