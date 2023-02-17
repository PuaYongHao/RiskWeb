import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import LoginPage from "./view/LoginPage";
import MainPage from "./view/MainPage";
import DashBoardPage from "./view/DashBoardPage";
import "bootstrap/dist/css/bootstrap.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "main",
    element: <MainPage />,
  },
  {
    path: "dashboard",
    element: <DashBoardPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
