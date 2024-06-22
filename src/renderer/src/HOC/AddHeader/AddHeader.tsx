import { FC, ReactNode } from 'react';
import styles from './style.module.less';
import Header from '../../components/Header';

interface IProps {
    title: string;
    children: ReactNode[];
}

const AddHeader: FC<IProps> = (props) => {
    return (
        <div className={ styles.content }>
            <Header title={ props.title }/>
            <div className={ styles.main }>
                <div className={ styles.left }>
                    { props.children[0] }
                </div>
                <div className={ styles.right }>
                    { props.children.slice(1).map(i => i) }
                </div>
            </div>
        </div>
    );
};
export default AddHeader;
