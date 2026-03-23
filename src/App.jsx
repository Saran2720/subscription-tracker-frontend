import { Route, Routes, Navigate } from "react-router-dom";
import CreateSubscription from "./pages/CreateSubscription";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import SubscriptionDetail from "./pages/SubscriptionDetail";
import useAuth from "./hooks/useAuth";


const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
    return user ? children : <Navigate to="/sign-in" />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/sign-in" element={<SignIn />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/subscriptions"
        element={
          <ProtectedRoute>
            <CreateSubscription />
          </ProtectedRoute>
        }
      />

      <Route
        path="/subscriptions/:id"
        element={
          <ProtectedRoute>
            <SubscriptionDetail />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
