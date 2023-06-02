import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./page/home";
import Sidebar from "./layout/sidebar";
import Login from "./page/login";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          exact
          path="/login"
          element={
            <>
              <Login />
            </>
          }
        />
        <Route
          exact
          path="/"
          element={
            <>
              <Home />
            </>
          }
        />
        <Route
          exact
          path="/2"
          element={
            <>
              <Sidebar>2</Sidebar>
            </>
          }
        />
        <Route
          exact
          path="/3"
          element={
            <>
              <Sidebar>3</Sidebar>
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
