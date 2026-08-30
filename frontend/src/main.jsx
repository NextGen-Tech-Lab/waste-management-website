import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1b5e20',
    },
    secondary: {
      main: '#2e7d32',
    },
    background: {
      default: '#f8faf8',
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", sans-serif',
    h1: {
      fontFamily: '"Public Sans", "Inter", sans-serif',
    },
    h2: {
      fontFamily: '"Public Sans", "Inter", sans-serif',
    },
    h3: {
      fontFamily: '"Public Sans", "Inter", sans-serif',
    },
    h4: {
      fontFamily: '"Public Sans", "Inter", sans-serif',
    },
    h5: {
      fontFamily: '"Public Sans", "Inter", sans-serif',
    },
    h6: {
      fontFamily: '"Public Sans", "Inter", sans-serif',
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
