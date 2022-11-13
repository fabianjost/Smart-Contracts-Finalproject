import React from "react";

export default class DisplayValue extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state= {
      DAOTokenContractKey: null,
      addr: 0x0,
      val: 3,
      stackId: null,
      totalSupplyKey: null,
      totalTokenSupplyKey: null,
      priceKey: null,
      blance: null,
    }
  }

  componentDidMount() {
    const { drizzle } = this.props;
    const contract = drizzle.contracts.ICO_DAOToken;
    const totalSupplyKey = contract.methods._totalSupply.cacheCall();
    const DAOTokenContractKey = contract.methods.DAOTokenContract.cacheCall();
    const priceKey = contract.methods.price.cacheCall();
    const tokenContract = drizzle.contracts.DAOToken;
    const totalTokenSupplyKey = tokenContract.methods.totalSupply.cacheCall();
    this.setState({DAOTokenContractKey});
    this.setState({totalSupplyKey});
    this.setState({totalTokenSupplyKey: totalTokenSupplyKey});
    this.setState({priceKey});
  }

  componentDidUpdate(prevProps, prevState) {
    const {drizzleState} = this.props;
    if (prevProps.drizzleState.transactions[drizzleState.transactionStack[this.state.stackId]] !== drizzleState.transactions[drizzleState.transactionStack[this.state.stackId]]) {
      if (drizzleState.transactions[drizzleState.transactionStack[this.state.stackId]]) {
        const txHash = drizzleState.transactionStack[this.state.stackId];
        console.log(drizzleState.transactions[txHash].status);
        return drizzleState.transactions[txHash];
      }
    }
  }

  buyToken = (_tokens) => {
    if (this.state.val.length !== 0) {
      const price = this.props.drizzleState.contracts.ICO_DAOToken.price[this.state.priceKey].value;
      const _value = _tokens * price;
      const contract = this.props.drizzle.contracts.ICO_DAOToken;
      const stackId = contract.methods.buy.cacheSend({from: this.props.user, value: _value, gas:'300000'});
      this.setState({stackId: stackId});
    }
  };

  handleKeyPressBuy = e => {
    if (e.key === "Enter") {
      this.buyToken(this.state.val);
    }
  };

  render() {

    const {drizzleState } = this.props;

    const { ICO_DAOToken } = drizzleState.contracts;
    const _totalSupply = ICO_DAOToken._totalSupply[this.state.totalSupplyKey];
    const price = ICO_DAOToken.price[this.state.priceKey];

    return (<>
        <div id='block'>
          <h2>ICO</h2>
          <p>Total ICO Tokens minted: <span id='balance'>{_totalSupply && _totalSupply.value}</span></p>        
          <div>
            <p style={{display: "inline-block", marginRight: "10px"}}>Current token price: <span id='balance'>{price && price.value} Wei</span></p>
          </div>
          <div>
            <p style={{display: "inline-block", marginRight: "10px"}}>Buy tokens:</p>
            <input
                value={this.state.val}
                onChange={e => {
                  this.setState({val: e.target.value});
                }}
                onKeyPress={this.handleKeyPressBuy}
            />
            <button
              onClick={() => {
                this.buyToken(this.state.val);
              }}
            >
              Buy
            </button>
          </div>
        </div>
      </>);
  }
}