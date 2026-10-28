import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './AppShell';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />} />
        <Route path="/movies" element={<AppShell />} />
        <Route path="/reels" element={<AppShell />} />
        <Route path="/live" element={<AppShell />} />
        <Route path="/profile" element={<AppShell />} />
      </Routes>
    </BrowserRouter>
  );
};
