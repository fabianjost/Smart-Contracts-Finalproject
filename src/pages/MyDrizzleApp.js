import React from "react";
import DisplayValue from "../components/DisplayValue";

export default class MyDrizzleApp extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state= {
      totalSupplyKey: null,
      DAOTokenContractKey : null,
      stackId: null,
      drizzleState: null,
      balanceKey: null,
      priceKey: null,
    }
  }

  componentDidMount() {
    const { drizzle, drizzleState } = this.props;
    const contract = drizzle.contracts.ICO_DAOToken;
    const totalSupplyKey = contract.methods._totalSupply.cacheCall();
    const DAOTokenContractKey = contract.methods.DAOTokenContract.cacheCall();
    const priceKey = contract.methods.price.cacheCall();
    const tokenContract = this.props.drizzle.contracts.DAOToken;
    const balanceKey = tokenContract.methods.balanceOf.cacheCall(drizzleState.accounts[0], {from: '0x1e579C30Cd42Cb2606287A07c1dDFf36515Ce3F0'});
    this.setState({balanceKey: balanceKey});
    this.setState({DAOTokenContractKey});
    this.setState({totalSupplyKey});
    this.setState({drizzleState});
    this.setState({priceKey});
  }

  componentDidUpdate(prevProps, prevState) {
    const {drizzleState, stackId} = this.props;
    if (prevProps.drizzleState.transactions[drizzleState.transactionStack[stackId]] !== drizzleState.transactions[drizzleState.transactionStack[stackId]]) {
      if (drizzleState.transactions[drizzleState.transactionStack[stackId]]) {
        const txHash = drizzleState.transactionStack[stackId];
        console.log(drizzleState.transactions[txHash]);
        return drizzleState.transactions[txHash];
      }
    }
  }
  
  render() {

    const {drizzle, drizzleState, changeValue } = this.props;

    const { ICO_DAOToken, DAOToken } = drizzleState.contracts;
    const _totalSupply = ICO_DAOToken._totalSupply[this.state.totalSupplyKey];
    const price = ICO_DAOToken.price[this.state.priceKey];

    const DAOTokenContract = ICO_DAOToken.DAOTokenContract[this.state.DAOTokenContractKey];
    const balance = DAOToken.balanceOf[this.state.balanceKey] && DAOToken.balanceOf[this.state.balanceKey].value;
    
    return <DisplayValue 
            address={drizzleState.accounts[0]} 
            value={_totalSupply && _totalSupply.value} 
            changeValue={changeValue}
            drizzle={drizzle}
            drizzleState={drizzleState}
            DAOTokenContract={DAOTokenContract}
            balance={balance}
            price={price && price.value}
          />;
  }
}