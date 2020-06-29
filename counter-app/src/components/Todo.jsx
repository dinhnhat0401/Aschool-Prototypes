import React, { useState } from "react";

function Todo(props) {
  const [todoName, setTodoName] = useState("");
  const [todoList, setTodoList] = useState([]);

  const todoAddHandler = () => {
    setTodoList(todoList.concat(todoName));
  };

  const inputChangeHandler = (event) => {
    console.log(event.target.value);
    setTodoName(event.target.value);
  };

  return (
    <React.Fragment>
      <input
        type="text"
        placeholder="Todo"
        onChange={inputChangeHandler}
        value={todoName}
      />
      <button type="button" onClick={todoAddHandler}>
        Add
      </button>
      <ul>
        {todoList.map((todo) => (
          <li key={todo}>{todo}</li>
        ))}
      </ul>
    </React.Fragment>
  );
}

export default Todo;
