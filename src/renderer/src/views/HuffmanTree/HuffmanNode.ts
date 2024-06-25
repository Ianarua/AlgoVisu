export default class HuffmanNode {
    weight: number;
    id: number;
    left: HuffmanNode | null;
    right: HuffmanNode | null;

    private static _currentId: number = 0; // 私有静态属性，用于存储当前id

    constructor (weight: number, left: HuffmanNode | null = null, right: HuffmanNode | null = null) {
        this.weight = weight;
        this.id = HuffmanNode._currentId++;
        this.left = left;
        this.right = right;
    }

    // 添加一个静态方法来重置id计数器
    static resetIdCounter() {
        HuffmanNode._currentId = 0;
    }
}
