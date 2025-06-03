<script>
    export let data;
    import { onMount } from 'svelte';
    import { fetchTodos, addTodo, deleteTodo } from '$lib/api.js';

    let todos = data.todos;
    let newTodo = '';
    let loading = false;

    async function refreshTodos() {
        todos = await fetchTodos();
    }

    async function handleAddTodo() {
        if (!newTodo.trim()) return;
        loading = true;
        todos = await addTodo(newTodo);
        newTodo = '';
        loading = false;
    }

    async function handleDeleteTodo(id) {
        todos = await deleteTodo(id);
    }

    async function toggleDone(todo) {
    await fetch(`http://localhost:4000/api/todos/${todo._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...todo, done: !todo.done })
        });
        await refreshTodos();
    }

    onMount(refreshTodos);

    $: todosTodo = todos.filter(t => !t.done);
    $: todosDone = todos.filter(t => t.done);
</script>

<main>
    <h1>Todo List</h1>
    <form on:submit|preventDefault={handleAddTodo}>
        <input type="text" placeholder="Add task" bind:value={newTodo} autocomplete="off" />
        <button type="submit" disabled={loading}>Add</button>
    </form>
    <div class="columns">
        <div class="column">
        <div class="column-title">All tasks</div>
        <ul>
            {#each todos as todo}
            <li>
                <span class="task-text">{todo.text}</span>
                <button class="trash-btn" aria-label="Supprimer" on:click={() => handleDeleteTodo(todo._id)}>
                <svg class="trash-icon" viewBox="0 0 20 20">
                    <path d="M7 8a1 1 0 012 0v5a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v5a1 1 0 11-2 0V8z"/>
                    <path fill-rule="evenodd" d="M5 6a2 2 0 012-2h6a2 2 0 012 2v1h2a1 1 0 110 2h-1.07l-.938 7.484A2 2 0 0111.01 18H8.99a2 2 0 01-1.982-1.516L6.07 9H5a1 1 0 110-2h2V6zm2-1a1 1 0 00-1 1v1h8V6a1 1 0 00-1-1H7zm3 12a1 1 0 001-1v-1H9v1a1 1 0 001 1z" clip-rule="evenodd"/>
                </svg>
                </button>
            </li>
            {/each}
        </ul>
        </div>

        <div class="column">
        <div class="column-title">ToDo</div>
        <ul>
            {#each todosTodo as todo (todo._id)}
            <li>
                <label style="display:flex;align-items:center;width:100%;">
                <input type="checkbox" class="checkbox" checked={todo.done} on:change={() => toggleDone(todo)} />
                <span class="task-text">{todo.text}</span>
                </label>
            </li>
            {/each}
        </ul>
        </div>

        <div class="column">
        <div class="column-title">Done</div>
        <ul>
            {#each todosDone as todo}
            <li>
                <label style="display:flex;align-items:center;width:100%;">
                <input type="checkbox" class="checkbox" checked={todo.done} on:change={() => toggleDone(todo)} />
                <span class="task-text">{todo.text}</span>
                </label>
            </li>
            {/each}
        </ul>
        </div>
    </div>
</main>

<style>
    main {
        max-width: 1100px;
        margin: 40px auto;
        background: #fff;
        border-radius: 18px;
        box-shadow: 0 4px 24px 0 rgba(0,0,0,0.10);
        padding: 2.5rem 2rem 2rem 2rem;
    }
    h1 {
        text-align: center;
        color: #1e293b;
        margin-bottom: 2rem;
        font-size: 2rem;
        letter-spacing: 1px;
    }
    .columns {
        display: flex;
        gap: 2rem;
        justify-content: space-between;
    }
    .column {
        flex: 1;
        background: #f8fafc;
        border-radius: 12px;
        padding: 1.2rem;
        box-shadow: 0 1px 8px 0 rgba(59,130,246,0.04);
        min-width: 0;
        display: flex;
        flex-direction: column;
        min-height: 400px;
    }
    .column-title {
        text-align: center;
        font-size: 1.2rem;
        color: #334155;
        font-weight: bold;
        margin-bottom: 1rem;
        letter-spacing: 1px;
    }
    form {
        display: flex;
        gap: 10px;
        margin-bottom: 1.5rem;
    }
    input[type="text"] {
        flex: 1;
        padding: 0.7rem 1rem;
        border: 1.5px solid #e5e7eb;
        border-radius: 8px;
        font-size: 1rem;
        transition: border-color 0.2s;
    }
    input[type="text"]:focus {
        outline: none;
        border-color: #3b82f6;
    }
    button {
        padding: 0.7rem 1.2rem;
        border: none;
        border-radius: 8px;
        background: linear-gradient(90deg,#3b82f6 60%, #6366f1 100%);
        color: #fff;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        transition: background 0.2s, filter 0.2s;
        box-shadow: 0 1px 8px 0 rgba(59,130,246,0.10);
    }
    button:disabled {
        background: #cbd5e1;
        cursor: not-allowed;
    }
    ul {
        list-style: none;
        padding: 0;
        margin: 0;
        flex: 1;
    }
    li {
        background: #f3f4f6;
        margin-bottom: 0.7rem;
        border-radius: 8px;
        padding: 1rem;
        font-size: 1.05rem;
        color: #1e293b;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0 1px 4px 0 rgba(0,0,0,0.04);
        transition: background 0.2s;
    }
    li:last-child {
        margin-bottom: 0;
    }
    .trash-btn {
        background: none;
        border: none;
        padding: 0.2rem 0.3rem;
        margin-left: 1rem;
        cursor: pointer;
        border-radius: 4px;
        transition: background 0.2s;
        display: flex;
        align-items: center;
    }
    .trash-btn:hover {
        background: #fee2e2;
    }
    .trash-icon {
        width: 22px;
        height: 22px;
        fill: #ef4444;
        transition: fill 0.2s;
    }
    .trash-btn:hover .trash-icon {
        fill: #dc2626;
    }
    .checkbox {
        width: 1.25rem;
        height: 1.25rem;
        accent-color: #3b82f6;
        margin-right: 0.7rem;
        cursor: pointer;
    }
    .task-text {
        flex: 1;
        word-break: break-all;
    }
    @media (max-width: 900px) {
        .columns {
        flex-direction: column;
        gap: 1.5rem;
        }
        .column { min-height: 0; }
    }
</style>