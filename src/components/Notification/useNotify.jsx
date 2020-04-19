// @flow
import { useContext } from "react";

import NotificationContext from "./context";

const useNotify = () => {
  const showNotification = useContext(NotificationContext);

  return {
    info: (message: string) => showNotification(message, "info"),
    error: (message: string) => showNotification(message, "error"),
    success: (message: string) => showNotification(message, "success"),
    warning: (message: string) => showNotification(message, "warning")
  };
};

export default useNotify;
