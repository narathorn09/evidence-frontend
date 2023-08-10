import React from "react";
import { BrowserRouter as Router, Route, Routes , Navigate  } from "react-router-dom";
import { useAuth } from "./contexts/auth-context";
import ListAdmin from "./pages/admin/list-admin";
import Layout from "./layouts/layout";
import Login from "./pages/login";
import CreateAdmin from "./pages/admin/create-admin";
import CreateCommander from "./pages/admin/create-commander";
import ListCommander from "./pages/admin/list-commander";
import ListDirector from "./pages/admin/list-director";
import CreateDirector from "./pages/admin/create-director";
import ListGroup from "./pages/admin/list-group";
import CreateGroup from "./pages/admin/create-group";
import ListSceneInvestigator from "./pages/admin/list-scene-investigators";
import CreateSceneInvestigator from "./pages/admin/create-scene-investigators";
import ListExpert from "./pages/admin/list-expert";
import CreateExpert from "./pages/admin/create-expert";
import HomeAdmin from "./pages/admin/home-admin";
import UpdateAdmin from "./pages/admin/update-admin";
import UpdateCommander from "./pages/admin/update-commander";
import UpdateDirector from "./pages/admin/update-director";
import UpdateSceneInvestigator from "./pages/admin/update-scene-investigators";
import UpdateExpert from "./pages/admin/update-expert";
import UpdateGroup from "./pages/admin/update-group";
import Profile from "./pages/profile/profile";
import ListTypeEvidence from "./pages/sceneInvestigator/list-typeEvidence";
import CreateTypeEvidence from "./pages/sceneInvestigator/create-typeEvidence";
import UpdateTypeEvidence from "./pages/sceneInvestigator/update-typeEvidence";
import CreateCase from "./pages/sceneInvestigator/create-case";
import ListCase from "./pages/sceneInvestigator/list-case";
import GetCaseById from "./pages/sceneInvestigator/getbyid-case";
import UpdateCase from "./pages/sceneInvestigator/update-case";
import ListCaseAssign from "./pages/director/list-case-assign";
import GetCaseAssignById from "./pages/director/getbyid-case-assign";

const App = () => {
  const { auth } = useAuth();
  const role = auth?.user?.role
  return (
    <Router>
      <Layout>
        <Routes>
          <Route  path="/login" element={<Login />} />
          <Route exact path="/" element={<Navigate to="/home" />} />
          <Route exact path="/profile/:id" element={<Profile />} />
          {role === "0" && ( //admin
            <>
              <Route exact path="/home" element={<HomeAdmin/>} />
              <Route exact path="/user-management/admin/list" element={<ListAdmin />} />
              <Route exact path="/user-management/commander/list" element={<ListCommander />} />
              <Route exact path="/user-management/director/list" element={<ListDirector />} />
              <Route exact path="/user-management/scene-investigator/list" element={<ListSceneInvestigator />} />
              <Route exact path="/user-management/expert/list" element={<ListExpert />} />

              <Route exact path="/user-management/admin/create" element={<CreateAdmin/>} />
              <Route exact path="/user-management/commander/create" element={<CreateCommander/>} />
              <Route exact path="/user-management/director/create" element={<CreateDirector/>} />
              <Route exact path="/user-management/scene-investigator/create" element={<CreateSceneInvestigator/>} />
              <Route exact path="/user-management/expert/create" element={<CreateExpert/>} />
              <Route exact path="/user-management/admin/update/:id" element={<UpdateAdmin/>} />
              <Route exact path="/user-management/commander/update/:id" element={<UpdateCommander/>} />
              <Route exact path="/user-management/director/update/:id" element={<UpdateDirector/>} />
              <Route exact path="/user-management/scene-investigator/update/:id" element={<UpdateSceneInvestigator/>} />
              <Route exact path="/user-management/expert/update/:id" element={<UpdateExpert/>} />
              <Route exact path="/group-management/list" element={<ListGroup />} />
              <Route exact path="/group-management/create" element={<CreateGroup />} />
              <Route exact path="/group-management/update/:id" element={<UpdateGroup />} />
            </>
          )}
          {role === "1" && ( //commander
            <>
              <Route exact path="/home" element={<>Home commander</>} />
            </>
          )}
           {role === "2" && ( //Scene Investigator
            <>
              <Route exact path="/home" element={<>Home Scene Investigator</>} />
              <Route exact path="/inves/manage-case" element={<>Scene Investigator</>} />
              <Route exact path="/inves/manage-case/list" element={<ListCase />} />
              <Route exact path="/inves/manage-case/create" element={<CreateCase />} />
              <Route exact path="/inves/manage-case/casebyid/:caseId" element={<GetCaseById />} />
              <Route exact path="/inves/manage-case/update/:caseId" element={<UpdateCase />} />
              <Route exact path="/inves/manage-type-evidence/list" element={<ListTypeEvidence />} />
              <Route exact path="/inves/manage-type-evidence/create" element={<CreateTypeEvidence />} />
              <Route exact path="/inves/manage-type-evidence/update/:id" element={<UpdateTypeEvidence />} />
              <Route exact path="/inves/manage-report" element={<>report</>} />
            </>
          )}
           {role === "3" && ( //Director
            <>
              <Route exact path="/home" element={<>Home Director</>} />
              <Route exact path="/director/manage-case/list" element={<ListCaseAssign />} />
              <Route exact path="/director/manage-case/casebyid/:caseId" element={<GetCaseAssignById />} />

            </>
          )}
           {role === "4" && ( //Expert
            <>
              <Route exact path="/home" element={<>Home Expert</>} />
            </>
          )}
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
