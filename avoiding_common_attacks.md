# Safety Checklist

## Logic Bugs
Catching bugs prior to launch is understandably the most important and most difficult part of software development; this significance is amplified with smart contract development as code is immutably published to the blockchain. Because of this, catching bugs as quickly as possible is of the utmost importance. Proper test coverage plays a critical role when building new features and providing confidence when changes are made to existing features.

As an example, the current version of Solidity (`0.4.24` as of this writing) supports a limited number of return types and dynamically-sized byte arrays are not included. In order to return an array of file hashes for display in the webapp, I had to split up the file hash into two 32-byte objects: one for the first two bytes (which include the hash function and hash size) and one for the true 32-byte file hash. This requires some manual bit shifting - which can be a bit precarious - but current test coverage helps ensure I'm alerted if anything breaks.

Additionally, automated testing tools like TravisCI (which runs on every commit to this repo) provide extra assurances that code is performing as expected.

## Reentrancy Attack
This contract makes no calls to external contracts, thus preventing a reentrancy from occurring.

## Cross-function Race Conditions
There is only one instance of cross-function calling in which a public function calls an internal pure function to perform byte packing. A cross-function attack is not possible since it is both internal (inaccessible outside of this contract) and pure (stateless).

## Frontrunning / Timestamp Dependence
This contract has no opinion on _which_ block the transaction is confirmed, only that it is confirmed in _any_ block.

## Integer Overflow/Underflow
Libraries like OpenZeppelin's [`SafeMath`](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/math/SafeMath.sol) contract help prevent integer overflows/underflows in contracts. Although this contract doesn't make use of maths, I would recommend using `SafeMath` as it has been widely adopted and audited by the community.

## DoS Attack
A DoS attack typically occurs when a call to an external contract (for example, sending Ether from a contract to an address) fails and causes unexpected results. This is the primary reason pull vs. push is recommended when dealing with money. This contract is immune to a DoS attack as it makes no calls to external contracts.

## Forcibly Sending Ether to a Contract
Due to *1) the lack of money logic in this contract* and *2) the way `revert` is implemented* the only way for this contract address to contain Ether is by precomputing the address and sending Ether ahead of contract deployment. Even in the unlikely event of this happening, there is no logic in this contract that relies on Ether balance.

## Exposure
All contract functions include access controls in the definition in order to be as explicit as possible about which ones should be exposed to the public.
