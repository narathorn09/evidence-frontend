import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./input.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import { ConfigProvider } from "antd";
import { createTheme, ThemeProvider } from "@mui/material/styles";
const root = ReactDOM.createRoot(document.getElementById("root"));

const themeMUI = createTheme({
  palette: {
    primary: {
      main: "#2A2F4F",
    },
    secondary: {
      main: "#fffffF",
    },
  },
});

root.render(
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: "#2A2F4F",
        colorBgBase: "#fffffF",
        // algorithm: theme.darkAlgorithm,
      },
    }}
  >
    <React.StrictMode>
      <ThemeProvider theme={themeMUI}>
        <App />
      </ThemeProvider>
    </React.StrictMode>
  </ConfigProvider>
);

// ReactDOM.render(
//   <ThemeProvider theme={theme}>
//     <CssBaseline />
//     <AuthProvider>
//       <App />
//     </AuthProvider>
//   </ThemeProvider>,
//   document.getElementById("app")
// );

serviceWorkerRegistration.register();

reportWebVitals();
