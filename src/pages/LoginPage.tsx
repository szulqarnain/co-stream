import { Navigate } from "react-router-dom";
import { useAuthenticationStatus, useUserDefaultRole } from "@nhost/react";
import Login from "../modules/AuthModule/segments/Login";
import Loader from "~/components/common/Loader";

function LoginPage() {
  const { isAuthenticated, isLoading } = useAuthenticationStatus(); //get nhost authentication status
  const userDefaultRole = useUserDefaultRole();

  if (isLoading)
    return (
      <div className="bg-[#eaebef] w-full flex justify-center items-center min-h-[100vh]">
        <Loader />
      </div>
    );

  if (isAuthenticated) return <Navigate to={`../${userDefaultRole}`} />;

  return <Login />;
}

export default LoginPage;
