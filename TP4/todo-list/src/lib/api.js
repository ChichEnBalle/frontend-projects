const API_URL = 'http://localhost:4000/api/todos';

export async function fetchTodos() {
    const res = await fetch(API_URL);
    return res.json();
}

export async function addTodo(text) {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    });
    return res.json();
}

export async function deleteTodo(id) {
    const res = await fetch(`http://localhost:4000/api/todos/${id}`, {
        method: 'DELETE'
    });
    return res.json();
}