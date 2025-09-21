import { Route, Routes } from "react-router-dom";
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
      {/** Sign In/Sign Up  */}
      <Route element={<SignIn />} path="/sign-in" />

      <Route element={<SignUp />} path="/sign-up" />
      <Route element={<CreateAccount />} path="/create-account" />
      <Route element={<AccountType />} path="/account-type" />

      <Route element={<ParentInfo />} path="/parent-info" />
      <Route element={<AddBaby />} path="/add-baby" />
      <Route element={<BabyInfo />} path="/baby-info" />
      <Route element={<AccountComplete />} path="/account-complete" />

      <Route element={<BabysitterInfo />} path="/babysitter-info" />
      
      <Route element={<NewAccountOTP />} path="/new-accountOTP" />
      <Route element={<ForgotPassword />} path="/forgot-password" />
      <Route element={<ResetPassword />} path="/reset-password" />

      {/** Dashboard and Main Pages  */}
      <Route element={<IndexPage />} path="/" />
      <Route element={<ParentDashboard />} path="/parent-dashboard" />
      <Route element={<BabysitterDashboard />} path="/babysitter-dashboard" />
      
      {/** Parent Pages */}
      <Route element={<GrowthTracker />} path="/growth-tracker" />
      <Route element={<SleepAnalytics />} path="/sleep-analytics" />
      <Route element={<HealthJournal />} path="/health-journal" />
      <Route element={<FeedingNotes />} path="/feeding-notes" />
      <Route element={<ObservationNotes />} path="/observation-notes" />


    </Routes>
  );
}

export default App;
