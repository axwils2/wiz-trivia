// @flow
import * as React from "react";
import { useState } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import NotificationContext from "./context";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const NotificationProvider = ({ children }: { children: React.Node }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info");

  const showNotification = (message: string, severity: string) => {
    setMessage(message);
    setSeverity(severity);
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;

    setOpen(false);
  };

  const anchorOrigin =
    window.innerWidth > 600
      ? { vertical: "bottom", horizontal: "left" }
      : { vertical: "top", horizontal: "center" };

  return (
    <NotificationContext.Provider value={showNotification}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={anchorOrigin}
      >
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
