// @flow
import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import AuthUserContext from "./context";
import { withFirebase } from "../Firebase";

const needsEmailVerification = authUser =>
  authUser &&
  !authUser.emailVerified &&
  authUser.providerData
    .map(provider => provider.providerId)
    .includes("password");

const withEmailVerification = Component => {
  class WithEmailVerification extends React.Component<*, *> {
    constructor(props) {
      super(props);
      this.state = { isSent: false };
    }

    onSendEmailVerification = () => {
      this.props.firebase.auth
        .doSendEmailVerification()
        .then(() => this.setState({ isSent: true }));
    };

    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser =>
            needsEmailVerification(authUser) ? (
              <Container maxWidth={"sm"} style={{ marginTop: "24px" }}>
                {this.state.isSent ? (
                  <Typography>
                    E-Mail confirmation sent: Check you E-Mails (Spam folder
                    included) for a confirmation E-Mail. Refresh this page once
                    you confirmed your E-Mail.
                  </Typography>
                ) : (
                  <Typography>
                    Verify your E-Mail: Check you E-Mails (Spam folder included)
                    for a confirmation E-Mail or send another confirmation
                    E-Mail.
                  </Typography>
                )}
                <Button
                  variant={"contained"}
                  size={"large"}
                  color={"primary"}
                  style={{ marginTop: "24px" }}
                  fullWidth
                  onClick={this.onSendEmailVerification}
                  disabled={this.state.isSent}
                >
                  Send confirmation E-Mail
                </Button>
              </Container>
            ) : (
              <Component {...this.props} />
            )
          }
        </AuthUserContext.Consumer>
      );
    }
  }
  return withFirebase(WithEmailVerification);
};
export default withEmailVerification;
