import { FC, useEffect, useState } from 'react';
import AddHeader from '../../HOC/AddHeader/AddHeader';
import ReactECharts from 'echarts-for-react';
import UnionFind from './UnionFind';
import styles from './style.module.less';
import classNames from 'classnames';
import { Button, message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

interface IProps {

}

// 定义边的类型
interface Edge {
    from: number; // 边的起始节点编号
    to: number;   // 边的目标节点编号
    weight: number; // 边的权重
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

const MST: FC<IProps> = () => {
    // 是否第一次进入，防重渲染
    let [isEnd, setIsEnd] = useState(false);
    let [cnt, setCnt] = useState(0);
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

    // 计算总权重
    const [totalWeight, setTotalWeight] = useState<number>(0);

    const computedWeight = (links: Link[]) => {
        const sum = links.reduce((sum, cur) => sum + cur.weight, 0);
        setTotalWeight(sum);
    };

    // 左侧说明中已连的边
    const [hasEdge, setHasEdge] = useState(0);

    // 左侧说明中是否存在环的classNames, null为默认情况下啥也不红，0为存在红，1为不存在红
    const [isActiveExist, setIsActiveExist] = useState<number | null>(null); // 初始状态设为 null

    // 0 为存在的，1 是不存在的
    const computedClassNames = (type: 0 | 1) => {
        if (isActiveExist === null) {
            return styles.leftExplainSpan; // 默认情况
        } else {
            const isActive = isActiveExist === type;
            return classNames(
                styles.leftExplainSpan,
                {
                    [styles.active]: isActive
                }
            );
        }
    };

    // 组件中的无向连通图数据
    const [graphData, setGraphData] = useState<{
        nodes: Node[],
        links: Link[]
    }>({
        nodes: [],
        links: []
    });

    // 用户输入的数据 Edge[]
    const [edges, setEdges] = useState<Edge[]>([
        { from: 0, to: 1, weight: 4 },
        { from: 1, to: 2, weight: 8 },
        { from: 2, to: 3, weight: 7 },
        { from: 3, to: 4, weight: 9 },
        { from: 4, to: 5, weight: 10 },
        { from: 5, to: 6, weight: 2 },
        { from: 6, to: 7, weight: 1 },
        { from: 0, to: 7, weight: 8 },
        { from: 1, to: 7, weight: 11 },
        { from: 7, to: 8, weight: 7 },
        { from: 2, to: 8, weight: 2 },
        { from: 6, to: 8, weight: 6 },
        { from: 2, to: 5, weight: 4 },
    ]);

    // 图表配置项
    const option = {
        title: {
            text: '最小生成树',
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

    // Kruskal 算法实现
    const kruskal = async (edges: Edge[], graphData: any): Promise<Edge[]> => {
        console.log('edgesss', edges);
        const nodes = graphData.nodes.length;
        edges.sort((a, b) => a.weight - b.weight);
        const uf = new UnionFind(nodes);
        const result: Edge[] = [];

        for (let edge of edges) {
            console.log('---edge', edge);
            console.log('---jasEdge', hasEdge, nodes);
            if (hasEdge === nodes - 1) break; // 边数达到节点数-1时停止

            let rootX = uf.find(edge.from);
            let rootY = uf.find(edge.to);

            // 如果两条边的根节点不同，则说明没有形成环，可以连接
            if (rootX !== rootY) {
                setIsActiveExist(0);
                uf.union(edge.from, edge.to);
                result.push(edge);

                const newLink: Link[] = edgesToLink(result);
                setHasEdge(prevState => prevState + 1);
                updateChart(newLink);

            } else {
                setIsActiveExist(1);
            }
            await delay();
        }
        await delay();
        setIsActiveExist(null);
        console.log(result);
        // 计算最终权值
        computedWeight(edgesToLink(result));
        // isEnd = true;
        setIsEnd(true);
        return result;
    };

    useEffect(() => {
        console.log('isde', isEnd);
    }, [isEnd]);

    // 将用户输入转化为echarts格式
    // function transformData (edges: Edge[], nodes: number) {
    //
    // }

    async function start () {
        // 将edges转化为 node名称数组
        const nodes = edgesToNodeNames(edges);
        // 转化完后初始化图表
        setGraphData(prevState => {
            const newState = {
                ...prevState,
                nodes: nodes
            };
            !(async function () {
                await delay();
                // 开始Kruskal算法
                await kruskal(edges, newState);
            })();
            return newState;
        });

        // await delay();
        // // 开始Kruskal算法
        // await kruskal(edges);
        // // 计算最终权值
        // computedWeight();
    }

    function init () {
        // 重置状态
        // 重置左侧说明 已连的边
        setHasEdge(0);
        // 重置左侧说明 存在/不存在
        setIsActiveExist(null);
        // 重置最后结果的权重
        setTotalWeight(0);
        // 重置图数据
        setGraphData({
            nodes: [],
            links: []
        });
    }

    // useEffect(() => {
    //     init();
    //     // TODO 模拟开始
    //     start().then();
    // }, []);
    useEffect(() => {
        // if (isFirst.current) {
        // isFirst.current = false;
        console.log('start');
        init();
        start().then();
        // 重置是否结束
        // isEnd = false;
        setIsEnd(false);
        // }
    }, [cnt]);

    function updateChart (newLinks: Link[]) {
        setGraphData(prevState => ({
            nodes: [...prevState.nodes],
            links: [...newLinks],
        }));
    }

    // 延迟函数
    function delay (time: number = 1500) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    // 将edges转化为 图标要的 link
    function edgesToLink (edges: Edge[]): Link[] {
        return edges.map(item => ({
            source: item.from,
            target: item.to,
            weight: item.weight
        }));
    }

    // 将edges转化为 node名称数组
    function edgesToNodeNames (edges: Edge[]): Node[] {
        const nodeSet = new Set<number>();
        edges.map(item => {
            nodeSet.add(item.from);
            nodeSet.add(item.to);
        });
        // 添加节点的x，y坐标以及固定属性
        return Array.from(nodeSet).map((item, index) => ({
            name: item,
            x: (index % 3) * 300, // 示例固定x坐标，可以根据需要调整
            y: Math.floor(index / 3) * 300, // 示例固定y坐标，可以根据需要调整
            fixed: true // 固定节点
        }));
    }

    // 重新开始
    const [messageApi, contextHolder] = message.useMessage();

    function reload () {
        console.log(isEnd);
        if (!isEnd) {
            // 提示框
            messageApi.error('还未结束，请等待演示结束！').then();
        } else {
            setCnt(prevState => prevState + 1);
        }
    }

    // 用户输入相关配置
    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 4 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 20 },
        },
    };

    const formItemLayoutWithOutLabel = {
        wrapperCol: {
            xs: { span: 24, offset: 0 },
            sm: { span: 20, offset: 4 },
        },
    };

    return (
        <>
            { contextHolder }
            <AddHeader title="MST">
                <div className={ styles.echarts }>
                    <div className={ styles.leftExplainTop }>
                        <span>已连的边：<span style={ { color: 'red', fontSize: 16, textAlign: 'center' } }>{ hasEdge }</span></span>
                        <Button>点击设置节点信息</Button>
                        <Button
                            icon={ <ReloadOutlined/> }
                            className={ styles.reloadBtn }
                            onClick={ () => reload() }
                        >
                            重新演示
                        </Button>
                    </div>
                    <ReactECharts option={ option } style={ { width: '100%', flex: 1 } }/>
                    <div className={ styles.leftExplainBottom }>
                        是否存在环？
                        <span className={ computedClassNames(0) }>不存在</span>
                        <span className={ computedClassNames(1) }>存在</span>
                        <br/>
                        总权重：{ totalWeight }
                    </div>
                </div>
                {/*<Button type="primary">Start Visualization</Button>*/ }
                <div className={ styles.main }>
                    <div className={ styles.explain }>
                        <div className={ styles.edge }>
                            <p style={ { textAlign: 'center' } }>Edge</p>
                            {
                                graphData.links.map((item, index) => {
                                    return (
                                        <p key={ index }
                                           style={ {
                                               textAlign: 'center',
                                               fontSize: getNodeSize(chartSize.width, chartSize.height, 0.04),
                                               marginBottom: '10px'
                                           } }
                                        >
                                            { item.source } —— { item.target }
                                        </p>
                                    );
                                })
                            }
                        </div>
                        <div className={ styles.weighted }>
                            <p style={ { textAlign: 'center' } }>Weighted</p>
                            {
                                graphData.links.map((item, index) => {
                                    return (
                                        <p
                                            key={ index }
                                            style={ {
                                                textAlign: 'center',
                                                fontSize: getNodeSize(chartSize.width, chartSize.height, 0.04),
                                                marginBottom: '10px',
                                                color: '#92A182'
                                            } }
                                        >
                                            { item.weight }
                                        </p>
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
            </AddHeader>
        </>
    );
};
export default MST;
