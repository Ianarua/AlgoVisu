import { FC } from 'react';
// import Header from '../../components/Header';
import styles from './style.module.less';
import { Image } from 'antd';
import mst from '@/assets/mst.gif';
import sorting from '@/assets/sorting.gif'
import { useNavigate } from 'react-router-dom';

interface IProps {

}

const Main: FC<IProps> = () => {
    const navigate = useNavigate();
    return (
        <div className={ styles.content }>
            {/*<Header/>*/ }
            <div className={ styles.inner }>
                <div className={ styles.algos } onClick={ () => navigate('/bubbleSort') }>
                    <Image preview={ false } src={ sorting } width="100%"/>
                    <span className={ styles.title }>冒泡排序</span>
                </div>
                <div className={ styles.algos } onClick={ () => navigate('/mst') }>
                    <Image preview={ false } src={ mst } width="100%"/>
                    <span className={ styles.title }>最小生成树</span>
                </div>
                <div className={ styles.algos } onClick={ () => navigate('/huffmantree') }>
                    <Image preview={ false } src={ mst } width="100%"/>
                    <span className={ styles.title }>哈夫曼树的构造</span>
                </div>
                <div className={ styles.algos } onClick={ () => navigate('/hanoitower') }>
                    <Image preview={ false } src={ mst } width="100%"/>
                    <span className={ styles.title }>汉诺塔</span>
                </div>
            </div>
        </div>
    );
};
export default Main;
