import storage from "../../helper/storage";

const user_action = {
  generate_token: (dispatch, http, payload) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await http.get("generate-token", payload);
        if (data.status) {
          await storage.set("token", data.result);
          dispatch({ type: "CREATE_TOKEN", payload: data.result });
          resolve();
        } else {
          reject(data.error);
        }
      } catch (error) {
        reject("Oops..! System have trouble.");
      }
    });
  }
};

export default user_action;
