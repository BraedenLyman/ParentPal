import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";
import { app } from "./firebase";

export const auth = getAuth(app);

setPersistence(auth, browserSessionPersistence)
  .then(() => {
    console.log("Auth persistence set to SESSION");
  })
  .catch((error) => {
    console.error("Error setting auth persistence:", error);
  });