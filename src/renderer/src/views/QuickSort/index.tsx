import { FC, useEffect, useState } from 'react';
import styles from './style.module.less';
import AddHeader from '../../HOC/AddHeader/AddHeader';
import ReactECharts from 'echarts-for-react';

interface IProps {}

const QuickSort: FC<IProps> = () => {
    const [arrayInput, setArrayInput] = useState<number[]>([])
    const [array, setArray] = useState<number[]>([3, 55, 71, 22, 8, 1]);
    const [option, setOption] = useState({
        xAxis: {
            type: 'category',
            data: array
        },
        yAxis: {
            show: false
        },
        series: [
            {
                data: array,
                type: 'bar',
            },
        ],
    });

    useEffect(() => {
        const sortArray = async () => {
            await quickSort(array);
        };
        sortArray().then();
    }, []);

    // 快速排序函数
    async function quickSort(arr: number[]): Promise<number[]> {
        await sort(arr, 0, arr.length - 1);
        return arr;

        async function sort(arr: number[], low: number, high: number) {
            if (low >= high) {
                return;
            }

            let i = low;
            let j = high;
            const x = arr[i]; // 取出比较值x，当前位置i空出，等待填入

            while (i < j) {
                while (arr[j] >= x && i < j) {
                    j--;
                }
                if (i < j) {
                    arr[i] = arr[j];
                    i++;
                    setArray([...arr]); // 更新 React 组件中的数组状态
                    await updateChart([...arr]); // 更新图表并延迟
                }

                while (arr[i] <= x && i < j) {
                    i++;
                }
                if (i < j) {
                    arr[j] = arr[i];
                    j--;
                    setArray([...arr]); // 更新 React 组件中的数组状态
                    await updateChart([...arr]); // 更新图表并延迟
                }
            }

            arr[i] = x; // 将空出的位置，填入缓存的数字x，一轮排序完成
            setArray([...arr]);
            await updateChart([...arr]); // 更新图表并延迟

            await sort(arr, low, i - 1);
            await sort(arr, i + 1, high);
        }
    }

    // 更新图表并延迟
    async function updateChart(arr: number[]) {
        setOption({
            xAxis: {
                type: 'category',
                data: arr
            },
            yAxis: {
                show: false
            },
            series: [
                {
                    data: arr,
                    type: 'bar',
                },
            ],
        });
        await delay(); // 延迟500ms
    }

    // 延迟函数
    function delay(time: number = 1500) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    return (
        <AddHeader>
            <div className={styles.content}>
                <ReactECharts option={option} />
            </div>
        </AddHeader>
    );
};

export default QuickSort;
