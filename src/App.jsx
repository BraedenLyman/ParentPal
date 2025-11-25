import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/protected-route";
import SignIn from "./components/auth/sign-in/sign-in";
import SignUp from "./components/auth/register/sign-up";
import ForgotPassword from "./components/auth/sign-in/forgot-password/forgot-password";
import CreateAccount from "./components/auth/register/create-account";
import AccountComplete from "./components/auth/register/account-complete";
import ParentDashboard from "./components/pages/dashboard/parent-dashboard";
import BabysitterDashboard from "./components/pages/dashboard/babysitter-dashboard";
import AssignedTasks from "./components/pages/babysitter-assigned-tasks/assigned-tasks";
import ParentAssignedTasks from "./components/pages/parent-assigned-tasks/parent-assigned-tasks";
import ResetPassword from "./components/auth/sign-in/forgot-password/reset-password";
import GrowthTracker from "./components/pages/growth/growth-tracker";
import SleepAnalytics from "./components/pages/sleep/sleep-analytics";
import HealthJournal from "./components/pages/health/health-journal";
import FeedingNotes from "./components/pages/notes/feeding/feeding-notes";
import ObservationNotes from "./components/pages/notes/observation/observation-notes";
import Settings from "./components/pages/settings/settings";
import PersonalInformation from "./components/pages/settings/personal-information";
import SharedAccounts from "./components/pages/settings/shared-accounts";
import BabysitterSharedAccounts from "./components/pages/settings/babysitter-shared-accounts";
import DataExport from "./components/pages/settings/data-export";
import PhotoGallery from "./components/pages/photo-gallery/photo-gallery";
import Reports from "./components/pages/reports/Reports";
import ParentMessages from "./components/pages/messages/parent-messages";
import BabysitterMessages from "./components/pages/messages/babysitter-messages";
import Calendar from "./components/pages/calendar/calendar";

function App() {
  return (
    <Routes>
      {/** Public Routes  */}
      <Route element={<SignIn />} path="/sign-in" />
      <Route element={<SignUp />} path="/sign-up" />
      <Route element={<AccountComplete />} path="/account-complete"/>
      <Route element={<CreateAccount />} path="/create-account" />
      <Route element={<ForgotPassword />} path="/forgot-password" />
      <Route element={<ResetPassword />} path="/reset-password" />

      {/** Protected Routes  */}
      <Route
        path="/"
        element={<SignIn />}
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
      <Route
        path="/assigned-tasks"
        element={
          <ProtectedRoute>
            <AssignedTasks />
          </ProtectedRoute>
        }
      />

      {/** Parent pages */}
      <Route
        path="/parent-assigned-tasks"
        element={
          <ProtectedRoute>
            <ParentAssignedTasks />
          </ProtectedRoute>
        }
      />
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
      <Route
        path="/photo-gallery"
        element={
          <ProtectedRoute>
            <PhotoGallery />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <Calendar />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent-messages"
        element={
          <ProtectedRoute>
            <ParentMessages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/babysitter-messages"
        element={
          <ProtectedRoute>
            <BabysitterMessages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/personal-information"
        element={
          <ProtectedRoute>
            <PersonalInformation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/shared-accounts"
        element={
          <ProtectedRoute>
            <SharedAccounts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/babysitter-shared-accounts"
        element={
          <ProtectedRoute>
            <BabysitterSharedAccounts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/data-export"
        element={
          <ProtectedRoute>
            <DataExport />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
