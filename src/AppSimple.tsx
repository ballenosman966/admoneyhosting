import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Simple test component
const SimpleTest = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-white mb-4">Simple App Test</h1>
      <p className="text-white/60 mb-4">This is a simplified version to test basic functionality</p>
      <div className="bg-white/10 p-4 rounded-lg">
        <p className="text-white">React is working!</p>
        <p className="text-white">Time: {new Date().toLocaleString()}</p>
      </div>
    </div>
  </div>
);

// Simplified App
function AppSimple() {
  console.log('AppSimple: Rendering simplified app');
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SimpleTest />} />
        <Route path="/test" element={<SimpleTest />} />
      </Routes>
    </Router>
  );
}

export default AppSimple; 