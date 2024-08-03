import { useAuthenticationStatus, useUserDefaultRole } from "@nhost/react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loader from "~/components/common/Loader";

export function ProtectedRoute({ role }: any) {
  const { isAuthenticated, isLoading } = useAuthenticationStatus(); // get nhost authentication status

  const location = useLocation(); // get location from react router dom

  // display loading while authentication is on loading
  if (isLoading) {
    return (
      <div className="bg-[#eaebef] w-full flex justify-center items-center min-h-[100vh]">
        <Loader />
      </div>
    );
  }

  // If authentication true redirect
  if (isAuthenticated) {
    return <Outlet />;
  }
  // redirect to login when authentication is false
  return <Navigate to="/login" state={{ from: location }} replace />;
}
