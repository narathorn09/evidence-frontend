import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Layout from "./layouts/layout";
import Login from "./pages/login";

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/" element={<Home />} />
          <Route exact path="/2" element={<>2</>} />
          <Route exact path="/3" element={<>3</>} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
