import './index.css';
import axios from "axios";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx';

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
