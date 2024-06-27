import { FC, useEffect, useState } from 'react';
import styles from './style.module.less';
import AddHeader from '../../HOC/AddHeader/AddHeader';
import ReactECharts from 'echarts-for-react';
import HuffmanNode from './HuffmanNode';
import { Button, Input, message } from 'antd';

// import { ReloadOutlined } from '@ant-design/icons';

interface IProps {

}

// 图中使用的link
interface Link {
    source: number,
    target: number,
    weight: number
}

// 图中使用的node，本来展示id，但是设置了label，就可以展示weight
type Node = {
    id: number
    weight: number,
    x?: number | null,
    y?: number | null,
    fixed?: boolean
}

const HuffmanTree: FC<IProps> = () => {
    // 提示框
    const [messageApi, contextHolder] = message.useMessage();

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

    // 是否演示完成
    let [isFinish, setIsFinish] = useState(false);

    // 图表中的数据
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
            tooltip: {
                show: true
            },
            data: graphData.nodes.map(node => ({
                name: node.id, // 使用索引作为唯一标识符
                x: node.x, // 添加x坐标
                y: node.y, // 添加y坐标
                fixed: true, // 固定节点
                symbolSize: getNodeSize(chartSize.width, chartSize.height, 0.035),
                label: { // 显示节点的权重
                    show: true,
                    formatter: () => node.weight,
                    fontSize: getNodeSize(chartSize.width, chartSize.height, 0.02)
                }
            })),
            links: graphData.links?.map(link => ({
                source: link.source.toString(),
                target: link.target.toString(),
            })),
            // roam: true,     // 是否可互动
            focusNodeAdjacency: true,   // 是否在鼠标移到节点上的时候突出显示节点以及节点的边和邻接节点。[ default: false ]
        }]
    };

    // 权重数据数据
    const [huffmanData, setHuffmanData] = useState([1, 3, 5, 7, 9, 11]);

    // 构造哈夫曼树
    function buildHuffmanTree (weights: number[]): HuffmanNode {
        // 初始化节点列表
        let nodes = weights.map(weight => new HuffmanNode(weight));
        nodes.sort((a, b) => a.weight - b.weight); // 按照权重从小到大排序

        // 循环直到只剩下一个节点
        while (nodes.length > 1) {
            // 对节点列表按照权重排序
            nodes.sort((a, b) => a.weight - b.weight);

            // 取出两个权重最小的节点
            let left = nodes.shift()!;
            let right = nodes.shift()!;

            // 创建新节点，权重为两个子节点的权重之和
            let newNode = new HuffmanNode(left.weight + right.weight, left, right);

            // 将新节点加入节点列表
            nodes.push(newNode);
        }

        // 返回哈夫曼树的根节点
        return nodes[0];
    }

    // 计算宽度和深度
    function calculateWidthAndDepth (node: HuffmanNode | null, currentDepth = 0): { width: number, depth: number } {
        if (node === null) {
            return { width: 0, depth: 0 };
        }

        const leftInfo = calculateWidthAndDepth(node.left, currentDepth + 1);
        const rightInfo = calculateWidthAndDepth(node.right, currentDepth + 1);

        const width = leftInfo.width + rightInfo.width;
        const depth = Math.max(currentDepth, leftInfo.depth, rightInfo.depth);

        if (node.left === null && node.right === null) {
            return { width: width + 1, depth };
        } else {
            return { width, depth };
        }
    }

    // 将哈夫曼树转化为 Node Link对象
    async function traverseTree (node: HuffmanNode, depth: number, xStart: number, xEnd: number): Promise<{ nodes: Node[], links: Link[] }> {
        // 初始化节点和边的数据数组
        let nodes: Node[] = [];
        let links: Link[] = [];
        await delay();
        // 构造当前节点数据
        const currentNode: Node = {
            id: node.id,
            weight: node.weight,
            x: (xStart + xEnd) / 2,
            y: depth * 1.5,
            fixed: true
        };
        nodes.push(currentNode);

        // 如果有左子节点，递归遍历
        if (node.left) {
            const leftSubtree = await traverseTree(node.left, depth + 1, xStart, (xStart + xEnd) / 2);
            // 合并左子树的节点和边数据
            nodes = nodes.concat(leftSubtree.nodes);
            links = links.concat(leftSubtree.links);
            // 添加从当前节点到左子节点的边
            links.push({
                source: currentNode.id,
                target: node.left.id,
                weight: node.left.weight
            });
        }

        // 如果有右子节点，递归遍历
        if (node.right) {
            const rightSubtree = await traverseTree(node.right, depth + 1, (xStart + xEnd) / 2, xEnd);
            // 合并右子树的节点和边数据
            nodes = nodes.concat(rightSubtree.nodes);
            links = links.concat(rightSubtree.links);
            // 添加从当前节点到右子节点的边
            links.push({
                source: currentNode.id,
                target: node.right.id,
                weight: node.right.weight
            });
        }

        // 更新图表数据
        console.log('newLog', {nodes, links});
        setGraphData({ nodes, links });
        setIsFinish(true);
        return { nodes, links };
    }

    function init () {
        openNotification('开始绘制', 1);
        // 修改是否完成状态
        setIsFinish(false);
        // 重置图标数据
        setGraphData({
            nodes: [],
            links: []
        });
    }

    let [cnt, setCnt] = useState(0);
    useEffect(() => {
        init();
        // 构造哈夫曼树
        const huffmanTree = buildHuffmanTree(huffmanData);
        console.log(huffmanTree);
        // 计算树深度和宽度，深度从1开始，宽度为完全二叉树的宽度
        const treeInfo = calculateWidthAndDepth(huffmanTree);
        const depth = treeInfo.depth;
        const width = 2 ** depth;
        // 画图
        traverseTree(huffmanTree, 1, 0, width).then(); // 从1开始遍历，调整树的垂直位置

        // 退出后
        return () => {
            // 重置id
            HuffmanNode.resetIdCounter();
        };
    }, [cnt]);

    // 延迟函数
    function delay (time: number = 1500) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    const [inputValue, setInputValue] = useState<string>(huffmanData.toString());

    const handleChange = (e: any) => {
        const value = e.target.value;
        setInputValue(value);
    };

    // 提示函数
    const openNotification = (message: string, type: number = 0) => {
        type === 0 && messageApi.error(message);
        type === 1 && messageApi.success(message);
    };

    const handleSubmit = async () => {
        console.log('finish', isFinish);
        if (isFinish) {
            try {
                // 尝试解析输入的字符串
                console.log(inputValue);
                const tempValue = '[' + inputValue + ']';
                const parsedArray = JSON.parse(tempValue);
                // 检查解析后的结果是否为数组
                if (Array.isArray(parsedArray) && parsedArray.every(item => !Array.isArray(item))) {
                    setHuffmanData([...parsedArray]);
                    setCnt(prevState => prevState + 1);
                } else {
                    openNotification('格式错误！请输入以\',\'分隔的数字');
                }
            } catch (e) {
                openNotification('格式错误！请输入以\',\'分隔的数字');
            }
        } else {
            openNotification('请等待演示完成');
        }
    };

    return (
        <>
            { contextHolder }
            <AddHeader title="哈夫曼树的构造">
                <div className={ styles.echarts }>
                    <ReactECharts option={ option } style={ { width: '100%', height: '100%' } }/>
                </div>
                权重：
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
export default HuffmanTree;

