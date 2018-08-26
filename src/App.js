import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';
import FileStorageContract from './abi/FileStorage.json';
import FileInfo from './components/FileInfo.js';
import getWeb3 from './utils/getWeb3';
import ipfs from './utils/ipfs';
import bs58 from 'bs58';
import './App.css';

const ipfsBaseUrl = 'http://gateway.ipfs.io/ipfs/';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
		web3: null,
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
		const transaction = await this.state.contract.addFile(this.state.fileHash, this.state.fileHashFunction, this.state.fileHashSize, this.state.fileType, {from: this.state.web3.eth.accounts[0]});
		this.setState({ transactionHash: transaction['tx'] });

		// Reload files
		this.getAllFiles();
	}

	componentWillMount() {
		// Get network provider and web3 instance
		getWeb3
		.then(results => {
		this.setState({ web3: results.web3 });

		// Instantiate contract once web3 provided
		this.instantiateContract()
		})
		.catch(() => {
		console.log('Error finding web3.')
		});
	}


	instantiateContract() {
		const contract = require('truffle-contract');
		const fileStorage = contract(FileStorageContract);
		fileStorage.setProvider(this.state.web3.currentProvider);

		// Get accounts
		this.state.web3.eth.getAccounts((error, accounts) => {
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
		const fileHashes = await this.state.contract.getAllFileHashes({from: this.state.web3.eth.accounts[0]});
		// Get file metadata
		const fileMetadata = await this.state.contract.getAllFileMetadata({from: this.state.web3.eth.accounts[0]});
		
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
            </header>
            <div className="App-uploader">
                <h1>Fyle Upload</h1>
				<Form onSubmit={this.onSubmit}>
					<input type="file" onChange={this.captureFile}/>
					<select value={this.state.fileType} onChange={this.handleFileTypeChange}>
						<option value="1">Image</option>
						<option value="2">Video</option>
						<option value="3">Document</option>
						<option value="0">Other</option>
					</select>
					<p>
					<Button bsStyle="primary" type="submit">Upload</Button>
					</p>
				</Form>
				<p><code>IPFS hash: </code><a href={ipfsBaseUrl + this.state.ipfsHash} target="_blank">{this.state.ipfsHash}</a></p>
				<p><code>IPFS hex: </code>{this.state.ipfsHex}</p>
				<p><code>Hash function: </code>{this.state.fileHashFunction}</p>
				<p><code>Hash size: </code>{this.state.fileHashSize}</p>
				<p><code>File hash: </code>{this.state.fileHash}</p>
				<p><code>File type: </code>{this.state.fileType}</p>
				<p><code>Transaction hash: </code>{this.state.transactionHash}</p>
            </div>
            <div className="App-fyles">
                <h1>Fyles</h1>
				{this.state.filesHtml}
            </div>
        </div>
    );
  }
}

export default App;
