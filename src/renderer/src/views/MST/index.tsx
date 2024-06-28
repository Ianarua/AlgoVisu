import { FC, useEffect, useState } from 'react';
import AddHeader from '../../HOC/AddHeader/AddHeader';
import ReactECharts from 'echarts-for-react';
import UnionFind from './UnionFind';
import styles from './style.module.less';
import classNames from 'classnames';

interface IProps {

}

// 定义边的类型
interface Edge {
    from: number; // 边的起始节点编号
    to: number;   // 边的目标节点编号
    weight: number; // 边的权重
}

type LineStyle = {
    color: string,
    width: number,
}

interface Link {
    source: number,
    target: number,
    weight: number,
    lineStyle: LineStyle
}

type Node = {
    name: number,
    x?: number,
    y?: number,
    fixed?: boolean
}

const MST: FC<IProps> = () => {
    const LINECOLOR = '#da1212';
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

    // 左侧说明中已连的边在环的classNames, null为默认情况下啥也不红，0为存在红，1为不
    const [hasEdge, setHasEdge] = useState(0);

    // 左侧说明中是否存存在红
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

    // 随机节点边
    function generateRandomEdges (maxNodes = 5, maxEdges = 7) {
        const edges: Edge[] = [];
        const nodeSet = new Set();

        for (let i = 0; i < maxEdges; i++) {
            const from = Math.floor(Math.random() * maxNodes);
            let to = Math.floor(Math.random() * maxNodes);
            while (to === from) {
                to = Math.floor(Math.random() * maxNodes); // 确保 from 和 to 不相同
            }
            const weight = Math.floor(Math.random() * 10) + 1; // 权重范围在1到10之间

            // 保证节点对的唯一性
            const edge: Edge = { from, to, weight };
            if (!nodeSet.has(`${ from }-${ to }`) && !nodeSet.has(`${ to }-${ from }`)) {
                edges.push(edge);
                nodeSet.add(`${ from }-${ to }`);
            }
        }
        return edges;
    }

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
            links: graphData.links.map(link => {
                const newLink = {
                    source: link.source.toString(),
                    target: link.target.toString(),
                    lineStyle: {
                        color: link?.lineStyle?.color
                    },
                    label: {
                        show: true,
                        formatter: () => link.weight,
                        fontStyle: 'oblique',
                        fontSize: getNodeSize(chartSize.width, chartSize.height, 0.02)
                    }
                };
                console.log('newLinke', newLink);
                return newLink;
            }),
            roam: true,     // 是否可互动
            focusNodeAdjacency: true,   // 是否在鼠标移到节点上的时候突出显示节点以及节点的边和邻接节点。[ default: false ]
        }]
    };

    // Kruskal 算法实现
    const kruskal = async (edges: Edge[], graphData: any): Promise<Edge[]> => {
        const nodes = graphData.nodes.length;
        edges.sort((a, b) => a.weight - b.weight);
        const uf = new UnionFind(nodes);
        const result: Edge[] = [];

        for (let edge of edges) {
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
        return result;
    };

    async function start (edges: Edge[]) {
        // 将edges转化为 node名称数组
        const nodes = edgesToNodeNames(edges);
        // 转化完后初始化图表
        setGraphData(prevState => {
            const newState = {
                ...prevState,
                nodes: nodes
            };

            // 添加所有边
            const allLinks = edgesToLink(edges);
            updateChart(allLinks);

            !(async function () {
                // 等待一段时间后清空连接
                await delay(2500);
                // 开始Kruskal算法
                await kruskal(edges, newState);
            })();
            return newState;
        });
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

    useEffect(() => {
        !(async function () {
            // 生成随机边数据
            const randomEdges = generateRandomEdges();
            await delay(200);
            init();
            await start(randomEdges);
        })();
    }, []);

    function updateChart (links: Link[]) {
        setGraphData(prevState => {
            if (prevState.links.length === 0) {
                return {
                    nodes: [...prevState.nodes],
                    links: [...prevState.links, ...links]
                };
            } else {
                const lastLink = links.at(-1);
                if (lastLink) {
                    prevState.links.forEach(item => {
                        if (item.source === lastLink.source && item.target === lastLink.target) {
                            item.lineStyle.color = LINECOLOR;
                        }
                    });
                }
                const newData = {
                    nodes: [...prevState.nodes],
                    links: [...prevState.links]
                };
                return newData;
            }
        });
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
            weight: item.weight,
            lineStyle: {
                color: '#fff',
                width: 3
            }
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
        return Array.from(nodeSet).map((item, index) => {
            const off = getNodeSize(chartSize.width, chartSize.height, 0.1);
            const otherY = index % 2 === 1 ? off : 0;
            return {
                name: item,
                x: (index % 3) * 300,
                y: Math.floor(index / 3) * 300 + otherY,
                fixed: true // 固定节点
            };
        });
    }

    return (
        <>
            <AddHeader title="MST">
                <div className={ styles.echarts }>
                    <div className={ styles.leftExplainTop }>
                        <span>已连的边：<span style={ { color: 'red', fontSize: 16, textAlign: 'center' } }>{ hasEdge }</span></span>
                    </div>
                    <ReactECharts option={ option } style={ { width: '100%', flex: 1, marginTop: 20 } }/>
                    <div className={ styles.leftExplainBottom }>
                        是否存在环？
                        <span className={ computedClassNames(0) }>不存在</span>
                        <span className={ computedClassNames(1) }>存在</span>
                        <br/>
                        总权重：{ totalWeight }
                    </div>
                </div>
                <div className={ styles.main }>
                    <div className={ styles.explain }>
                        <div className={ styles.edge }>
                            <p style={ { textAlign: 'center' } }>Edge</p>
                            {
                                graphData.links?.map((item, index) => {
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
                                graphData.links?.map((item, index) => {
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
