import { RouteObject } from 'react-router-dom';
import Home from '@/views/Home';
import Main from '@/views/Main';
import MST from '../views/MST';
import BubbleSort from '../views/BubbleSort';
import GraphColor from '../views/GraphColor';
import HanoiTower from '../views/HanoiTower';


const routes: RouteObject[] = [
    {
        path: '/',
        element: <Home/>
    },
    {
        path: '/main',
        element: <Main/>
    },
    {
        path: '/mst',
        element: <MST/>
    },
    {
        path: '/bubbleSort',
        element: <BubbleSort/>
    },
    {
        path: '/graphcolor',
        element: <GraphColor/>
    },
    {
        path: '/hanoitower',
        element: <HanoiTower/>
    }
];

export default routes;
