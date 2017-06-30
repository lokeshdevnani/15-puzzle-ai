import { Block } from './block.class';
import { PriorityQueue, Set } from 'typescript-collections';

export class Solution {
    initialMatrix: Array< Array<number> >;
    blank;

    static hello() {
        console.log('hello');
    }

    processInput(blocks: Block[], blank, size: number) {
        const mat = new Array < Array<number> >();
        for ( let i = 0; i < size; i++) {
            mat[i] = new Array<number>(size);
        }
        for ( let i = 0; i < blocks.length; i++) {
            mat[blocks[i].y][blocks[i].x] = blocks[i].number;
        }

        mat[blank.y][blank.x] = 0;

        console.log(mat);
        return mat;
    }

    input(blocks: Block[], blank, size: number) {
        // const matrix = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 0]];
        // const blank =  {x: 3, y: 3};

        this.initialMatrix = this.processInput(blocks, blank, size);
        this.blank = blank;
    }

    solve() {
        const init = new Node(0, this.initialMatrix, this.blank, 0);
        const goal = new Node(0, [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 0]], {x: 3, y: 3}, 0);

        const astar = new AStar(init, goal);
        const result = astar.execute();
        return result;
    }
}

export class Node {
    public stateStr: string;
    public path =  '';
    public size = 0;
    constructor(
        public value: number,
        public state, // 2-D matrix state
        public blankPos,
        public depth
    ) {
        let str = '';
        for (let i = 0; i < this.state.length; i++) {
            for (let j = 0; j < this.state.length; j++) {
                str += this.state[i][j] + ',';
            }
        }
        this.stateStr = str;
        this.size = this.state.length;
    }
}

export class AStar {
    public q: PriorityQueue<Node>;
    public visited: Set<string>;

    constructor (
        public initial: Node,
        public goal: Node,
    ) {
        this.q = new PriorityQueue<Node>( ( a, b ) => {
            if (a.value > b.value) {return  -1; }
            if (a.value < b.value) {return 1; }
            return 0;
        });
        [initial.blankPos.x, initial.blankPos.y] = [initial.blankPos.y, initial.blankPos.x];
        this.q.enqueue(initial);
        this.visited = new Set<string>();
    }

    execute() {
        this.visited.add(this.initial.stateStr);

        let t = 50000;
        while ( !this.q.isEmpty() && t--) {
            const current = this.q.dequeue();
            console.log(current);

            if ( current.stateStr === this.goal.stateStr) {
                return current;
            }

            this.expandNode(current)
        }
        return false;
    }

    expandNode(current: Node) {

        const blankX = current.blankPos.x;
        const blankY = current.blankPos.y;


        if ( blankX > 0) { // UP
            const newState = this.clone(current.state);
            [ newState[blankX - 1][blankY], newState[blankX][blankY] ]  = [ newState[blankX][blankY], newState[blankX - 1][blankY] ]
            const newNode = new Node(0, newState, {x: blankX - 1, y: blankY}, current.depth + 1);

            if (!this.visited.contains(newNode.stateStr)) {
                newNode.value = newNode.value + this.heuristic(newNode);
                newNode.path = current.path + 'U';
                this.q.add(newNode);
                this.visited.add(newNode.stateStr);
            }
        }
        if ( blankX < current.size - 1) { // DOWN
            const newState = this.clone(current.state);
            [ newState[blankX + 1][blankY], newState[blankX][blankY] ]  = [ newState[blankX][blankY], newState[blankX + 1][blankY] ]
            const newNode = new Node(0, newState, {x: blankX + 1, y: blankY}, current.depth + 1);

            if (!this.visited.contains(newNode.stateStr)) {
                newNode.value = newNode.value + this.heuristic(newNode);
                newNode.path = current.path + 'D';
                this.q.add(newNode);
                this.visited.add(newNode.stateStr);
            }
        }

        if ( blankY > 0 ) { // LEFT
            const newState = this.clone(current.state);
            [ newState[blankX][blankY - 1], newState[blankX][blankY] ]  = [ newState[blankX][blankY], newState[blankX][blankY - 1] ]
            const newNode = new Node(0, newState, {x: blankX, y: blankY - 1}, current.depth + 1);

            if (!this.visited.contains(newNode.stateStr)) {
                newNode.value = newNode.value + this.heuristic(newNode);
                newNode.path = current.path + 'L';
                this.q.add(newNode);
                this.visited.add(newNode.stateStr);
            }
        }

        if ( blankY < current.size - 1) { // RIGHT
            const newState = this.clone(current.state);
            [ newState[blankX][blankY + 1], newState[blankX][blankY] ]  = [ newState[blankX][blankY], newState[blankX][blankY + 1] ]
            const newNode = new Node(0, newState, {x: blankX, y: blankY + 1}, current.depth + 1);

            if (!this.visited.contains(newNode.stateStr)) {
                newNode.value = newNode.value + this.heuristic(newNode);
                newNode.path = current.path + 'R';
                this.q.add(newNode);
                this.visited.add(newNode.stateStr);
            }
        }

    }

