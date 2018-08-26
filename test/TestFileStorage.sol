pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/FileStorage.sol";
import "./util/ModifierProxy.sol";

/**
 * @title Test coverage for FileStorage contract
 */
contract TestFileStorage {

    // Contract instance
    FileStorage fileStorage;

    // Sample file 1
    bytes32 constant file1Hash = 0xF26240C274C2ABCEA3258FCE6FAE0B2AF6F4045CEE50D140377F40F089DB0CB5;
    bytes32 constant file1Metadata = 0x0000000000000000000000000000000000000000000000000000000000002012;
    bytes1 constant file1HashFunction = 0x12;
    bytes1 constant file1HashSize = 0x20;
    FileStorage.FileType file1Type = FileStorage.FileType.Unknown;

    // Sample file 2
    bytes32 constant file2Hash = 0x48E472EE1A129DD2B28677C40E6A0A94F6E64B820FD2E7E4FCC95B2010A32161;
    bytes32 constant file2Metadata = 0x0000000000000000000000000000000000000000000000000000000000031011;
    bytes1 constant file2HashFunction = 0x11;
    bytes1 constant file2HashSize = 0x10;
    FileStorage.FileType file2Type = FileStorage.FileType.Document;
    
    /**
     * @dev Reset storage before each test
     */
    function beforeEach() public {
        fileStorage = new FileStorage();
    }

    /**
     * @dev Test adding a new file hash
     */
    function testAddFileHash() public {
        fileStorage.addFile(file1Hash, file1HashFunction, file1HashSize, file1Type);
        bytes32 storedFileHash = fileStorage.getFileHash(0);

        Assert.equal(storedFileHash, file1Hash, "File hashes should match.");
    }

    /**
     * @dev Test adding a new file metadata
     */
    function testAddFileMetadata() public {
        fileStorage.addFile(file1Hash, file1HashFunction, file1HashSize, file1Type);
        bytes32 storedFileMetadata = fileStorage.getFileMetadata(0);
        bytes1 expectedFileType = bytes1(uint256(file1Type));

        Assert.equal(storedFileMetadata[31], file1HashFunction, "File hash functions should match.");
        Assert.equal(storedFileMetadata[30], file1HashSize, "File hash sizes should match.");
        Assert.equal(storedFileMetadata[29], expectedFileType, "File types should match.");
    }

    /**
     * @dev Test returning the correct file hash count
     */
    function testGetFileHashCount() public {
        fileStorage.addFile(file1Hash, file1HashFunction, file1HashSize, file1Type);
        uint storedFileHashCount = fileStorage.getFileHashCount();

        Assert.equal(storedFileHashCount, 1, "File hash count should be 1.");

        fileStorage.addFile(file2Hash, file2HashFunction, file2HashSize, file2Type);
        storedFileHashCount = fileStorage.getFileHashCount();

        Assert.equal(storedFileHashCount, 2, "File hash count should be 2.");
    }

    /**
     * @dev Test returning the correct file metadata count
     */
    function testGetFileMetadataCount() public {
        fileStorage.addFile(file1Hash, file1HashFunction, file1HashSize, file1Type);
        uint storedFileMetadataCount = fileStorage.getFileMetadataCount();

        Assert.equal(storedFileMetadataCount, 1, "File metadata count should be 1.");

        fileStorage.addFile(file2Hash, file2HashFunction, file2HashSize, file2Type);
        storedFileMetadataCount = fileStorage.getFileMetadataCount();

        Assert.equal(storedFileMetadataCount, 2, "File metadata count should be 2.");
    }

    /**
     * @dev Test returning the correct file hashes
     */
    function testGetFileHashes() public {
        fileStorage.addFile(file1Hash, file1HashFunction, file1HashSize, file1Type);
        fileStorage.addFile(file2Hash, file2HashFunction, file2HashSize, file2Type);
        bytes32[] memory storedFileHashes = fileStorage.getAllFileHashes();

        Assert.equal(storedFileHashes[0], file1Hash, "File hash at index 0 should match first file.");
        Assert.equal(storedFileHashes[1], file2Hash, "File hash at index 1 should match second file.");
    }

    /**
     * @dev Test returning the correct file metadata
     */
    function testGetFileMetadata() public {
        fileStorage.addFile(file1Hash, file1HashFunction, file1HashSize, file1Type);
        fileStorage.addFile(file2Hash, file2HashFunction, file2HashSize, file2Type);
        bytes32[] memory storedFileMetadata = fileStorage.getAllFileMetadata();

        Assert.equal(storedFileMetadata[0], file1Metadata, "File metadata at index 0 should match first file.");
        Assert.equal(storedFileMetadata[1], file2Metadata, "File metadata at index 1 should match second file.");
    }

    /**
     * @dev Test ability to enable/disable adding new files 
     */
    function testAddFileToggle() public {
        fileStorage.addFile(file1Hash, file1HashFunction, file1HashSize, file1Type);
        uint storedFileHashCount = fileStorage.getFileHashCount();
        uint storedFileMetadataCount = fileStorage.getFileMetadataCount();

        Assert.equal(storedFileHashCount, 1, "File hash count should be 1.");
        Assert.equal(storedFileMetadataCount, 1, "File metadata count should be 1.");

        // Disable adding new files
        fileStorage.setCanAddFile(false);
        ModifierProxy modifierProxy = new ModifierProxy(address(fileStorage));
        FileStorage(address(modifierProxy)).addFile(file2Hash, file2HashFunction, file2HashSize, file2Type);
        bool success = modifierProxy.execute.gas(200000)();

        Assert.isFalse(success, "Modifier proxy should fail to execute successfully.");

        // Enable adding new files
        fileStorage.setCanAddFile(true);
        fileStorage.addFile(file2Hash, file2HashFunction, file2HashSize, file2Type);
        storedFileHashCount = fileStorage.getFileHashCount();
        storedFileMetadataCount = fileStorage.getFileMetadataCount();

        Assert.equal(storedFileHashCount, 2, "File hash count should be 2.");
        Assert.equal(storedFileMetadataCount, 2, "File metadata count should be 2.");
    }
}
