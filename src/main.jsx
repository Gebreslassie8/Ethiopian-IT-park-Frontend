import React from 'react'
import ReactDOM from "react-dom/client"
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { Toaster } from 'sonner';   // ← added

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider resetCSS={false}>
      <BrowserRouter>
        <App />
        <Toaster position="top-right" richColors closeButton />   {/* ← added */}
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>,
)