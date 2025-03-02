<script lang="ts">
  import { Query } from "zero-svelte";
  import { Z } from "$lib/zero/Z.svelte";
  import { schema, type Schema } from "@sst-zero-template/zero/schema";

  const z = new Z<Schema>({
    server: import.meta.env.VITE_ZERO_SERVER_URL,
    schema,
    userID: "anon",
  });

  const todos_query = z.current.query.foo;
  const todos = new Query(todos_query);

  const randID = () => Math.random().toString(36).slice(2);

  function onsubmit(event: Event) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const newTodo = formData.get("newTodo") as string;
    const id = randID();
    if (newTodo) {
      z.current.mutate.foo.insert({
        id,
        title: newTodo,
        completed: false,
      });
      (event.target as HTMLFormElement).reset();
    }
  }

  function toggleTodo(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const id = checkbox.value;
    const completed = checkbox.checked;
    z.current.mutate.foo.update({ id, completed });
  }
</script>

<div>
  <h1>Todo</h1>
  <form {onsubmit}>
    <input type="text" id="newTodo" name="newTodo" />
    <button type="submit">Add</button>
  </form>
  <ul>
    {#each todos.current as todo (todo.id)}
      <li>
        <input
          type="checkbox"
          value={todo.id}
          checked={todo.completed}
          oninput={toggleTodo}
        />{todo.title}
      </li>
    {/each}
  </ul>
</div>
