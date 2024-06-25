import { FC, useEffect, useState } from 'react';
import styles from './style.module.less';
import AddHeader from '../../HOC/AddHeader/AddHeader';
import { Button, Input, message } from 'antd';

interface IProps {

}

type Tower = {
    name: string,
    num: number[],
};

const HanoiTower: FC<IProps> = () => {
    // 盘的基准宽度
    const DISKBASEWIDTH = 20;

    // 提示框
    const [messageApi, contextHolder] = message.useMessage();

    const openNotification = () => {
        messageApi.error('请输入数字！').then();
    };

    // let [isFinish, setIsFinish] = useState(false);

    let [inputValue, setInputValue] = useState(1);

    let [cnt, setCnt] = useState(0);

    let [isNext, setIsNext] = useState(false);

    const [from, setFrom] = useState<Tower>({
        name: 'from',
        num: []
    });
    const [to, setTo] = useState<Tower>({
        name: 'to',
        num: []
    });
    const [aux, setAux] = useState<Tower>({
        name: 'aux',
        num: []
    });

    /**
     * @description 汉诺塔
     * @param numDisks 一共几个
     * @param fromIn A柱 (起始柱)
     * @param toIn C柱 (目标柱)
     * @param auxIn B柱 (辅助用柱子)
     */
    async function hanoi (numDisks: number, fromIn: Tower, toIn: Tower, auxIn: Tower) {
        // 看看有没有下一轮了，下一轮的话当前就跳出
        if (isNext) return;
        if (numDisks === 1) {
            await moveDisk(fromIn, toIn);
        } else {
            await hanoi(numDisks - 1, fromIn, auxIn, toIn);
            await moveDisk(fromIn, toIn);
            await hanoi(numDisks - 1, auxIn, toIn, fromIn);
        }
    }

    async function moveDisk (from: Tower, to: Tower) {
        if (isNext) return;
        const disk = from.num.pop();
        if (disk !== undefined) {
            to.num.push(disk);
        }
        // 更新视图
        changeDisksState(from, to);
        await delay();
    }

    async function init (numDisks: number) {
        // 停止当前的动画
        setIsNext(true);
        await delay(1500);

        // 重置所有柱子的状态
        const fromIn = { name: 'from', num: [] as number[] };
        const toIn = { name: 'to', num: [] as number[] };
        const auxIn = { name: 'aux', num: [] as number[] };

        // 从最大的开始到1，好计算长度
        for (let i = numDisks; i >= 1; i--) {
            fromIn.num.push(i);
        }

        // 更新状态
        setFrom(fromIn);
        setTo(toIn);
        setAux(auxIn);

        await delay(500); // 确保状态重置

        // 重新开始新的动画
        setIsNext(false);
        hanoi(numDisks, fromIn, toIn, auxIn).then();
    }

    useEffect(() => {
        init(inputValue).then();

        return () => {
            setIsNext(true);
        };
    }, [cnt]);


    // 延迟函数
    function delay (time: number = 1000) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    // 修改diskState
    // @ts-ignore
    function changeDisksState (from: Tower, to: Tower) {
        for (let i of arguments) {
            if (i.name === 'from') {
                setFrom(prevState => {
                    return { ...prevState, num: i.num };
                });
            } else if (i.name === 'to') {
                setTo(prevState => {
                    return { ...prevState, num: i.num };
                });
            } else if (i.name === 'aux') {
                setAux(prevState => {
                    return { ...prevState, num: i.num };
                });
            }
        }
    }

    const handleChange = (e: any) => {
        const value = e.target.value;
        setInputValue(value);
    };

    const handleSubmit = async () => {
        const tempValue = Number(inputValue);
        if (!isNaN(tempValue) && tempValue > 0) {
            setCnt(prevState => prevState + 1);
        } else {
            openNotification();
        }
    };

    return (
        <>
            { contextHolder }
            <AddHeader title="汉诺塔问题">
                <div className={ styles.left }>
                    <div className={ styles.divOuter }>
                        <div className={ styles.towerDiv }>
                            <p className={ styles.title }> from柱 </p>
                            <div className={ styles.base }/>
                            <div className={ styles.bar }/>
                            {
                                // @ts-ignore
                                from.num.map((item, index) => {
                                    return (
                                        <div
                                            key={ index }
                                            className={ styles.disk }
                                            style={ { width: DISKBASEWIDTH * item, bottom: 50 + (index + 1) * 10 } }
                                        />
                                    );
                                })
                            }
                        </div>
                    </div>
                    <div className={ styles.divOuter }>
                        <div className={ styles.towerDiv }>
                            <p className={ styles.title }> aux柱 </p>
                            <div className={ styles.base }/>
                            <div className={ styles.bar }/>
                            {
                                // @ts-ignore
                                aux.num.map((item, index) => {
                                    return (
                                        <div
                                            key={ index }
                                            className={ styles.disk }
                                            style={ { width: DISKBASEWIDTH * item, bottom: 50 + (index + 1) * 10 } }
                                        />
                                    );
                                })
                            }
                        </div>
                    </div>
                    <div className={ styles.divOuter }>
                        <div className={ styles.towerDiv }>
                            <p className={ styles.title }> to柱 </p>
                            <div className={ styles.base }/>
                            <div className={ styles.bar }/>
                            {
                                // @ts-ignore
                                to.num.map((item, index) => {
                                    return (
                                        <div
                                            key={ index }
                                            className={ styles.disk }
                                            style={ { width: DISKBASEWIDTH * item, bottom: 50 + (index + 1) * 10 } }
                                        />
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
                个数：
                <div className={ styles.input }>
                    <Input
                        placeholder="输入数字"
                        value={ inputValue }
                        onChange={ handleChange }
                    />
                    <Button type="primary" onClick={ handleSubmit }>Submit</Button>
                </div>
                <></>
            </AddHeader>
        </>
    );
};
export default HanoiTower;
