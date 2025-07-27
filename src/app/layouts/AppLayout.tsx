import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { MainPage } from '@/pages/main/MainPage';
import UserPage from '@/pages/user/UserPage';
import { AppHeader } from '@/widgets/app-header/AppHeader';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen w-full pt-24 bg-gray-50">
      <AppHeader />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/user" element={<UserPage />} />
      </Routes>
      <Toaster position="bottom-center" />
    </div>
  );
};