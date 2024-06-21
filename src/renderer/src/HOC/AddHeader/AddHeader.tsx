import { FC, ReactNode } from 'react';
import styles from './style.module.less';
import Header from '../../components/Header';

interface IProps {
    children: ReactNode[] | ReactNode;
}

const AddHeader: FC<IProps> = (props) => {
    return (
        <div className={ styles.content }>
            <Header/>
            <div className={ styles.main }>
                { props.children }
            </div>
        </div>
    );
};
export default AddHeader;
