import { Route, Routes } from "react-router-dom";
import IndexPage from "@/pages/index";
import AboutPage from "@/pages/about";
import SignIn from "./pages/login/sign-in/sign-in";

function App() {
  return (
    <Routes>
      <Route element={<SignIn />} path="/sign-in" />
      <Route element={<IndexPage />} path="/" />
      <Route element={<AboutPage />} path="/about" />
    </Routes>
  );
}

export default App;
