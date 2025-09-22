import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/protected-route";
import IndexPage from "./pages/index";
import SignIn from "./components/auth/sign-in/sign-in";
import SignUp from "./components/auth/register/sign-up";
import ForgotPassword from "./components/auth/sign-in/forgot-password/forgot-password";
import CreateAccount from "./components/auth/register/create-account";
import NewAccountOTP from "./components/auth/register/new-accountOTP";
import AccountType from "./components/auth/register/account-creation-seq/account-type";
import ParentInfo from "./components/auth/register/account-creation-seq/parent/parent-info";
import AddBaby from "./components/auth/register/account-creation-seq/parent/add-baby";
import BabyInfo from "./components/auth/register/account-creation-seq/parent/baby-info";
import AccountComplete from "./components/auth/register/account-creation-seq/account-complete";
import ParentDashboard from "./components/dashboard/parent-dashboard";
import BabysitterDashboard from "./components/dashboard/babysitter-dashboard";
import BabysitterInfo from "./components/auth/register/account-creation-seq/babystter/babysitter-info";
import ResetPassword from "./components/auth/sign-in/forgot-password/reset-password";
import GrowthTracker from "./components/parent-pages/growth/growth-tracker";
import SleepAnalytics from "./components/parent-pages/sleep/sleep-analytics";
import HealthJournal from "./components/parent-pages/health/health-journal";
import FeedingNotes from "./components/parent-pages/notes/feeding/feeding-notes";
import ObservationNotes from "./components/parent-pages/notes/observation/observation-notes";

function App() {
  return (
    <Routes>
      {/** Public Routes  */}
      <Route element={<SignIn />} path="/sign-in" />
      <Route element={<SignUp />} path="/sign-up" />
      <Route element={<CreateAccount />} path="/create-account" />
      <Route element={<ForgotPassword />} path="/forgot-password" />
      <Route element={<ResetPassword />} path="/reset-password" />

      {/** Protected Routes  */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <IndexPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent-dashboard"
        element={
          <ProtectedRoute>
            <ParentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/babysitter-dashboard"
        element={
          <ProtectedRoute>
            <BabysitterDashboard />
          </ProtectedRoute>
        }
      />

      {/** Parent pages */}
      <Route
        path="/growth-tracker"
        element={
          <ProtectedRoute>
            <GrowthTracker />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sleep-analytics"
        element={
          <ProtectedRoute>
            <SleepAnalytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/health-journal"
        element={
          <ProtectedRoute>
            <HealthJournal />
          </ProtectedRoute>
        }
      />
      <Route
        path="/feeding-notes"
        element={
          <ProtectedRoute>
            <FeedingNotes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/observation-notes"
        element={
          <ProtectedRoute>
            <ObservationNotes />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
