# Design Patterns

Listed below are some of the design pattern decisions I've made.

## Circuit Breaker :boom:
In the event of an issue, the contract owner has the ability to disable adding new files to the smart contract via the `setCanAddFile` function. This effectively switches the contract to a read-only state which could prove useful in the event of a frontend bug injecting invalid data into the contract. Once resolved, the owner can re-enable file uploads using the same function. This will also prove useful during contract upgrades (once upgradable contracts are implemented prior to mainnet release).

## Mortal :fire:
In the event of a catastrophic meltdown, the contract owner can issue a `selfdestruct` call to the smart contract via the `kill` function. This will deposit any remaining funds into the contract owner's address (which can only be eth sent directly to the address prior to contract deployment as the fallback function reverts any `payable` transactions sent to the contract) and destroy the contract. **WARNING: This is an unrecoverable operation. Use at your own risk!**

## Access Controls :no_entry:
Proper access controls have been put in place to prevent just anybody from executing the above safeguards. OpenZeppelin provides a [suite of widely-used and audited utility contracts](https://github.com/OpenZeppelin/openzeppelin-solidity) to help standardize common implementation patterns and drastically reduce future vulnerabilities. `FileStorage` inherits the [`Ownable`](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/ownership/Ownable.sol) contract in order to restrict access to sensitive functions. Some examples can be found by searching for functions that implement Ownable's `onlyOwner` modifier.

## Fail Early & Loud :exclamation:
Even though you have a certain amount of control around how your UI interacts with a smart contract, the censorship resistant nature of the blockchain means that anyone can interact with it. This means you have little control over what data is sent to your contract. Adding some basic `require` checks (like checking for null values) allows you to revert the transaction without injecting invalid data.

---

Here are some of the design patterns I opted to forego and the reasoning behind those decisions.

## Auto Deprecation :bomb:
This is useful if you require part (or all) of your contract functionality to alter at a future date. One example is a voting contract that 'closes' the poll at a specific time. Another more extreme example is to force a `selfdestruct` call after a specific amount of time has passed since deployment; this could be used during a beta test in order to guarantee all users switch to the most recent contract. I decided against auto deprecation as I'm not conducting a beta test.

## Withdrawal :money_with_wings:
All contracts are susceptible to attacks but contracts that deal with money are much more so due to the inherent incentives. Reentrancy attacks and DoS attacks on contract withdrawal logic have notoriously been used to drain wallets of their funds. There are many ways to help prevent this from happening; one example is to isolate the withdrawal logic from the balance calculation logic and require users to 'pull' out their tokens (vs. 'push'ing to all users at once from within the contract) ([example](https://gist.github.com/critesjosh/80d41928db2310684bc7660aa45873da)). Since `FileStorage` doesn't deal with withdrawls there is little reason to apply this pattern.

## State Machine :atm:
A state machine can deterministically decide the outcome of an operation given the current state. An example of this is a voting contract that only allows voters to submit votes while the poll is open and prevents each voter from being counted until they reveal their vote. `FileStorage` doesn't know (or care) about state outside of the file information it contains; a state machine would be overcomplicated in addition to unneccesarily introducing potential attack vectors.

## Speed Bump :construction:
Speed bumps provide a user-defined delay between calling a function and executing it. While this is a critical feature to have when dealing with money (see [The DAO hack](http://hackingdistributed.com/2016/06/18/analysis-of-the-dao-exploit)), there is little use for it in `FileStorage`.
