const initialState = {
  counter: 0,
  results: [],
};

// reducer
const reducer = (state = initialState, action) => {
  if (action.type === "INCREMENT") {
    return {
      ...state,
      counter: state.counter + 1,
    };
  }

  if (action.type === "DECREMENT") {
    return {
      ...state,
      counter: state.counter - 1,
    };
  }

  if (action.type === "ADD") {
    return {
      ...state,
      counter: state.counter + action.value,
    };
  }

  if (action.type === "SUBTRACT") {
    return {
      ...state,
      counter: state.counter - action.value,
    };
  }

  if (action.type === "STORE_RESULT") {
    return {
      ...state,
      results: state.results.concat({
        id: new Date(),
        value: state.counter,
      }),
    };
  }

  if (action.type === "DELETE_RESULT") {
    const updatedArray = state.results.filter((result, index) => {
      return result.id !== action.resultElementId;
    });

    return {
      ...state,
      results: updatedArray,
    };
  }

  return state;
};

export default reducer;
