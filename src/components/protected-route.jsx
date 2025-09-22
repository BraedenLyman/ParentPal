import { Navigate } from "react-router-dom";
import { auth } from "../firebase/firebaseAuth";

export default function ProtectedRoute({ children }) {
  const user = auth.currentUser;

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
}
