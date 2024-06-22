// 定义并查集（用于判断两个节点是否连通）
export default class UnionFind {
    parent: number[];
    rank: number[];

    constructor (size: number) {
        this.parent = new Array(size);
        this.rank = new Array(size).fill(0);

        // 初始化，每个节点的父节点指向自己
        for (let i = 0; i < size; i++) {
            this.parent[i] = i;
        }
    }

    // 查找节点所属的连通分量（根节点）
    find (node: number): number {
        if (this.parent[node] !== node) {
            this.parent[node] = this.find(this.parent[node]); // 路径压缩
        }
        return this.parent[node];
    }

    // // 合并两个节点所在的连通分量
    // union (x: number, y: number): void {
    //     let rootX = this.find(x);
    //     let rootY = this.find(y);
    //     if (rootX !== rootY) {
    //         this.parent[rootY] = rootX;
    //     }
    // }

    union (x: number, y: number): void {
        let rootX = this.find(x);
        let rootY = this.find(y);

        if (rootX !== rootY) {
            if (this.rank[rootX] > this.rank[rootY]) {
                this.parent[rootY] = rootX;
            } else if (this.rank[rootX] < this.rank[rootY]) {
                this.parent[rootX] = rootY;
            } else {
                this.parent[rootY] = rootX;
                this.rank[rootX] += 1;
            }
        }
    }

    // 删除两个节点之间的连接
    disconnect (x: number, y: number): void {
        let rootX = this.find(x);
        let rootY = this.find(y);
        if (rootX === rootY) {
            this.parent[y] = y; // 将节点 y 的父节点重新指向自己，断开连接
        }
    }
}

