Final Project
================

### Deadline: Thu, 16 June 2022, 23:55

Topic
---------
Choose a topic to your liking for your own project. If you have no preference for any topic, you may build on the TU
Wien Beer Bar by either replacing parts and/or extending the existing project. For example, this could be a pub quiz, an
extended beer supply or an extended voting board.

Grading
---------
We consider the following aspects:

- Documentation: Provide the documentation of your project by completing the project details in the README.md on git.
  Add further files as necessary.
- Complexity: The project should be non-trivial. Rather, it should make use of mappings, roles with RBAC, modifiers,
  Ether and tokens when reasonable. Moreover, it should provide a simple web interface for interaction with the
  contract.
- Correctness: The project should use correct math (big numbers, overflow), include test cases and ensure that neither
  any ether nor any tokens are lost.
- Security: Try to avoid that the contract can be depleted by any method used in the challenges.
- Originality: We would like your projects to be distinguishable from reproductions, clones, forgeries, or derivative
  works. On a side note: we've already seen too many casinos.

We place less value on a fancy WebUI, as it is not part of the LVA.

**Your project is complex enough if 40 hours of effort are understandable for us.**

Project Outline 
---------------
### Deadline: Thu, 12 May 2022, 23:55.
Prepare and submit an outline for your chosen topic on TUWEL.
This should be a structured document (2 pages) that contains the following elements:

```
Title:
Short description of functionality:
Off-chain part - frontend design:
On-chain part - planned contracts:
Token concept incl. used standards:
Ether usage:
Roles:
Data structures:
Security considerations:
Used coding patterns in addition to roles (randomness, commitments, timeouts, deposits, or others):
```

Regarding the complexity of your project, please consider as a typical breakdown for your efforts:
- 15h Contract development  
- 5h Contract test cases
- 5h Frontend development  
- 5h Testing and deploying
- 10h Setup of GitLab, Truffle, etc.

Submission and Presentation
---------
Submit your project to your `master` branch on `git.sc.logic.at` and present it in the online review session on Thu, 23
June 2022. Reserve a time slot via TUWEL.

---------------------------

HOWTO
=====
Run `npm install` to install all dependencies.

This repository contains an initialized Truffle project.

Recommended web3.js version: v1.7.1

Truffle
-------
Implement your contracts in the `contracts/` folder. You can compile them with `npm run compile`

Implement your test cases in the `tests/` folder. You can run them with `npm run test`.

With `npm run dev` you can start a local truffle development chain.

You can deploy the project to the LVA-Chain via `npm run truffle deploy -- --network=prod` (requires running `geth`
client). If you use roles, please make us - the person at `addresses.getPublic(94)` - an owner/admin of the contract.

Web interface
-------------
You are free to implement your web interface to your liking. You can use static JavaScript files (similar to the BeerBar
Plain Version) or [Drizzle-React](https://github.com/trufflesuite/drizzle-react) (BeerBar React Version), or any other
suitable framework like [Angular](https://angular.io/)
, [Vue](https://vuejs.org/), [React](https://reactjs.org/).

If you use only static content, put your files into the `public/` folder.  
You can run a local webserver with `npm run start`.

If you use another framework, you will need to adjust the `build` command in `package.json`. Follow the documentation of
your framework for doing so.

The content of your `public/` folder will also be available via the URL <https://final.pages.sc.logic.at/e12140504>
.

---------------------------

Project details
===============
(Please do not change the headers or layout of this section)

Title
-----
The DAO

Addresses
---------

- DAOToken: 0x2A0323E0BBF61fe75F16350111f566996a33A61E
- VotingToken: 0x29B59dC3DD41AC4a8F938C0f3B32aB6A87ee8b0a
- ICO_DAOToken: 0x0D8c3117f6105D4cFE28432c2a1c1120324A8f5c
- Locker: 0xc24BD8627FA5D2D0f7A69926807b9dD63A2c417A
- Voting: 0x229492aBeB95d2b7320E08Bd349fDcF852351C4D

Description
-----------
The project is about creating a DAO (Decentraliced Autonomous Organization). It is
divided in two parts. First the ICO of the DAOs tokens and second the feature requests
and voting platform.
Investors can invest in the DAO by buying tokens at the ICO for the predefined prices.
Then they can lock their tokens and receive new voting tokens. When locking their
tokens, they can choose a certain time how long they want to lock them. For locking
them up longer, they will receive more tokens as a reward when unlocking them. E.g.
for locking them for 366 days, they will receive 100% more tokens when unlocking (This
is implemented to prevent investors from dumping their tokens if there is some
volatility in the crypto market for example.)
With the acquired voting tokens, the investors can suggest feature requests and
company decisions etc. The suggested feature requests can receive votes (yes or no)
as long as the voting is open for that feature request. Feature request that get a
certain amount of votes get implemented by the developers of the DAO afterwards
(not part of the smart contract).

Usage
-----
In the general section you can see information about the tokens and their supply.
In the account section you can see how many tokens the user owns.
In the ico section tokens can be bought to the specified prices. Prices increase as follows:
 - 0-1000 tokens sold: 10 Wei
 - 1001 - 2000 tokens sold: 20 Wei
 - 2001 - 4000 tokens sold: 40 Wei
The ico ends after 4000 tokens have been sold
In the locking section, you can lock up your tokens for a specified amount of time. Depending on how long you lock your tokens, you will get additional dao and voting tokens. For 366 days you will get 100% additional tokens. After the locking time has expired, you can unlock your tokens again. The voting tokens will then get burned and your dao tokens unlocked, which means you can transfer and sell them again.

After you have locked your DAO tokens and received voting tokens, you can propose new features and vote on existing proposals. Please note that you can not vote on your own proposals, because your votes will get couinted towards them automatically during posting the proposal.

Have fun!

Implementation
--------------
Note about minimum locking time: 
Normally the minimum locking time would need to be as long as the voting for the proposals is open to prevent multiple votes from the same person. To showcase that the unlock function is working and to show the full finctionality during the review session, I chose to not set a minumum locking time.

Effort breakdown
------------------
10 hours setup of truffle gitlab etc
20 setup of drizzle and frontend development
20 hours contract development
5 hours test contract cases
10 hours testing and deploying


Difficulties
------------
There were some issues with drizzle. Specifically that drizzlestate does not get updated when doing a cachecall on mappings or view functions, even though I know that the return value has changed. Only a page reload updates the value. Further research showed that this might be related to an issue with drizzle which has not been merged into the master branch. Further details can be found here: https://github.com/trufflesuite/drizzle-legacy/pull/208
In gerneal a short introduction on how to work with a frontend and how to connect it to the blockchain would be great. A PDF with an additional Q&A session would be enough here. I've waisted a lot of time with getting this to work.

Other issues where that I did not exactly know how to structure my contracts in the beginning and how to put them together (e.g inheritance or connect with interfaces, how to handle access control, etc.). I think a short lecture on best practices on this subject would also be a great starting point.

I also had some difficulties figuring out what the best data structure is and how to work with mappings the best way to consume as few gas as possible.

Proposal for future changes
---------------------------
The excercise in an of itself is great. My only critisizm is what I mentioned above, the issues with the frontend development.
Also more information on how to structure the contracts and how to organize data would be great.
Maybe even an additional follow up course on things like IPFS will be found interesting by some students.