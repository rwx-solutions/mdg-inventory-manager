import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";
import "./index.css";
import { Layout } from "./layout/Layout";
import AccountSettings from "./pages/AccountSettings";
import AddInventory from "./pages/AddInventory";
import Login from "./pages/Login";
import SearchInventory from "./pages/SearchInventory";
import Signup from "./pages/Signup";
import ViewInventory from "./pages/ViewInventory";
import { ProtectedRoute } from "./router/ProtectedRoute";
import { PublicRoute } from "./router/PublicRoute";

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <ProtectedRoute component={SearchInventory} />,
      },
      {
        path: "add-inventory",
        element: <ProtectedRoute component={AddInventory} />,
      },
      {
        path: "view-inventory",
        element: <ProtectedRoute component={ViewInventory} />,
      },
      {
        path: "account-settings",
        element: <ProtectedRoute component={AccountSettings} />,
      },
      {
        path: "login",
        element: <PublicRoute component={Login} />,
      },
      {
        path: "signup",
        element: <PublicRoute component={Signup} />,
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <RouterProvider router={router} />
        <Toaster />
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
