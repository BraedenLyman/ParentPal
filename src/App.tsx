import { Route, Routes } from "react-router-dom";
import IndexPage from "@/pages/index";
import AboutPage from "@/pages/about";
import SignIn from "./pages/user/sign-in/sign-in";
import SignUp from "./pages/user/sign-up/sign-up";
import ForgotPassword from "./pages/user/forgot-password/forgot-password";
import PasswordOTP from "./pages/user/forgot-password/passwordOTP";

function App() {
  return (
    <Routes>
      <Route element={<SignIn />} path="/sign-in" />
      <Route element={<SignUp />} path="/sign-up" />
      <Route element={<ForgotPassword />} path="/forgot-password" />
      <Route element={<PasswordOTP />} path="/recover-passwordOTP" />
      <Route element={<IndexPage />} path="/" />
      <Route element={<AboutPage />} path="/about" />
    </Routes>
  );
}

export default App;
