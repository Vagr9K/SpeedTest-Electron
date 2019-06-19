import React from "react";
import { render } from "react-dom";
import { AppContainer } from "react-hot-loader";
import { createHashHistory } from "history";
import Root from "./containers/Root";

render(
  <AppContainer>
    <Root history={createHashHistory} />
  </AppContainer>,
  document.getElementById("root")
);

if (module.hot) {
  module.hot.accept("./containers/Root", () => {
    // eslint-disable-next-line global-require
    const NextRoot = require("./containers/Root").default;
    render(
      <AppContainer>
        <NextRoot history={createHashHistory} />
      </AppContainer>,
      document.getElementById("root")
    );
  });
}
