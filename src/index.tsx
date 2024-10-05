import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import firebaseApp from "./firebase";
import { getFirestore } from "firebase/firestore";
import { createRoot } from 'react-dom/client';

const db = getFirestore(firebaseApp);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
