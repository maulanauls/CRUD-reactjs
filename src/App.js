import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
import { LightTheme, BaseProvider, styled } from "baseui";
import { Button, SIZE } from "baseui/button";
import React, { useContext, useState, useEffect } from "react";
import { Notification, KIND } from "baseui/notification";
import { AppNavBar } from "baseui/app-nav-bar";
import Store from "../src/state/store";
import { Context } from "./state/store";
import Restore from "../src/state/restore";
import useHttp from "./helper/http";
import user_action from "./state/actions/user.action";
import Table from "../src/components/user.table";
import { Block } from "baseui/block";
const engine = new Styletron();
const Centered = styled("div", {
  display: "flex",
  overflow: "hidden",
  flexDirection: "row",
  width: "100%",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  padding: "10px",
});
const Col = styled("div", {
  flexGrow: 1,
});
export default function App() {
  const http = useHttp();
  const [state, dispatch] = useContext(Context);
  const { token } = state.user_reducer;
  const [progress, setIsProgress] = useState(false);

  const generateToken = () => {
    setIsProgress(true);
    user_action
      .generate_token(dispatch, http, "")
      .finally(() => {
        setIsProgress(false);
      })
      .catch((error) => {
        console.log(error);
        setIsProgress(false);
      });
  };

  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>
        <Block style={{height: "100%"}}>
          <AppNavBar title="EX" />
          <Centered>
            <Col>
              <Notification kind={KIND.negative}>
                {() =>
                  "Before start please the try to generate token for accessing the user data !!"
                }
              </Notification>
              <Button
                onClick={() => generateToken()}
                kind={KIND.secondary}
                size={SIZE.compact}
                isLoading={progress}
              >
                generate token
              </Button>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 40,
                }}
              >
                {!!token ? (
                  <Table />
                ) : (
                  <Centered>
                    <p>Please generate the token before get user data</p>
                  </Centered>
                )}
              </div>
            </Col>
          </Centered>
        </Block>
      </BaseProvider>
    </StyletronProvider>
  );
}
