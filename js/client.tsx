import React from "react";
import ReactDOM from "react-dom/client";
import "../css/style.scss";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import IndexApp from "./IndexApp";
import SignupApp from "./SignupApp";
import LoginApp from "./LoginApp";
import AppApp from "./AppApp";
import NotFoundApp from "./404App";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement!);

function Client() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IndexApp />} />
        <Route path="/signup" element={<SignupApp />} />
        <Route path="/login" element={<LoginApp />} />
        <Route path="/app" element={<AppApp />} />
        <Route path="*" element={<NotFoundApp />} />
      </Routes>
    </BrowserRouter>
  );
}

root.render(<Client />);