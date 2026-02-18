// import 'primeflex/primeflex.css';

import React from "react";
import { useState } from "react";
import Header from "../../components/dashboard/Header";
import "./Dashboard.css";
import Sidebar from "../../components/dashboard/Sidebar";
import Home from "../../components/dashboard/Dashboard";
import Nav from "../../components/dashboard/Nav";
import { Outlet, Routes, BrowserRouter, Route } from "react-router-dom";

function Dashboard() {
  return (
    <div className="grid-container">
      <Home />
    </div>
  );
}

export default Dashboard;
