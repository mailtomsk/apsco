import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App.tsx';
import './index.css';
import { Provider } from "react-redux";
import { store, persistor } from "./store.ts";
import { BrowserRouter as Router } from 'react-router-dom';


createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <StrictMode>
                <Router>
                    <App />
                </Router>
            </StrictMode>
        </PersistGate>
    </Provider>
);
