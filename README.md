![fyles](https://ipfs.io/ipfs/Qmaj9MshzTireTPM4DFdfjEFjvqBnuRBL8SAqC3fb4igsT)

IPFS-backed smart contract public filestore with support for Proof of Existence.

## About
fyles is a web3-powered dApp that allows you to easily upload files to [IPFS](https://ipfs.io), a p2p distributed file system. The file hash is then stored in a smart contract associated with your wallet address, providing access to all of your files. This process allows for Proof of Existence, effectively proving the file existed at a certain point in time by attaching the same file hash to a transaction on the Ethereum blockchain.

You can read more about IPFS [here](https://hackernoon.com/a-beginners-guide-to-ipfs-20673fedd3f) and the concept of PoE [here](https://www.newsbtc.com/proof-of-existence).

## Usage
fyles works on any Web3-enabled browser! This could be Chrome Desktop with [MetaMask extension](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn), Firefox Android with [MetaMask add-on](https://addons.mozilla.org/en-US/android/addon/ether-metamask) and even native mobile dApp browsers like [Coinbase Wallet](https://www.toshi.org) and [Cipher](https://www.cipherbrowser.com)!

You can take fyles for a spin on the [Rinkeby testnet](https://www.rinkeby.io) by going to http://fyles-rinkeby.s3-website-us-east-1.amazonaws.com.

[![alt text](https://github.com/marcdown/fyles/raw/master/fyles-demo.png "fyles Demo")](https://ipfs.io/ipfs/QmcfFznrjPd441GxkEJkg1PkpoZy4r4Vq9iHLW8SLwt5CW)

## Installation

### Smart contracts

#### fyles-contracts
Check out the [fyles-contracts](https://github.com/marcdown/fyles-contracts) repo. Instructions on how to build and migrate are included in the README.

#### contracts symlink
Run `yarn link-contracts` to create a symlink in `src/`. The script assumes the `fyles-contracts` repo lives in the same directory as `fyles`; the path can be adjusted in `package.json`.

### Dependencies
Install all dependencies.

`$ yarn`

### Run locally
Start a local instance and navigate to http://localhost:3000.

`$ yarn start`

### Deploy static files
`$ yarn build`

## Issues
If you have any questions or problems please file a ticket.
