import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminList from "./pages/admin/admin-list";
import Layout from "./layouts/layout";
import Login from "./pages/login";
import AdminCreate from "./pages/admin/admin-create";

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/user-management/admin/list" element={<AdminList />} />
          <Route exact path="/user-management/admin/create" element={<AdminCreate/>} />
          <Route exact path="/3" element={<>3</>} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
