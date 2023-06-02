import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import { ConfigProvider, theme } from "antd";
import { createTheme, ThemeProvider } from "@mui/material/styles";
const root = ReactDOM.createRoot(document.getElementById("root"));

const themeMUI = createTheme({
  palette: {
    primary: {
      main: "#001529",
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
        colorPrimary: "#001529",
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
