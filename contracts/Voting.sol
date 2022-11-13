// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./VotingToken.sol";

/** 
  *@title Voting contract to suggest features and vote on which should get implemented
*/

contract Voting is AccessControl{

    bytes32 public constant ADMIN = keccak256("ADMIN");              //Handles critical operations like setting the votin time
    bytes32 public constant MAINTAINER = keccak256("MAINTAINER");    //Maintains the proposals and sets them accepted or done

    VotingToken public VotingTokenContract;
    struct Proposal {
        uint256 time;
        address author;
        uint256 votes;
        string data;
    }
    mapping(bytes32 => Proposal) proposals;
    Proposal[] public accepted;
    Proposal[] public done;
    bytes32[] public proposalUuids;
    mapping(address => mapping(bytes32 => bool)) voted;
    uint256 votingTime = 1209600;
    event Vote(address _address, bytes32 uuid);
    event Unvote(address _address, bytes32 uuid);
    event Propose(address _address, bytes32 uuid);
    event Accepted(bytes32 uuid);
    event Done(bytes32 uuid);
    event ChangeVotingTime(uint256 _votingTime);

    constructor(address VotingTokenAddress, address admin, address maintainer) payable {
      VotingTokenContract = VotingToken(VotingTokenAddress);
      _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
      _setupRole(ADMIN, admin);
      _setupRole(MAINTAINER, maintainer);
    }

    function propose(string memory data) public returns (bytes32 uuid) {
        require(VotingTokenContract.balanceOf(msg.sender) != 0, "Buy some voting tokens first!");
        require(bytes(data).length <= 40, "Message too long!");
        uuid = keccak256(abi.encodePacked(msg.sender, data));
        require(proposals[uuid].time == 0, "Has already been proposed!");
        Proposal memory proposal = Proposal(block.timestamp, msg.sender, VotingTokenContract.balanceOf(msg.sender), data);
        proposals[uuid] = proposal;
        voted[msg.sender][uuid] = true;
        proposalUuids.push(uuid);
        emit Propose(msg.sender, uuid);
        return uuid;
    }

    function getAllProposals() public view returns (bytes32[] memory) {
        return proposalUuids;
    }

    function getProposal(bytes32 uuid) public view returns (Proposal memory proposal) {
        proposal = proposals[uuid];
        //require(proposal.time != 0, "This proposal does not exist!"); 
        return proposal;
    }

    function vote(bytes32 uuid) public returns (bool) {
        require(votingEnd(uuid) > block.timestamp, "Voting for this proposal is over!");
        uint256 tokenBalance = VotingTokenContract.balanceOf(msg.sender);
        require(tokenBalance != 0, "Buy some voting tokens first!");
        require(voted[msg.sender][uuid] != true, "Your already voted!");
        proposals[uuid].votes = SafeMath.add(proposals[uuid].votes, tokenBalance);
        voted[msg.sender][uuid] = true;
        emit Vote(msg.sender, uuid);
        return true;
    }

    function unvote(bytes32 uuid) public returns (bool) {
        require(votingEnd(uuid) < block.timestamp, "Voting for this proposal is over!");
        uint256 tokenBalance = VotingTokenContract.balanceOf(msg.sender);
        require(tokenBalance != 0, "Buy some voting tokens first!");
        require(voted[msg.sender][uuid] == true, "You did not vote for this proposal!");
        proposals[uuid].votes = SafeMath.sub(proposals[uuid].votes, tokenBalance);
        voted[msg.sender][uuid] = true;
        emit Unvote(msg.sender, uuid);
        return true;
    }

    function votingEnd(bytes32 uuid) public view returns (uint256) {
        return SafeMath.add(proposals[uuid].time, votingTime);
    }

    function changeVotingTime(uint256 _votingTime) public onlyRole(ADMIN) {
        votingTime = _votingTime;
        emit ChangeVotingTime(_votingTime);
    }
    
    function setAccepted(bytes32 uuid) public onlyRole(MAINTAINER) {
        require(votingEnd(uuid) > block.timestamp, "Voting not over yet!");
        accepted.push(proposals[uuid]);
        emit Accepted(uuid);
    }

    function getAccepted() public view returns (Proposal[] memory) {
        return accepted;
    }

    function setDone(bytes32 uuid) public onlyRole(MAINTAINER) {
        require(votingEnd(uuid) > block.timestamp, "Voting not over yet!");
        done.push(proposals[uuid]);
        emit Done(uuid);
    }

    function getDone() public view returns (Proposal[] memory) {
        return done;
    }
}