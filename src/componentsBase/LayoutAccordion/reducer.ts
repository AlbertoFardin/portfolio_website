export interface IState {
  [id: string]: boolean;
}

function reducer(oldState: IState, action) {
  const { id: idAction } = action;
  const newState = Object.keys(oldState).reduce((acc, id) => {
    if (id === idAction) {
      acc[id] = !oldState[id];
    } else {
      acc[id] = false;
    }

    return acc;
  }, {});
  return newState;
}

export default reducer;
