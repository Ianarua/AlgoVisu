import { FC, useEffect, useState } from 'react';
import styles from './style.module.less';
import AddHeader from '../../HOC/AddHeader/AddHeader';
import ReactECharts from 'echarts-for-react';
import { Button, Input, message } from 'antd';
interface IProps {
}


const BubbleSort: FC<IProps> = () => {
    // 提示框
    const [messageApi, contextHolder] = message.useMessage();

    const [inputValue, setInputValue] = useState<string>('2,55,7,94,12');
    const [array, setArray] = useState<number[]>([]);
    const [option, setOption] = useState({
        title: {
            text: '冒泡排序',
            left: 'center'
        },
        xAxis: {
            type: 'category',
            data: array
        },
        yAxis: {
            show: false
        },
        series: [
            {
                animationDurationUpdate: 1000,
                animationEasingUpdate: 'quinticInOut',
                data: array,
                type: 'bar',
            },
        ],
    });
    let [cnt, setCnt] = useState(0);

    useEffect(() => {
        const sortArray = async () => {
            await bubbleSort(array);
        };
        sortArray().then();
    }, [cnt]);

    const openNotification = () => {
        messageApi.error('格式错误！请输入以\',\'分隔的数字').then();
    };

    const handleChange = (e: any) => {
        const value = e.target.value;
        setInputValue(value);
    };

    const handleSubmit = async () => {
        try {
            // 尝试解析输入的字符串
            console.log(inputValue);
            const tempValue = '[' + inputValue + ']';
            const parsedArray = JSON.parse(tempValue);
            // 检查解析后的结果是否为数组
            if (Array.isArray(parsedArray) && parsedArray.every(item => !Array.isArray(item))) {
                setArray([...parsedArray]);
                await updateChart([...parsedArray]); // 更新图表并延迟
                setCnt(prevState => prevState + 1);
            } else {
                openNotification();
            }
        } catch (e) {
            openNotification();
        }
    };

    // 冒泡
    async function bubbleSort (arr: number[]): Promise<number[]> {
        const length = arr.length;
        for (let i = 0; i < length - 1; i++) {
            for (let j = 0; j < length - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    setArray([...arr]);
                    await updateChart([...arr]); // 更新图表并延迟
                }
            }
        }
        return arr;
    }

    // 更新图表并延迟
    async function updateChart (arr: number[]) {
        setOption({
            title: {
                text: '冒泡排序',
                left: 'center'
            },
            xAxis: {
                type: 'category',
                data: arr
            },
            yAxis: {
                show: false
            },
            series: [
                {
                    animationDurationUpdate: 1000,
                    animationEasingUpdate: 'quinticInOut',
                    data: arr,
                    type: 'bar',
                },
            ],
        });
        await delay();
    }

    // 延迟函数
    function delay (time: number = 1500) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    return (
        <>
            { contextHolder }
            <AddHeader title="冒泡排序">
                <div style={ { width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' } }>
                    <ReactECharts option={ option } style={{width: '100%'}}/>
                </div>
                <div className={ styles.input }>
                    <Input
                        placeholder="输入以','分割的数字"
                        value={ inputValue }
                        onChange={ handleChange }
                    />
                    <Button type="primary" onClick={ handleSubmit }>Submit</Button>
                </div>
            </AddHeader>
        </>
    );
};

export default BubbleSort;
