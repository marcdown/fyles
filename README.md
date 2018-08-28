## Fyles

IPFS-backed smart contract document store with support for Proof of Existence.

[![Build Status](https://travis-ci.org/marcdown/fyles.svg?branch=master)](https://travis-ci.org/marcdown/fyles)

## About
Fyles is a simple Web3-powered dApp that allows you to easily upload files to [IPFS](https://ipfs.io), a distributed storage protocol. A reference to each file is then stored in a smart contract associated with your wallet address, allowing you to easily reference your files anytime. This process allows for PoE, effectively proving the file existed at a certain point in time via the blockchain.

You can read more about Proof of Existence [here](https://www.newsbtc.com/proof-of-existence).

## Usage
Fyles works on any Web3-enabled browser! This could be Chrome Desktop with [MetaMask extension](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn), Firefox Android with [MetaMask add-on](https://addons.mozilla.org/en-US/android/addon/ether-metamask) and even native mobile dApp browsers like [Coinbase Wallet](https://www.toshi.org) and [Cipher](https://www.cipherbrowser.com)!

You can take Fyles for a spin on the [Rinkeby testnet](https://www.rinkeby.io) by going to http://fyles-rinkeby.s3-website-us-east-1.amazonaws.com.

[![alt text](https://github.com/marcdown/fyles/raw/master/fyles-demo.png "Fyles Demo")](https://vimeo.com/287005706)

## Installation

### Node
Make sure you have Node >= 8.3 installed by running `node --version`. If not, install the latest [here](https://nodejs.org/en/download).

### Dependency manager
Both [npm](https://www.npmjs.com) and [yarn](https://yarnpkg.com) are supported; npm comes bundled with NodeJS.

yarn installation instructions for Ubuntu and macOS are listed below; full instructions can be found [here](https://yarnpkg.com/en/docs/install).

#### Ubuntu
```
$ curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
$ echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
$ sudo apt-get update && sudo apt-get install yarn
```
#### macOS
`$ brew install yarn`

### Dependencies
Install all dependencies.

`$ npm install`

or

`$ yarn install`

### Run locally
Start a local instance and navigate to http://localhost:3000.

`$ npm start`

or

`$ yarn start`

## Development

### Configure env variables
```
$ cp env.sample .env
$ vim .env
```
We use [Infura](https://infura.io) to connect to `geth` and `ipfs` nodes. Sign up for a free account at https://infura.io, create an API key and add to `INFURA_API_KEY`.

Copy your wallet mnemonic and add to `WALLET_MNENOMIC`.

### Truffle Framework
Install [Truffle](https://truffleframework.com/truffle) and [Ganache](https://truffleframework.com/ganache).
```
$ npm install -g truffle
$ npm install -g ganache-cli
```

### Solidity development
Smart contracts are included in `contracts/` and migration scripts are in `migrations/`. **NOTE** that due to external import restrictions within `create-react-app` all contract migrations are stored in `src/abi/`.

#### Start local blockchain
`$ ganache-cli`

#### Compile contracts
`$ truffle compile`

#### Migrate contracts
This will deploy your contracts and generate ABI's in `src/abi/`.

development: `$ truffle migrate --reset`

rinkeby: `$ truffle migrate --reset --network rinkeby`

#### Test contracts
`$ truffle test`

### Deploy static files
`$ npm run build`

or

`$ yarn build`

## Issues
If you have any questions or installation problems, create an issue or reach out via heymarcbrown@gmail.com.
