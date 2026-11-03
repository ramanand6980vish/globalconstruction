import { useState } from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import MainComponent from './Components/AllFunctionCall/MainComponent'
import AdminDashboard from './Components/AdminDashboard';
import AddEmployee from './Components/AddEmployee';
import CreateCompany from './Components/CreateCompany';
import CreateDesignation from './Components/CreateDesignation';
import CreateDepartment from './Components/CreateDepartment';
import Home from './Components/Home';
import Attendance from './Components/Attendance';
import Client from './Components/Client';
import Site from './Components/Site';
import EmployeeDetails from './Components/EmployeeDetails';
import EmployeeList from './Components/EmployeeList';

function App() {
 
  return (
    <> 
    <div id="companyname">GLOBAL CONSTRUCTION</div> 
    <Routes> 
      <Route path="/" element={<MainComponent />} /> 
      <Route path="/admin/dashboard" element={<AdminDashboard />} /> 
      <Route path="/addemployee" element={<AddEmployee />} /> 
      {/* <Route path="*" element={<Navigate to="/home"  />} /> */}
      <Route path="*" element={<Navigate to="/admin/dashboard"  />} />
      <Route path="/createcompany" element={<CreateCompany />} />
      <Route path="/createdesignation" element={<CreateDesignation />} />
      <Route path="/createdepartment" element={<CreateDepartment />} />
      <Route path="/home" element={<Home/>} />
      <Route path="/attendance" element={<Attendance/>} />
      <Route path="/clients" element={<Client/>} />
      <Route path="/sites" element={<Site/>} />
      <Route path="/employees" element={<EmployeeList/>} />
      <Route path="/admin/employees/:id" element={<EmployeeDetails />} />
    </Routes> </>
  )
}

export default App
