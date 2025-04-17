import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // or './App.css' depending on your setup
import App from './App.js';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
