import { FC } from 'react';
import styles from './style.module.less';
import Header from '@/components/Header';
import AddHeader from '../../HOC/AddHeader/AddHeader';

interface IProps {

}

const MST: FC<IProps> = (props) => {
    return (
        <AddHeader>
            <div>
            </div>
        </AddHeader>
    );
};
export default MST;
