import { FC } from 'react';
import electronLogo from '@resources/icon.png';
import About from '../../components/About';
import { Button, ConfigProvider } from 'antd';
import { TinyColor } from '@ctrl/tinycolor';
import { useNavigate } from 'react-router-dom';

interface IProps {
}

const Index: FC<IProps> = () => {
    const colors1 = ['#3178c6', '#f0dc4e'];
    const getHoverColors = (colors: string[]) => colors.map((color) => new TinyColor(color).lighten(5).toString());
    const getActiveColors = (colors: string[]) => colors.map((color) => new TinyColor(color).darken(5).toString());

    const navigate = useNavigate();

    return (
        <>
            <img alt="logo" className="logo" src={ electronLogo }/>
            <div className="creator">Powered by electron-vite</div>
            <div className="text">
                Build an Electron app with <span className="react">React</span>
                &nbsp;and <span className="ts">TypeScript</span>
            </div>
            <p className="tip">
                Please try pressing <code>F12</code> to open the devTool
            </p>
            <div className="actions">
                <div className="action">
                    <ConfigProvider
                        theme={ {
                            components: {
                                Button: {
                                    colorPrimary: `linear-gradient(315deg, ${ colors1.join(', ') })`,
                                    colorPrimaryHover: `linear-gradient(315deg, ${ getHoverColors(colors1).join(', ') })`,
                                    colorPrimaryActive: `linear-gradient(315deg, ${ getActiveColors(colors1).join(', ') })`,
                                    lineWidth: 0,
                                },
                            },
                        } }
                    >
                        <Button type="primary" size="large" onClick={ () => navigate('/Main') }>
                            <span style={ { color: '#fff' } }>开始使用</span>
                        </Button>
                    </ConfigProvider>
                </div>
                {/*<div className="action">*/ }
                {/*    <a target="_blank" rel="noreferrer" onClick={ ipcHandle }>*/ }
                {/*        Send IPC*/ }
                {/*    </a>*/ }
                {/*</div>*/ }
            </div>
            <About/>
        </>
    );
};

export default Index;
