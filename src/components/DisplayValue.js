import React from "react";

export default class DisplayValue extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state= {
      DAOTokenContractKey: null,
      addr: 0x0,
      val: 3,
      stackId: null,
      balanceKey : null,
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {drizzleState} = this.props;
    if (prevProps.drizzleState.transactions[drizzleState.transactionStack[this.state.stackId]] !== drizzleState.transactions[drizzleState.transactionStack[this.state.stackId]]) {
      if (drizzleState.transactions[drizzleState.transactionStack[this.state.stackId]]) {
        const txHash = drizzleState.transactionStack[this.state.stackId];
        console.log(drizzleState.transactions[txHash]);
        return drizzleState.transactions[txHash];
      }
    }
  }

  buyToken = (_value) => {
    if (this.state.val.length !== 0) {
      // Do something with value
      const contract = this.props.drizzle.contracts.ICO_DAOToken;
      const stackId = contract.methods.buy.cacheSend({from: '0x1e579C30Cd42Cb2606287A07c1dDFf36515Ce3F0', value: _value, gas:'300000'});
      this.setState({stackId: stackId});
    }
  };

  handleKeyPress = e => {
    if (e.key === "Enter") {
      this.buyToken(this.state.val);
    }
  };

  updateBalance = () => {
    window.location.reload(false);
  }


  render() {
    return (<>
        <h1>Total DAO Token supply: {this.props.value}</h1>
        <p>This is your address: {this.props.address}</p>
        <div>
          <p style={{display: "inline-block", marginRight: "10px"}}>This is the DAO Token: {this.props.DAOTokenContract && this.props.DAOTokenContract.value}</p>
        </div>
        <div>
          <p style={{display: "inline-block", marginRight: "10px"}} >This is your balance: {this.props.balance}</p>
          <button
            onClick={() => {
              this.updateBalance();
            }}
          >
            Update Balance
          </button>
        </div>
        
        <div>
          <p style={{display: "inline-block", marginRight: "10px"}}>Current token price: {this.props.price}</p>
        </div>
        <div>
          <p style={{display: "inline-block", marginRight: "10px"}}>Buy tokens:</p>
          <input
              value={this.state.val}
              onChange={e => {
                this.setState({val: e.target.value});
              }}
              onKeyPress={this.handleKeyPress}
          />
          <button
            onClick={() => {
              this.buyToken(this.state.val);
            }}
          >
            Buy
          </button>
        </div>
      </>);
  }
}