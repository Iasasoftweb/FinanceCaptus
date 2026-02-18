import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider.tsx";

const RoleBasedRoute = ({ allowedRoles, children }) => {
    const { role } = useAuth();

    if (!allowedRoles.includes(role)) {
        return <Navigate to="/no-autorizado" />;
    }

    return children;
};

export default RoleBasedRoute;