/* eslint-disable class-methods-use-this, camelcase */

const Web3 = require('web3');

class MerkleTree {
    constructor(data) {
        this.leaves = this.buildLeaves(data);
        this.tree = this.computeMerkleTree(this.leaves);

        this.levels = this.tree.levels;
        this.sortedLevels = this.tree.sortedLevels;
    }

    /**
     * @description Returns an array with an even amount of values
     * @param {array} elements An array
     * @returns {array} A new array
     */
    makeEvenElements(elements) {
        if (elements.length === 0) {
            throw new Error('No data was provided...');
        }

        const even = elements;

        if (even.length % 2 !== 0) {
            even.push(
                even[even.length - 1],
            );
        }

        return even;
    }

    /**
     * @description Sorts an array (ascending order)
     * @param {array} arrayToSort The array to sort
     * @returns {array} The sorted array
     */
    sort(arrayToSort) {
        const sortedArray = [...arrayToSort];
        return sortedArray.sort((a, b) => Web3.utils.toBN(a).gt(Web3.utils.toBN(b)));
    }

    /**
     * @description Hashes data to create leaves
     * @param {array} data An array
     * @return {array} A new array containing hashed values
     */
    hashLeaves(data) {
        return data.map((d) => Web3.utils.soliditySha3(d));
    }

    /**
     * @description Builds the leaves of a Merkle tree
     * @param {array} data An array of data
     * @returns {array} The leaves of the Merkle tree (as an even and sorted array)
     */
    buildLeaves(data) {
        const evenLeaves = this.makeEvenElements(data);
        const hashedLeaves = this.hashLeaves(evenLeaves);
        return this.sort(hashedLeaves);
    }

    /**
     * @description Calculates a new node from 2 values
     * @param {string} left The left parameter for the new node
     * @param {string} right The right parameter for the new node
     * @returns {string} The new node (hash)
     */
    calculateParentNode(left, right) {
        // If a node doesn't have a sibling, it will be hashed with itself
        if (left === undefined || right === undefined) {
            return Web3.utils.soliditySha3({
                type: 'bytes',
                value: right ? right : left,
            }, {
                type: 'bytes',
                value: right ? right : left,
            });
        }

        return Web3.utils.soliditySha3({
            type: 'bytes',
            value: left
        }, {
            type: 'bytes',
            value: right,
        });
    }

    /**
     * @description Calculates the parent nodes from an array of nodes
     * @param {array} nodes The current nodes
     * @returns {array} The parent nodes
     */
    createParentNodes(nodes) {
        const parentsNodes = [];

        for (let i = 0; i < nodes.length; i += 2) {
            const node = this.calculateParentNode(nodes[i], nodes[i + 1]);
            parentsNodes.push(node);
        }

        return parentsNodes;
    }

    /**
     * @description Computes a merkle tree
     * @param {array} leaves The initial leaves of the tree
     * @returns {object} A merkle tree
     */
    computeMerkleTree(leaves) {
        const levels = [];
        const sortedLevels = [];

        let nodes = leaves;

        while (nodes.length > 1) {
            nodes = this.createParentNodes(nodes);
            levels.push(nodes);
            sortedLevels.push(this.sort(nodes));
            nodes = this.sort(nodes);
        }

        return {
            levels,
            sortedLevels,
        };
    }

    /**
     * @description Returns the leaves of the merkle tree
     * @returns {array} The leaves as an array
     */
    getLeaves() {
        return this.leaves;
    }

    /**
     * @description Returns the levels of the merkle tree
     * @returns {array} The levels as an array
     */
    getLevels() {
        return this.levels;
    }

    /**
     * @description Returns the sorted levels of the merkle tree
     * @returns {array} The sorted levels as an array
     */
    getSortedLevels() {
        return this.sortedLevels;
    }

    /**
     * @description Returns the root of the merkle tree
     * @returns {string} The root as an string (hash)
     */
    getRoot() {
        return this.levels[this.levels.length - 1][0];
    }

    /**
     * @description Returns the depth of the merkle tree
     * @returns {number} The depth of the merkle tree
     */
    getDepth() {
        return this.levels.length + 1;
    }

    /**
     * @description Returns the proof of a specific leaf
     * @param {string} data The data to be proven
     * @returns {array} The array of proofs for the leaf
     */
    getProof(data) {
        const leaf = Web3.utils.soliditySha3(data);
        const index = this.leaves.indexOf(leaf);

        if (index === -1) {
            throw new Error('Leaf not found...');
        }

        const path = [];

        if (index % 2 === 0) {
            path.push(this.leaves[index + 1]);
        } else {
            path.push(this.leaves[index - 1]);
        }

        let currentIndex = index;

        for (let i = 0; i < this.levels.length - 1; i += 1) {
            const parentIndex = Math.floor(currentIndex / 2);
            const parentHash = this.levels[i][parentIndex];

            const sortedParentIndex = this.sortedLevels[i].indexOf(parentHash);
            currentIndex = sortedParentIndex;

            if (sortedParentIndex % 2 === 0) {
                if (this.sortedLevels[i][sortedParentIndex + 1] === undefined) {
                    path.push(this.sortedLevels[i][sortedParentIndex]);
                } else {
                    path.push(this.sortedLevels[i][sortedParentIndex + 1]);
                }
            } else {
                path.push(this.sortedLevels[i][sortedParentIndex - 1]);
            }
        }

        return path;
    }

    isDataValid(data, proof) {
        const leaf = Web3.utils.soliditySha3(data);

        let potentialRoot = leaf;

        for (let i = 0; i < proof.length; i += 1) {
            if (Web3.utils.toBN(potentialRoot).lt(Web3.utils.toBN(proof[i]))) {
                potentialRoot = Web3.utils.soliditySha3({
                    type: 'bytes',
                    value: potentialRoot,
                }, {
                    type: 'bytes',
                    value: proof[i],
                });
            } else {
                potentialRoot = Web3.utils.soliditySha3({
                    type: 'bytes',
                    value: proof[i],
                }, {
                    type: 'bytes',
                    value: potentialRoot,
                });
            }
        }

        return this.getRoot() === potentialRoot;
    }
}

module.exports = MerkleTree;
