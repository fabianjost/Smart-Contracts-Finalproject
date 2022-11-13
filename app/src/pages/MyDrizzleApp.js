import React from "react";
import DisplayValue from "../components/DisplayValue";
import Account from "../components/Account";
import General from "../components/General"
import Locker from "../components/Locker";
import Voting from "../components/Voting";
import "../components/Layout.css"

export default class MyDrizzleApp extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state= {
      val: this.props.drizzleState.accounts[0],
      user: this.props.drizzleState.accounts[0],
      daoTokenBalance: null,
      votingTokenBalance: null,
      daoTokenSupply: null,
      votingTokenSupply: null,
      frozenBalance: null,
      unlockableAmount: null,
      allProposals: null,
      proposals: [],
    }
  }

  storeInformation () {
    const { drizzle } = this.props;
    const  { DAOToken, VotingToken, Locker, Voting } = drizzle.contracts;
    const user = this.state.val;
    DAOToken.methods.balanceOf(user).call({from: user}).then((data) => {
      this.setState({daoTokenBalance: data});
    });
    DAOToken.methods.totalSupply().call({from: user}).then((data) => {
      this.setState({daoTokenSupply: data});
    });
    DAOToken.methods.frozenBalanceOf(user).call({from: user}).then((data) => {
      this.setState({frozenBalance: data});
    });
    VotingToken.methods.balanceOf(user).call({from: user}).then((data) => {
      this.setState({votingTokenBalance: data});
    });
    VotingToken.methods.totalSupply().call({from: user}).then((data) => {
      this.setState({votingTokenSupply: data});
    });
    Locker.methods.unlockedAmount(user).call({from: user}).then((data) => {
      this.setState({unlockableAmount: data});
    });
    Voting.methods.getAllProposals().call({from:user}).then((data) => {
      this.setState({allProposals: data})
    });
    if (this.state.allProposals != null) {
      let proposals = [];
      this.state.allProposals.map((key, index) => (
        Voting.methods.getProposal(this.state.allProposals[index]).call({from:user}).then((data) => {
          proposals = [...proposals, data];
          this.setState({proposals: proposals});
        })
      ))
    }
  }

  componentDidMount () {
    this.storeInformation();
    const { drizzle } = this.props;
    const icoContract = drizzle.contracts.ICO_DAOToken;
    const DAOTokenContractKey = icoContract.methods.DAOTokenContract.cacheCall();
    this.setState({DAOTokenContractKey});
  }

  componentDidUpdate (prevProps) {
    if (prevProps.drizzleState !== this.props.drizzleState) {
      this.storeInformation();
    }
  }

  handleKeyPress = e => {
    if (e.key === "Enter") {
      this.setState(this.state.val);
    }
  };
  
  render() {

    const {drizzle, drizzleState } = this.props;

    return (
      <>
        <div style={{marginBottom: '5%', marginRight: '2%', marginLeft: '2%'}} >
          <div>
            <h1 style={{textAlign: 'center'}} >Welcome to the DAO</h1>
            <div>
              <p style={{display: "inline-block", marginRight: "10px"}}>Set user address:</p>
              <input
                  value={this.state.val}
                  onChange={e => {this.setState({val: e.target.value});}}
                  onKeyPress={this.handleKeyPress}
              />
              <button onClick={() => {this.handleKeyPress(this.state.val);}}>
                Set
              </button>
            </div>
          </div>
          <div id='container'>
            <General
              drizzle={drizzle}
              drizzleState={drizzleState}
              daoTokenSupply={this.state.daoTokenSupply}
              votingTokenSupply={this.state.votingTokenSupply}
            />
            <Account
              user={this.state.val}
              daoTokenBalance={this.state.daoTokenBalance}
              frozenBalance={this.state.frozenBalance}
              votingTokenBalance={this.state.votingTokenBalance}
            />
          </div>
          <div id='container'>
            <DisplayValue
              user={this.state.val}
              drizzle={drizzle}
              drizzleState={drizzleState}
              daoTokenBalance={this.state.daoTokenBalance}
            />
            <Locker
              drizzle={drizzle}
              drizzleState={drizzleState}
              user={this.state.val}
              lockableAmount={this.state.daoTokenBalance - this.state.frozenBalance}
              frozenBalance={this.state.frozenBalance}
              unlockableAmount={this.state.unlockableAmount}
            />
            <Voting
              drizzle={drizzle}
              drizzleState={drizzleState}
              proposals={this.state.proposals}
              allProposals={this.state.allProposals}
              user={this.state.val}
            />
          </div>
        </div>
      </>
    )
  }
}