import React from "react";

export default class Locker extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state= {
      amount: 1,
      seconds: 366,
      unlockAmount: 0,
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

  lockToken = (_amount, seconds) => {
    if (this.state.amount.length !== 0) {
      const contract = this.props.drizzle.contracts.Locker;
      //const seconds = _days * 86400;
      const stackId = contract.methods.lock.cacheSend(_amount, seconds, {from: this.props.user, gas:'300000'});
      this.setState({stackId: stackId});
    }
  };

  unlockToken = (_amount) => {
    if (this.state.unlockAmount.length !== 0) {
      const contract = this.props.drizzle.contracts.Locker;
      const stackId = contract.methods.unlock.cacheSend(_amount, {from: this.props.user, gas:'300000'});
      this.setState({stackId: stackId});
    }
  }

  handleKeyPressLock = e => {
    if (e.key === "Enter") {
      this.lockToken(this.state.amount, this.state.seconds);
    }
  };

  handleKeyPressUnlock = e => {
    if (e.key === "Enter") {
      this.unlockToken(this.state.unlockAmount);
    }
  };

  render() {

    return (
      <>
        <div id='block'>
          <h2>Locker</h2>
          <div style={{display: 'flex', gap: 20, marginTop: 0}}>
            <p>Locked tokens: <span id='balance'>{this.props.frozenBalance}</span></p>
            <p>Lockable tokens: <span id='balance'>{this.props.lockableAmount}</span></p>
            <p>Unlockable tokens: <span id='balance'>{this.props.unlockableAmount}</span></p>  
          </div>
          <div id='block'>
            <h3>Lock</h3>
            <p style={{display: "inline-block", marginRight: "10px"}}>Amount:</p>
            <input
              style={{marginRight: "10px", maxWidth: 100}}
              value={this.state.amount}
              onChange={e => {
                this.setState({amount: e.target.value});
              }}
              onKeyPress={this.handleKeyPressLock}
            />
            <p style={{display: "inline-block", marginRight: "10px"}}>Seconds:</p>
            <input
              style={{marginRight: "10px", maxWidth: 100}}
              value={this.state.seconds}
              onChange={e => {
                this.setState({seconds: e.target.value});
              }}
              onKeyPress={this.handleKeyPressLock}
            />
            <button
              onClick={() => {
                this.lockToken(this.state.amount, this.state.seconds);
              }}
            >
              Lock
            </button>
          </div>
          
          <div id='block'>
            <h3>Unlock</h3>
            <p style={{display: "inline-block", marginRight: "10px"}}>Amount:</p>
            <input
              style={{marginRight: "10px", maxWidth: 100}}
              value={this.state.unlockAmount}
              onChange={e => {
                this.setState({unlockAmount: e.target.value});
              }}
              onKeyPress={this.handleKeyPressUnlock}
            />
            <button
              onClick={() => {
                this.unlockToken(this.state.unlockAmount);
              }}
            >
              Unlock
            </button>
          </div>
        </div>
      </>);
  }
}