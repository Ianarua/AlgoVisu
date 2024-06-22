import { FC, ReactNode } from 'react';
import styles from './style.module.less';

interface IProps {
    isActive: boolean,
    children: ReactNode | ReactNode[]
}

const IsActive: FC<IProps> = (props) => {
    const isActive = props.isActive;
    return (
        <div>
            { props.children }
        </div>
    );
};
export default IsActive;
