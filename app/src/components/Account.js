import React from "react";

export default class Account extends React.PureComponent {

  render() {
    return (<>
        <div id='block'>
          <h2>Your Account</h2>
          <p>Address: <span id='balance'>{this.props.user}</span></p>
          <p>DAO token balance: <span id='balance'>{this.props.daoTokenBalance}</span></p>
          <p>Locked DAO tokens: <span id='balance'>{this.props.frozenBalance}</span></p>
          <p>Voting token balance: <span id='balance'>{this.props.votingTokenBalance}</span></p>
        </div>
      </>);
  }
}