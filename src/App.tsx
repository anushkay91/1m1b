import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Card } from './components/ui/Card/Card';
import { Button } from './components/ui/Button/Button';
import { TransportationForm } from './components/forms/TransportationForm/TransportationForm';

function Dashboard() {
  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1>Sustainability Tracker</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Understand your estimated carbon footprint without fabricated precision.</p>
      </header>
      
      <main style={{ display: 'grid', gap: '2rem' }}>
        <TransportationForm />
        
        <Card>
          <h2>Dashboard Placeholder</h2>
          <p>More modules will appear here soon.</p>
          <Button variant="outline">View Recommendations</Button>
        </Card>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
