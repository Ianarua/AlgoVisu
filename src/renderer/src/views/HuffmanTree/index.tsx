import { FC, useEffect, useState } from 'react';
import styles from './style.module.less';
import AddHeader from '../../HOC/AddHeader/AddHeader';
import ReactECharts from 'echarts-for-react';

interface IProps {

}

// 定义边的类型
interface Edge {
    from: number; // 边的起始节点编号
    to: number;   // 边的目标节点编号
}

interface Link {
    source: number,
    target: number,
    weight: number
}

type Node = {
    name: number,
    x?: number,
    y?: number,
    fixed?: boolean
}

const HuffmanTree: FC<IProps> = () => {
    // 响应式
    const [chartSize, setChartSize] = useState<{
        width: number,
        height: number
    }>({ width: window.innerWidth, height: window.innerHeight });

    const updateChartSize = () => {
        setChartSize({ width: window.innerWidth, height: window.innerHeight });
    };

    useEffect(() => {
        window.addEventListener('resize', updateChartSize);
        return () => {
            window.removeEventListener('resize', updateChartSize);
        };
    }, []);

    const getNodeSize = (width: number, height: number, ratio: number) => {
        // 根据宽度和高度计算节点大小
        return Math.min(width, height) * ratio; // 例如设置为宽度或高度的2%
    };

    //

    // TODO 模拟的数据
    const huffmanData = [1, 2, 3, 4, 5, 6];
    // 组件中的无向连通图数据
    const [graphData, setGraphData] = useState<{
        nodes: Node[],
        links: Link[]
    }>({
        nodes: [],
        links: []
    });

    // 图表配置项
    const option = {
        title: {
            text: '哈夫曼树',
            left: 'center'
        },
        series: [{
            type: 'graph',
            // layout: 'force',
            animationDurationUpdate: 1500,
            animationEasingUpdate: 'quinticInOut',
            data: graphData.nodes.map(node => ({
                name: node.name,
                x: node.x, // 添加x坐标
                y: node.y, // 添加y坐标
                fixed: true, // 固定节点
                symbolSize: getNodeSize(chartSize.width, chartSize.height, 0.05),
                label: { show: true, fontSize: getNodeSize(chartSize.width, chartSize.height, 0.03) }
            })),
            links: graphData.links?.map(link => ({
                source: link.source,
                target: link.target,
                label: {
                    show: true,
                    formatter: () => link.weight,
                    fontStyle: 'oblique',
                    fontSize: getNodeSize(chartSize.width, chartSize.height, 0.02)
                }
            })),
            roam: true,     // 是否可互动
            focusNodeAdjacency: true,   // 是否在鼠标移到节点上的时候突出显示节点以及节点的边和邻接节点。[ default: false ]
            // force: {
            //     repulsion: getNodeSize(chartSize.width, chartSize.height, 2), // 响应式排斥力
            // }
        }]
    };

    function edgesToLink (edges: Edge[]) {

    }

    useEffect(() => {

    }, []);

    return (
        <>
            <AddHeader title="哈夫曼树的构造">
                <div className={ styles.echarts }>
                    <ReactECharts option={ option } style={ { width: '100%', height: '100%' } }/>
                </div>
                <div>
                </div>
            </AddHeader>
        </>
    );
};
export default HuffmanTree;

