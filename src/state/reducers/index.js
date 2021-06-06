
import user_reducer from "./user.reducer";


const reducers = {
  user_reducer
};

const getInitState = (reducerDict) => {
  return Object.keys(reducerDict).reduce((acc, curr) => {
    const slice = reducerDict[curr](undefined, { type: undefined });
    return { ...acc, [curr]: slice };
  }, {});
};

const combineReducers = (reducer) => {
  const _initState = getInitState(reducer);
  return function (state = _initState, action) {
    return Object.keys(reducer).reduce((acc, curr) => {
      let slice = reducer[curr](state[curr], action);
      return { ...acc, [curr]: slice };
    }, state);
  };
};

export const initState = getInitState(reducers);
export default combineReducers(reducers);
