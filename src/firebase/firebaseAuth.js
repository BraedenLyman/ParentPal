import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { app } from "./firebase";

export const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Auth persistence set to LOCAL");
  })
  .catch((error) => {
    console.error("Error setting auth persistence:", error);
  });