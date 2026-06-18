import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/landing-page";
import { VehicleSelectionPage } from "./pages/vehicle-selection-page";
import { AdminDashboard } from "./pages/admin-dashboard";
import { Login } from "./components/login";
import { Signup } from "./components/signup";
import { ProtectedRoute } from "./components/protected-route";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/vehicles",
    Component: VehicleSelectionPage,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/admin",
    Component: () => (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
]);
