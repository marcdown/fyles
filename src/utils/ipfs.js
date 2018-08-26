const ipfsApi = require('ipfs-api');

// Local daemon
const ipfs = new ipfsApi({ host: 'localhost', port: 5001, protocol: 'http' });

// Infura daemon
//const ipfs = new ipfsApi({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

export default ipfs
