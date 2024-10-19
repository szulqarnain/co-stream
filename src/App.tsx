import React from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import LoginPage from "./pages/LoginPage";

import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import Admin from "./Admin";
import HomePage from "./pages/user/HomePage";
import SpacePage from "./pages/user/SpacePage";
import CreateSpacePage from "./pages/user/CreateSpacePage";
import CreateStreamPage from "./pages/user/CreateStreamPage";
import ShareScreenPage from "./pages/user/ShareScreenPage";
import WatchPage from "./pages/user/WatchPage";

// if (__DEV__) {
// Adds messages only in a dev environment
loadDevMessages();
loadErrorMessages();
// }

function App() {
  return (
    <>
      <BrowserRouter basename={"/"}>
        <Routes>
          <Route path="/user" element={<ProtectedRoute role="user" />}>
            <Route index element={<HomePage />} />
            <Route path="space/:id" element={<SpacePage />} />
            <Route path="watch/:id" element={<WatchPage />} />
            <Route path="share-screen/:id" element={<ShareScreenPage />} />

            <Route path="create" element={<CreateSpacePage />} />
            <Route path="stream" element={<CreateStreamPage />} />
            {/* <Route path="channels" element={<HomePage />} />
            <Route path="create" element={<Admin />} /> */}
          </Route>

          {/* <Route path="/admin" element={<ProtectedRoute role="admin" />}>
            <Route path="profile" element={<ProfilePage />} />
          </Route> */}
        </Routes>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          {/* <Route path="/lost-password" element={<ForgotPasswordPage />} />
          <Route path="/sign-up" element={<SignupPage />} /> */}
          <Route path="/" element={<Navigate to={"/login"} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
