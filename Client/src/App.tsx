"use client"

import React from 'react';
import './App.css';
import { Route, Routes } from "react-router-dom"
import { FirmProvider } from './context/FirmContext';
import HomePage from './Pages/Home/HomePage';
import Dashboard from './Pages/Dashboard/Dashboard';
import Firm from './Pages/Firm/Firm';
import VendorsPage from './Pages/Vendors/page';
import FirmDetailsPage from './Pages/Firm/[firmId]/page';
import AddVendorPage from './Pages/Firm/[firmId]/add/page';
import EditFirmPage from './Pages/Firm/[firmId]/edit/page';
import VendorDetailsPage from './Pages/Vendors/[vendorId]/page';
import EditVendorPage from './Pages/Vendors/[vendorId]/edit/page';
import AddQueryPage from './Pages/Vendors/[vendorId]/add-query/page';
import ImportCSVPage from './Pages/Vendors/[vendorId]/import-csv/page';

export default function App() {
  return (
    <FirmProvider>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/firm" element={<Firm />} />
          <Route path="/firm/:firmId" element={<FirmDetailsPage />} />
          <Route path="/firm/:firmId/add" element={<AddVendorPage />} />
          <Route path="/firm/:firmId/edit" element={<EditFirmPage />} />
          <Route path="/vendors" element={<VendorsPage />} />
          <Route path="/vendors/:vendorId" element={<VendorDetailsPage />} />        <Route path="/vendors/:vendorId/edit" element={<EditVendorPage />} />
        <Route path="/vendors/:vendorId/add-query" element={<AddQueryPage />} />
        <Route path="/vendors/:vendorId/import-csv" element={<ImportCSVPage />} />        </Routes>
      </div>
    </FirmProvider>
  );
}