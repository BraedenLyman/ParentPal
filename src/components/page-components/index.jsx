import React from "react";
import SignIn from "../auth/sign-in/sign-in";

export default function IndexPage() {
  return (
    <div className="relative flex flex-col h-screen">
      <SignIn />
    </div>
  );
}
