import { FC } from 'react';
import styles from './style.module.less';
import { LeftOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

interface IProps {

}

const Header: FC<IProps> = () => {
    const navigate = useNavigate();
    return (
        <div className={ styles.content }>
            <Button
                ghost
                shape="round"
                icon={ <LeftOutlined/> }
                onClick={ () => navigate('/Main') }
            >
                返回选择算法
            </Button>
        </div>
    );
};
export default Header;
