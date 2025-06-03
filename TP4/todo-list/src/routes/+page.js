export async function load({ fetch }) {
    const res = await fetch("http://localhost:4000/api/todos");
    const todos = await res.json();
    return { todos };
}