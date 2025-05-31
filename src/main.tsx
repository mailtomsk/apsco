import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App.tsx';
import './index.css';
import { Provider } from "react-redux";
import { store, persistor } from "./store.ts";



createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <StrictMode>
                <App />
            </StrictMode>
        </PersistGate>
    </Provider>
);
