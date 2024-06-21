import { RouteObject } from 'react-router-dom';
import Home from '@/views/Home';
import Main from '@/views/Main';


const routes: RouteObject[] = [
    {
        path: '/',
        element: <Home/>
    },
    {
        path: '/main',
        element: <Main/>
    }
];

export default routes;
