const fs = require('fs');
const path = require('path');
const rocketh = require('rocketh');

const MerkleTree = require('../lib/merkleTree');
const {createDataArray, calculateLandHash} = require('../lib/merkleTreeHelper');

const deployment = rocketh.deployment('LandSale');
const lands = deployment.data;
const landHashArray = createDataArray(lands);
const tree = new MerkleTree(landHashArray);

const landsWithProof = [];
for (const land of lands) {
    land.proof = tree.getProof(calculateLandHash(land));
    landsWithProof.push(land);
}

fs.writeFileSync(path.join('deployments', rocketh.chainId, 'data', 'landsWithProof.json'), JSON.stringify(landsWithProof, null, '  '));