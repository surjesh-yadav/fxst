import React from "react";
import "./App.css";
import Purchase from "./pages/Purchase";
import Connect from "./components/connect";
import Deshbord from "./components/deshbord";
import Saidbar from "./components/saidbar";
import Sell from "./pages/sell";
import Earning from "./pages/earning";
import Referral from "./pages/referral";
import Withdrawal from "./pages/withdrawal";

import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <React.Fragment>
    <div className="container_main">
      <Saidbar />
      <Connect />
      </div>
      <Routes>
        <Route path="/" element={<Deshbord />} />
        <Route path="/purchase" element={<Purchase />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/earning" element={<Earning />} />
        <Route path="/referral" element={<Referral />} />
        <Route path="/withdrawal" element={<Withdrawal />} />

      </Routes>
    </React.Fragment>
  );
}

export default App;
