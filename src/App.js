import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./page/home";
import Sidebar from "./components/sidebar";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          exact
          path="/home"
          element={
            <>
              <Sidebar>
                <Home />
              </Sidebar>
            </>
          }
        />
        <Route
          exact
          path="/2"
          element={
            <>
              <Sidebar>
                2
              </Sidebar>
            </>
          }
        />
        <Route
          exact
          path="/3"
          element={
            <>
              <Sidebar>
                3
              </Sidebar>
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
