import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import firebaseApp from "./firebase";
import { getFirestore } from "firebase/firestore";

const db = getFirestore(firebaseApp);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
