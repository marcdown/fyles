pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title File Storage contract
 * @dev Every address will contain one or more file hashes and 
 *      associated metadata (hash function, hash size, file type, etc.)
 * @dev Constructor initialization and owner assignment have been
 *      delegated to the Ownable contract
 */
contract FileStorage is Ownable  {

    // Struct for file hashes and metadata
    struct Files {
        bytes32[] hashes;
        bytes32[] metadata;
    }

    // Support various file types
    enum FileType { Unknown, Image, Video, Document }
    
    // Map sender's address to all uploaded files
    mapping (address => Files) files;

    // Circuit breaker to disable adding new files in the event of a contract logic issue
    bool public canAddFile = true;

    modifier acceptingFiles {
        require(canAddFile, "Contract must be accepting new files");
        _;
    }

    // Event fired after adding a new file
    event AddedFile(address _sender, bytes32 _fileHash, bytes1 _hashFunction, bytes1 _hashSize, FileType _fileType);

    /**
     * @dev Add a file to the contract
     * @param _fileHash Hash representation of the file (bytes 3 through 34 of IPFS hash)
     * @param _hashFunction Hashing algorithm used (1st byte of IPFS hash)
     * @param _hashSize Length of file hash (2nd byte of IPFS hash)
     * @param _fileType FileType enum
     */
    function addFile(bytes32 _fileHash, bytes1 _hashFunction, bytes1 _hashSize, FileType _fileType) public acceptingFiles {
        require(_fileHash != 0x0, "_fileHash cannot be null");
        require(_hashFunction != 0x0, "_hashFunction cannot be null");
        require(_hashSize != 0x0, "_hashSize cannot be null");
        
        // Add fileHash to hashes array
        files[msg.sender].hashes.push(_fileHash);

        // Add formatted metadata to metadata array
        bytes32 fileMetadata = formatMetadata(_hashFunction, _hashSize, _fileType);
        files[msg.sender].metadata.push(fileMetadata);

        emit AddedFile(msg.sender, _fileHash, _hashFunction, _hashSize, _fileType);
    }

    /**
     * @dev Prep metadata for storage
     * @param _hashFunction Hashing algorithm used (1st byte of IPFS hash)
     * @param _hashSize Length of file hash (2nd byte of IPFS hash)
     * @param _fileType FileType enum
     * @return bytes32 formatted object
     */
    function formatMetadata(bytes1 _hashFunction, bytes1 _hashSize, FileType _fileType) internal pure returns (bytes32) {
        // Create file metadata object and assign hashing function
        uint256 fileMetadata = uint256(_hashFunction);
        // Add hashSize to metadata using bitwise OR and shifting 8 bits to the left
        fileMetadata |= uint256(_hashSize)<<8;
        // Add fileType to metadata using bitwise OR and shifting another 8 bits to the left
        fileMetadata |= uint256(_fileType)<<16;

        return bytes32(fileMetadata);
    }

    /**
     * @dev Get file hash count for a specific address
     * @return Total number of file hashes for caller's address
     */
    function getFileHashCount() public view returns (uint) {
        return files[msg.sender].hashes.length;
    }

    /**
     * @dev Get file metadata count for a specific address
     * @return Total number of file metadata objects for caller's address
     */
    function getFileMetadataCount() public view returns (uint) {
        return files[msg.sender].metadata.length;
    }

    /**
     * @dev Get file hash for a given index
     * @param _index File hash index
     * @return File hash
     */
    function getFileHash(uint _index) public view returns (bytes32) {
        require(files[msg.sender].hashes.length > _index, "File hash index is out of bounds");

        return files[msg.sender].hashes[_index];
    }

    /**
     * @dev Get file metadata for a given index
     * @param _index File metadata index
     * @return File metadata
     */
    function getFileMetadata(uint _index) public view returns (bytes32) {
        require(files[msg.sender].metadata.length > _index, "File metadata index is out of bounds");

        return files[msg.sender].metadata[_index];
    }

    /**
     * @dev Get all file hashes for a specific address
     * @return Array of file hashes
     */
    function getAllFileHashes() public view returns (bytes32[]) {
        return files[msg.sender].hashes;
    }

    /**
     * @dev Get all file metadata for a specific address
     * @return Array of file metadata
     */
    function getAllFileMetadata() public view returns (bytes32[]) {
        return files[msg.sender].metadata;
    }

    /**
     * @dev Owner: get all file hashes for an address
     */
    function getFileHashesForAddress(address _user) public view onlyOwner returns (bytes32[]) {
        require(_user != address(0), "_user must not be 0x0");

        return files[_user].hashes;
    }

    /**
     * @dev Owner: get all file metadata for an address
     */
    function getFileMetadataForAddress(address _user) public view onlyOwner returns (bytes32[]) {
        require(_user != address(0), "_user must not be 0x0");

        return files[_user].metadata;
    }

    /**
     * @dev Owner: toggle ability to allow new files
     */
    function setCanAddFile(bool value) public onlyOwner {
        canAddFile = value;
    }

    /**
     * @dev Owner: Destroy the contract and withdraw any balance to the owner.
     *      WARNING: This is an unrecoverable operation!
     */
    function kill() public onlyOwner {
        selfdestruct(owner);
    }
    
    /**
     * @dev Fallback function
     */
    function () public payable {
        revert();
    }
}