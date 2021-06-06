import { useContext } from "react";
import { Context } from "../state/store";
import Axios from "axios";
import user_action from "../state/actions/user.action";

const useHttp = () => {
  const [state, dispatch] = useContext(Context);
  
  const { token } = state.user_reducer;

  const Authorization = token ? { "Authorization": "Bearer " + token } : {};

  const http = Axios.create({
    baseURL: "http://achmad-maulana.levlet.io/api/v1/",
    responseType: "json",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      ...Authorization,
    },
    transformResponse: [
      function (data) {
        if (!data.status && !!data.message) {
          if (
            (!!data.message.name && data.message.name === "TokenExpiredError") ||
            data.message.name === "JsonWebTokenError"
          ) {
            // user_action.logout(dispatch);
          }
        } else {
          return data;
        }
        return data;
      },
    ],
  });

  return http;
};

export default useHttp;
