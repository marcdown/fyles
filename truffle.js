require('dotenv').config();
const buildDirectory = `${__dirname}/src/abi`;
const HDWalletProvider = require('truffle-hdwallet-provider');

module.exports = {
    contracts_build_directory: buildDirectory,
    networks: {
        development: {
            host: "localhost",
            port: 8545,
            gas: 6721975,
            gasPrice: 20000000000,
            network_id: "*"
        },
        rinkeby: {
            provider: function() {
                return new HDWalletProvider(process.env.MNENOMIC, "https://rinkeby.infura.io/v3/" + process.env.INFURA_API_KEY)
            },
            network_id: 4
        }
      }
};
