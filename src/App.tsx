// src/App.tsx
import React from 'react';
import { ThemeProvider } from './components/theme-provider';
import Background from './components/ui/background';
import Index from './pages/Index';
import Analysis from './pages/Analysis';
import NotFound from './pages/NotFound';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { DemoSection } from './components/landing/DemoSection';
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Careers from './pages/Careers';
import Payment from './pages/Payment';
import Profile from './pages/Profile';
import { AuthProvider } from './contexts/AuthContext';
import "./i18n";
import  ProductDetailsPage  from "./pages/ProductDetailsPage";
import TestTranslation from "./pages/TestTranslation";
import { Toaster } from "sonner";


function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Background withParticles={true}>
          <Router>
            <div className="relative z-10">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/analysis" element={<Analysis />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/demo" element={<DemoSection />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/careers" element={<Careers/>} />
                <Route path="/payment" element={<Payment/>} />
                <Route path="/profile" element={<Profile/>} />
                <Route path="/product/:productId" element={<ProductDetailsPage />} />
                <Route path="/test-translation" element={<TestTranslation />} />
              </Routes>
            </div>
          </Router>
        </Background>
        <Toaster position="top-right" richColors />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;