# Smart-Contracts for [The Sandbox](https://www.sandbox.game)

[www.sandbox.game](https://www.sandbox.game)

The Sandbox is a user-generated content (UGC) gaming platform that will empower creators through digital ownership and monetization of 3D voxel creations made and shared by users around the world.

Learn more:

- Website: www.sandbox.game
- Discord: https://discordapp.com/invite/vAe4zvY
- Telegram: https://t.me/sandboxgame
- Medium: https://medium.com/sandbox-game

# Blockchain Features

We’re adopting the best standards to reach to players who are not familiar with Blockchain and Web3 technologies, simplifying the UX and on-boarding

- Dual token structure smart-contract: [ERC-721](https://eips.ethereum.org/EIPS/eip-721) / [ERC-1155](https://eips.ethereum.org/EIPS/eip-1155)
- Escrowless Auctions
- Meta-Transactions
- [EIP-712 DRAFT](https://eips.ethereum.org/EIPS/eip-712) for Human-Readable signature messages
- [EIP-1776 DRAFT](https://github.com/ethereum/EIPs/issues/1776) submitted by Pixowl to Ethereum for Native Meta-Transactions

More detailed information can be found on our Medium article: [https://medium.com/sandbox-game/blockchain-features-in-the-sandbox-7db91fcc615c](https://medium.com/sandbox-game/blockchain-features-in-the-sandbox-7db91fcc615c)

---

# Get Started Instructions

If you want to check out our contracts and run the test follow these instructions :

SETUP :

```
yarn
```

RUN TESTS :

```
yarn test
```

# Technical Documentation

You can explore here the documentation of our tokens and blockchain featurs:

- our ERC-20 token : [SAND](documentation/Sand.md)
- Meta-Transaction implementation (EIP-1776) : [Meta-Transactions](documentation/meta_transactions.md)

- our ERC-1155/ERC-721 Asset token : [ASSET](documentation/Asset.md)

- our ERC-721 LAND token : [LAND](documentation/Land.md)

- our Marketplaces features: [Escrowless Auctions](documentation/escrow_less_auctions.md)
- our User-Generated Content Moderation Policies using [Prediction Market](documentation/curation.md)
