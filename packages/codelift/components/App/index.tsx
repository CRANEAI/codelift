import {
  Alert,
  AlertTitle,
  Box,
  CircularProgress,
  Grid
} from "@chakra-ui/core";
import React, { FunctionComponent } from "react";
import { createClient, Provider } from "urql";
import { CSSInspector } from "../CSSInspector";
import { Selector } from "../Selector";
import { observer, useStore } from "../Store";
import { TreeInspector } from "../TreeInspector";
import { Error } from "./Error";
import { Sidebar } from "./Sidebar";

const client = createClient({ url: "/api" });

export const App: FunctionComponent = observer(() => {
  const store = useStore();

  const { href, origin } = window.location;
  const path = href.split(origin).pop();

  return (
    <Provider value={client}>
      {store.isOpen && <Selector node={store.selected} />}

      <Grid
        gridTemplateColumns={`${store.isOpen ? "16rem" : 0} 1fr ${
          store.isOpen ? "16rem" : 0
        }`}
        style={{ transition: "all 200ms ease-in-out" }}
      >
        <Sidebar>
          {store.root ? (
            <TreeInspector />
          ) : store.error ? (
            <Error />
          ) : (
            <Alert
              flexDirection="column"
              paddingY="4"
              status="info"
              variant="left-accent"
            >
              <AlertTitle color="white" fontSize="xl">
                <CircularProgress isIndeterminate size="70%" marginRight="2" />
                Loading
              </AlertTitle>
            </Alert>
          )}
        </Sidebar>

        <Box as="main" boxShadow="lg" height="100vh" overflow="auto" zIndex={1}>
          <iframe
            onLoad={store.handleFrameLoad}
            src={`http://localhost:3000${path}`}
            style={{ width: "100%", height: "100%" }}
            title="Source"
          />
        </Box>

        <Sidebar>
          <CSSInspector />
        </Sidebar>
      </Grid>
    </Provider>
  );
});
