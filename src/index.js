import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./input.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import { ConfigProvider } from "antd";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthProvider } from "./contexts/auth-context";
const root = ReactDOM.createRoot(document.getElementById("root"));


const themeMUI = createTheme({
  palette: {
    primary: {
      main: "#7D3232",
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
        colorPrimary: "#7D3232",
        colorBgBase: "#fffffF",
        controlOutline: "#7D3232",
        controlOutlineWidth: 0.5,
        controlItemBgHover: "rgb(125, 50, 50, 0.09)",
        controlItemBgActive: "rgb(125, 50, 50, 0.09)",
        // algorithm: theme.darkAlgorithm,
      },
    }}
  >
    <React.StrictMode>
      <ThemeProvider theme={themeMUI}>
        <AuthProvider>
          <App />
        </AuthProvider>
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
