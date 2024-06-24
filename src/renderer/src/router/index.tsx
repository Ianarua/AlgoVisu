import { RouteObject } from 'react-router-dom';
import Home from '@/views/Home';
import Main from '@/views/Main';
import MST from '../views/MST';
import BubbleSort from '../views/BubbleSort';
import HanoiTower from '../views/HanoiTower';
import HuffmanTree from '../views/HuffmanTree';


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
        path: '/huffmantree',
        element: <HuffmanTree/>
    },
    {
        path: '/hanoitower',
        element: <HanoiTower/>
    }
];

export default routes;
