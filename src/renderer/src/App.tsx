import { FC } from 'react';
import { useRoutes } from 'react-router-dom';
import routes from './router';

interface IProps {
}

const App: FC<IProps> = () => {
    // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping');
    return (
        <>
            {
                useRoutes(routes)
            }
        </>
    );
};

export default App;
