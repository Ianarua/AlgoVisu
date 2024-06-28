export default class HuffmanNode {
    weight: number;  // 权重
    id: number; // id，图像用，算法不用
    left: HuffmanNode | null; // 左节点
    right: HuffmanNode | null; // 右节点

    private static _currentId: number = 0; // 私有静态属性，用于存储当前id

    constructor (weight: number, left: HuffmanNode | null = null, right: HuffmanNode | null = null) {
        this.weight = weight;
        this.id = HuffmanNode._currentId++; // 图像用，算法不用
        this.left = left;
        this.right = right;
    }

    // 添加一个静态方法来重置id计数器，图像用，算法不用
    static resetIdCounter() {
        HuffmanNode._currentId = 0;
    }
}
