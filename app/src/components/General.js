import React from "react";

export default class General extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state= {
      DAOTokenContractKey: null,
      votingTokenContractKey: null,
    }
  }

  componentDidMount() {
    const { drizzle } = this.props;
    const icoContract = drizzle.contracts.ICO_DAOToken;
    const lockerContract = drizzle.contracts.Locker;

    const DAOTokenContractKey = icoContract.methods.DAOTokenContract.cacheCall();
    const votingTokenContractKey = lockerContract.methods.VotingTokenContract.cacheCall();

    this.setState({DAOTokenContractKey});
    this.setState({votingTokenContractKey});
  }

  render() {

    const { drizzleState } = this.props;    

    const { ICO_DAOToken, Locker } = drizzleState.contracts;

    const DAOTokenContractObj = ICO_DAOToken.DAOTokenContract[this.state.DAOTokenContractKey];
    const DAOTokenContract = DAOTokenContractObj && DAOTokenContractObj.value

    const VotingTokenContractObj = Locker.VotingTokenContract[this.state.votingTokenContractKey];
    const VotingTokenContract = VotingTokenContractObj && VotingTokenContractObj.value

    return (<>
        <div id='block'>
          <h2>General Token Information</h2>
          <div id='block'>
            <h3>DAO Token</h3>
            <p>Address: <span id='balance'>{DAOTokenContract}</span></p>
            <p>Total supply: <span id='balance'>{this.props.daoTokenSupply}</span></p>
          </div>
          <div id='block'>
            <h3>Voting Token</h3>
            <p>This is the Voting Token: <span id='balance'>{VotingTokenContract}</span></p>
            <p>Total Voting Token supply: <span id='balance'>{this.props.votingTokenSupply}</span></p>
          </div>
        </div>
      </>);
  }
}