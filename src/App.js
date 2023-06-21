import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ListAdmin from "./pages/admin/list-admin";
import Layout from "./layouts/layout";
import Login from "./pages/login";
import CreateAdmin from "./pages/admin/create-admin";
import CreateCommander from "./pages/admin/create-commander";
import ListCommander from "./pages/admin/list-commander";
import { useAuth } from "./contexts/auth-context";

const App = () => {
  const { auth } = useAuth();
  const role = auth?.user?.role
  return (
    <Router>
      <Layout>
        <Routes>
          <Route exact path="/login" element={<Login />} />
          //
          {role === "0" && ( //admin
            <>
             <Route exact path="/" element={<>admin</>} />
              <Route exact path="/user-management/admin/list" element={<ListAdmin />} />
              <Route exact path="/user-management/commander/list" element={<ListCommander />} />
              <Route exact path="/user-management/admin/create" element={<CreateAdmin/>} />
              <Route exact path="/user-management/commander/create" element={<CreateCommander/>} />
              <Route exact path="/3" element={<>3</>} />
            </>
          )}
          {role === "1" && ( //commander
            <>
              <Route exact path="/" element={<>commander</>} />
            </>
          )}
           {role === "2" && ( //Scene Investigator
            <>
              <Route exact path="/" element={<>Scene Investigator</>} />
            </>
          )}
           {role === "3" && ( //Director
            <>
              <Route exact path="/" element={<>Director</>} />
            </>
          )}
           {role === "4" && ( //Expert
            <>
              <Route exact path="/" element={<>Expert</>} />
            </>
          )}
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
