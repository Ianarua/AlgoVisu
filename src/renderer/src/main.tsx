import './assets/main.css';
import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    // <React.StrictMode>
    <HashRouter>
        <Suspense>
            <App/>
        </Suspense>
    </HashRouter>
    // </React.StrictMode>
);
