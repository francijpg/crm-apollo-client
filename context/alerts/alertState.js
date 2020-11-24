import { useReducer } from "react";
import alertContext from "./alertContext";
import alertReducer from "./alertReducer";

import { SHOW_ALERT, HIDE_ALERT } from "../../types";

const initialState = {
  alert: null,
};

const AlertState = ({ children }) => {
  const [state, dispatch] = useReducer(alertReducer, initialState);

  const showAlert = (message, type) => {
    dispatch({
      type: SHOW_ALERT,
      payload: {
        message,
        type,
      },
    });

    setTimeout(() => {
      dispatch({
        type: HIDE_ALERT,
      });
    }, 3000);
  };

  return (
    <alertContext.Provider
      value={{
        alert: state.alert,
        showAlert,
      }}
    >
      {children}
    </alertContext.Provider>
  );
};

export default AlertState;
