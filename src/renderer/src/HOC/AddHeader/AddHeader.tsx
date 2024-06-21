import { FC, ReactNode } from 'react';
import styles from './style.module.less';
import Header from '../../components/Header';

interface IProps {
    children: ReactNode[];
}

const AddHeader: FC<IProps> = (props) => {
    console.log(123);
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
