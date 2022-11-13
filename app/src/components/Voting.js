import React from "react";
import Moment from 'react-moment';

export default class Voting extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state= {
      data: "Your proposal...",
      stackId : null,
    }
  }

  componentDidUpdate(prevProps) {
    const {drizzleState} = this.props;
    if (prevProps.drizzleState.transactions[drizzleState.transactionStack[this.state.stackId]] !== drizzleState.transactions[drizzleState.transactionStack[this.state.stackId]]) {
      if (drizzleState.transactions[drizzleState.transactionStack[this.state.stackId]]) {
        const txHash = drizzleState.transactionStack[this.state.stackId];
        console.log(drizzleState.transactions[txHash].status);
        return drizzleState.transactions[txHash];
      }
    }

  }

  propose = (_data) => {
    if (this.state.data.length !== 0) {
      const contract = this.props.drizzle.contracts.Voting;
      const stackId = contract.methods.propose.cacheSend(_data, {from: this.props.user, gas:'300000'});
      this.setState({stackId: stackId});
    }
  };

  vote = (_uuid) => {
    const contract = this.props.drizzle.contracts.Voting;
    const stackId = contract.methods.vote.cacheSend(_uuid, {from: this.props.user, gas: '300000'});
    this.setState({stackId:stackId});
    console.log(_uuid);
  }

  handleKeyPress = e => {
    if (e.key === "Enter") {
      this.propose(this.state.data);
    }
  };

  render() {    

    return (
      <>
        <div id='block'>
            <h2>Voting</h2>
            <div id='block'>
                <h3>Propose</h3>
                <p style={{display: "inline-block", marginRight: "10px"}}>Proposal:</p>
                <input
                style={{marginRight: "10px", maxWidth: 100}}
                value={this.state.data}
                onChange={e => {
                    this.setState({data: e.target.value});
                }}
                onKeyPress={this.handleKeyPress}
                />
                <button
                onClick={() => {
                    this.propose(this.state.data);
                }}
                >
                Propose
                </button>
            </div>
            <div>
                <h3 style={{marginTop: 20}}>Proposals:</h3>
                {this.props.proposals.map((item, index) => {
                    return (
                        <div id='block' key={index}>
                            <p style={{fontWeight: 600, marginTop: 0}}>{item.data}</p>
                            <p>Author: {item.author}</p>
                            <p>Date: <Moment unix>{item.time}</Moment></p>
                            <p>Votes: {item.votes}</p>
                            <button onClick={() => this.vote(this.props.allProposals[index])}>
                                Vote
                            </button>
                        </div>
                )})}
            </div>
        </div>
      </>);
  }
}