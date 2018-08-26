pragma solidity ^0.4.24;

/**
 * @title Proxy contract for `require` & `assert` validation
 */
contract ModifierProxy {
    // Test contract address
    address public target;

    // Caller data
    bytes data;

    /**
     * @dev Initialize proxy and assign test contract address
     */
    constructor(address _target) public {
        target = _target;
    }

    /**
     * @dev Call test contract with caller data
     */
    function execute() public returns (bool) {
        return target.call(data);
    }
    
    /**
     * @dev Fallback function assigns caller data
     */
    function() public {
        data = msg.data;
    }
}
