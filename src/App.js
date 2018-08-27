import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';
import FileStorageContract from './abi/FileStorage.json';
import FileInfo from './components/FileInfo.js';
import getWeb3 from './utils/getWeb3';
import ipfs from './utils/ipfs';
import bs58 from 'bs58';
import './App.css';

const ipfsBaseUrl = 'https://gateway.ipfs.io/ipfs/';
const txBaseUrl = 'https://rinkeby.etherscan.io/tx/';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
            web3: null,
            account: null,
            displayAddress: '',
            contract: null,
            files: null,
            filesHtml: null,
            buffer: null,
            ipfsHash: null,
            ipfsHex: null,
            fileHash: null,
            fileHashFunction: null,
            fileHashSize: null,
            fileType: '3',
            transactionHash: null
		};
	}

	captureFile = (event) => {
		event.stopPropagation();
		event.preventDefault();
		const file = event.target.files[0];
		let reader = new window.FileReader();
		reader.readAsArrayBuffer(file);
		reader.onloadend = () => this.convertToBuffer(reader); 
	}

	convertToBuffer = async (reader) => {
		const buffer = await Buffer.from(reader.result);
		this.setState({ buffer: buffer });
	}

	handleFileTypeChange = (event) => {
		this.setState({ fileType: event.target.value });
	}

	onSubmit = async (event) => {
		event.preventDefault();

        // Save document to IPFS and set file hash + metadata
        const files = await ipfs.add(this.state.buffer);
		const hash = files[0].hash;
		const hexValues = this.ipfsHashToHexValues(hash);
		
		this.setState({
			ipfsHash: hash,
			ipfsHex: hexValues.ipfsHex,
			fileHashFunction: hexValues.hashFunction,
			fileHashSize: hexValues.hashSize,
			fileHash: hexValues.fileHash
		});

		// Add file to contract
		const transaction = await this.state.contract.addFile(this.state.fileHash, this.state.fileHashFunction, this.state.fileHashSize, this.state.fileType, {from: this.state.account});
		this.setState({ transactionHash: transaction['tx'] });

		// Reload files
		this.getAllFiles();
	}

	componentDidMount() {
		// Get network provider and web3 instance
		getWeb3.then(results => {
		    this.setState({ web3: results.web3 });

		    // Instantiate contract once web3 provided
		    this.instantiateContract()
		}).catch(() => {
		    console.log('Error finding web3.')
		});
	}

    setDisplayAddress(address) {
        if (address.length > 7) {
            var displayAddress = address.substring(0, 10) + '...';
            this.setState({ displayAddress: displayAddress });
        }
    }

	instantiateContract() {
		const contract = require('truffle-contract');
		const fileStorage = contract(FileStorageContract);
		fileStorage.setProvider(this.state.web3.currentProvider);

		// Get accounts and store preferred wallet based on index defined in .env
		this.state.web3.eth.getAccounts((error, accounts) => {
            const account = accounts[0];
            this.setState({ account: account });
            this.setDisplayAddress(account.toString());
            fileStorage.deployed().then((contract) => {
                if (error) throw error;
                this.setState({ contract: contract });
                
                // Get files
                this.getAllFiles();
            })
		})
	}

	async getAllFiles() {
		// Get file hashes
		const fileHashes = await this.state.contract.getAllFileHashes({from: this.state.account});
		// Get file metadata
		const fileMetadata = await this.state.contract.getAllFileMetadata({from: this.state.account});
		
		// Return most recent files first
		var files = []
		for (var index = fileHashes.length - 1; index >= 0; index--) {
			var fileHash = fileHashes[index];
			var metadata = fileMetadata[index];
			var file = this.hexValuesToFileObject(fileHash, metadata);
			files.push(file);
		}
        this.setState({ files: files });

        // Initialize FileInfo objects
		const filesHtml = files.map((file, index) => 
		    <FileInfo key={index} file={file}/>
		);
		this.setState({ filesHtml: filesHtml });
	}

	ipfsHashToHexValues(ipfsHash) {
		// Convert Base58 hash to hex
		const bytes = bs58.decode(ipfsHash);
		const hex = bytes.toString('hex');

		// Extract file metadata from hex
		const hashFunction = hex.slice(0, 2);
		const hashSize = hex.slice(2, 4);
		const fileHash = hex.slice(4);

		return {
            ipfsHex: '0x' + hex,
            hashFunction: '0x' + hashFunction,
            hashSize: '0x' + hashSize,
            fileHash: '0x' + fileHash
		};
	}

	hexValuesToFileObject(fileHash, metadata) {
		const hashFunction = metadata.slice(64, 66);
		const hashSize = metadata.slice(62, 64);
		const fileType = parseInt(metadata.slice(60, 62), 16);
		const hashHex = hashFunction + hashSize + fileHash.slice(2);
		const hashBytes = Buffer.from(hashHex, 'hex');
		const hashStr = bs58.encode(hashBytes);
		
		return {
			hash: hashStr,
			type: fileType,
			url: ipfsBaseUrl + hashStr
		};
    }

    render() {
    return (
        <div className="App">
            <header className="App-header">
                <h1 className="App-title">Fyles</h1>
                <h1 className="App-address">{this.state.displayAddress}</h1>
            </header>
            <div className="App-content">
                <div className="App-uploader">
                    <Form onSubmit={this.onSubmit}>
                        <input type="file" name="file" id="file" className="inputfile" onChange={this.captureFile}/>
                        <label htmlFor="file">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17">
                                <path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"/>
                            </svg>
                            <span>Choose a fyle...</span>
                        </label>
                        <p>
                            <select value={this.state.fileType} onChange={this.handleFileTypeChange}>
                                <option value="1">Image</option>
                                <option value="2">Video</option>
                                <option value="3">Document</option>
                                <option value="0">Other</option>
                            </select>
                        </p>
                        <p>
                            <Button bsStyle="primary" type="submit">Upload</Button>
                        </p>
                    </Form>
                    <p>IPFS hash: <code><a href={ipfsBaseUrl + this.state.ipfsHash} target="_blank">{this.state.ipfsHash}</a></code></p>
                    {/*<p>IPFS hex: <code>{this.state.ipfsHex}</code></p>
                    <p>Hash function: <code>{this.state.fileHashFunction}</code></p>
                    <p>Hash size: <code>{this.state.fileHashSize}</code></p>
                    <p>File hash: <code>{this.state.fileHash}</code></p>
                    <p>File type: <code>{this.state.fileType}</code></p>*/}
                    <p>Transaction hash: <code><a href={txBaseUrl + this.state.transactionHash} target="_blank">{this.state.transactionHash}</a></code></p>
                </div>
                <div className="App-fyles">
                    {this.state.filesHtml}
                </div>
            </div>
        </div>
    );
  }
}

export default App;
