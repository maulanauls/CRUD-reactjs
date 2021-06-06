import React, { createContext, useReducer } from "react";
import logger from "use-reducer-logger";
import Reducer, { initState } from "../state/reducers";

const useStore = (rootReducer, state) => {
  const initialState = state || initState;
  return useReducer(rootReducer, initialState);
};

const Store = ({ children }) => {
  const [state, dispatch] = useStore(
    process.env.NODE_ENV === "development" ? logger(Reducer) : Reducer
  );

  return (
    <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
  );
};
export const Context = createContext([[], () => {}]);
export default Store;
