import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { AudioPlayerContextProvider } from './context/AudioPlayerContext';
import { QueueContextProvider } from './context/QueueContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthContextProvider>
    <AudioPlayerContextProvider>
      <QueueContextProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </QueueContextProvider>
    </AudioPlayerContextProvider>
  </AuthContextProvider>
);
