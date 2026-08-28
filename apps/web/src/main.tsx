import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { ToastContainer } from 'react-toastify';
import UserContextProvider from './components/layout/UserContextProvider';
import App from './App';

// Global Styles
import './styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

// Posh Luxury Ant Design theme tokens
const theme = {
  token: {
    colorPrimary: '#0B2545',
    colorInfo: '#134074',
    colorSuccess: '#059669',
    colorWarning: '#D97706',
    colorError: '#DC2626',
    colorBgBase: '#ffffff',
    colorTextBase: '#0F172A',
    borderRadius: 8,
    fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: 13.5,
    wireframe: false,
  },
  components: {
    Button: {
      controlHeight: 40,
      borderRadius: 8,
      fontWeight: 600,
      primaryShadow: '0 2px 8px rgba(11, 37, 69, 0.18)',
    },
    Card: {
      borderRadiusLG: 14,
      headerHeight: 52,
      headerFontSize: 15,
      boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.03), 0 6px 16px -4px rgba(15, 23, 42, 0.04)',
    },
    Table: {
      borderRadius: 12,
      headerBg: '#F8FAFC',
      headerColor: '#475569',
      rowHoverBg: '#F8FAFC',
    },
    Input: {
      controlHeight: 42,
      borderRadius: 8,
    },
    Select: {
      controlHeight: 42,
      borderRadius: 8,
    },
    Tabs: {
      titleFontSize: 14,
      horizontalItemPadding: '10px 16px',
    },
    Modal: {
      borderRadiusLG: 16,
    },
    Drawer: {
      borderRadiusLG: 16,
    },
  },
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider theme={theme}>
      <UserContextProvider>
        <BrowserRouter>
          <App />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </BrowserRouter>
      </UserContextProvider>
    </ConfigProvider>
  </React.StrictMode>
);
