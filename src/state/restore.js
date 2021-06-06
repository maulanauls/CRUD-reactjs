import { useContext, useEffect } from "react";
import { Context } from "../state/store";
import storage from "../helper/storage";

const Restore = ({ children }) => {
  const [state, dispatch] = useContext(Context);

  useEffect(() => {
    let process = async () => {
      try {
        /* populate */
        // user reducer
        const payload_user = await storage.get("token");

        /* set to context */
        dispatch({ type: "RESTORE:TOKEN", payload: payload_user });
      } catch (error) {
        console.log(error);
        console.log("failed re-store state");
      }
    };
    process();
  }, []);

  return children;
};

export default Restore;
