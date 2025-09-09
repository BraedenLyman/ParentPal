import { Route, Routes } from "react-router-dom";
import IndexPage from "./pages/index";
import SignIn from "./components/auth/sign-in/sign-in";
import SignUp from "./components/auth/register/sign-up";
import ForgotPassword from "./pages/user/forgot-password/forgot-password";
import PasswordOTP from "./pages/user/forgot-password/passwordOTP";
import CreateAccount from "./components/auth/register/create-account";
import NewAccountOTP from "./components/auth/register/new-accountOTP";
import AccountType from "./components/auth/register/account-creation-seq/account-type";

function App() {
  return (
    <Routes>
      <Route element={<SignIn />} path="/sign-in" />
      <Route element={<SignUp />} path="/sign-up" />
      <Route element={<CreateAccount />} path="/create-account" />
      <Route element={<AccountType />} path="/account-type" />
      <Route element={<NewAccountOTP />} path="/new-accountOTP" />
      <Route element={<ForgotPassword />} path="/forgot-password" />
      <Route element={<PasswordOTP />} path="/recover-passwordOTP" />
      <Route element={<IndexPage />} path="/" />
    </Routes>
  );
}

export default App;