    heuristic(current: Node) {
        return this.manhattanDistance(current) + this.linearConflicts(current);
    }

    misPlacedTilesCount(current: Node) {
        let result = 0;
        for (let i = 0; i < current.state.length; i++) {
            for (let j = 0; j < current.state[i].length; j++) {
                if (current.state[i][j] !== this.goal.state[i][j] && current.state[i][j] !== 0) {
                    result++;
                }
            }
        }
        return result;
    }

    manhattanDistance(node) {
        let result = 0;

        for (let i = 0; i < node.state.length; i++) {
            for (let j = 0; j < node.state[i].length; j++) {
                const elem = node.state[i][j];
                let found = false;

                for (let h = 0; h < this.goal.state.length; h++) {
                    for (let k = 0; k < this.goal.state[h].length; k++) {
                        if (this.goal.state[h][k] === elem) {
                            result += Math.abs(h - i) + Math.abs(j - k);
                            found = true;
                            break;
                        }
                    }
                    if (found) {
                        break;
                    }
                }
            }
        }
        return result
    }

    linearConflicts(node) {
        let result = 0;
        const state = node.state;

        // Row Conflicts
        for (let i = 0; i < state.length; i++) {
            result += this.findConflicts(state, i, 1);
        }

        // Column Conflicts
        for (let i = 0; i < state[0].length; i++) {
            result += this.findConflicts(state, i, 0);
        }

        return result;
    }

    doesArrayContain(arr, x) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === x) {
                return true;
            }
        }
        return false;
    }

    findConflicts(state, i, dimension) {
        let result = 0;
        const tilesRelated = new Array();

        // Loop foreach pair of elements in the row/column
        for (let h = 0; h < state.length - 1 && !this.doesArrayContain(tilesRelated, h); h++) {
            for (let k = h + 1; k < state.length && !this.doesArrayContain(tilesRelated, h); k++) {
                const moves = dimension === 1
                    ? this.inConflict(i, state[i][h], state[i][k], h, k, dimension)
                    : this.inConflict(i, state[h][i], state[k][i], h, k, dimension);

                if ( moves === 0 ) { continue; }
                result += 2;
                tilesRelated.push([h, k ]);
                break;
            }
        }

        return result;
    }

    inConflict (index, a, b, indexA, indexB, dimension) {
            let indexGoalA = -1
            let indexGoalB = -1

            for (let c = 0; c < this.goal.state.length; c++) {
                if (dimension === 1 && this.goal.state[index][c] === a) {
                    indexGoalA = c;
                } else if (dimension === 1 && this.goal.state[index][c] === b) {
                    indexGoalB = c;
                } else if (dimension === 0 && this.goal.state[c][index] === a) {
                    indexGoalA = c;
                } else if (dimension === 0 && this.goal.state[c][index] === b) {
                    indexGoalB = c;
                }
            }
                return (indexGoalA >= 0 && indexGoalB >= 0) && ((indexA < indexB && indexGoalA > indexGoalB) ||
                   (indexA > indexB && indexGoalA < indexGoalB))
                           ? 2
                           : 0;
        }

    clone(state) {
        return JSON.parse(JSON.stringify(state));
    }
}
