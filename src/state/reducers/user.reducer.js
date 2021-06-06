const initialState = {
  token: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "CREATE_TOKEN":
      return {
        ...state,
        ...action.payload,
      };

    case "RESTORE:TOKEN":
      return {
        ...action.payload,
      };

    default:
      return state;
  }
};
