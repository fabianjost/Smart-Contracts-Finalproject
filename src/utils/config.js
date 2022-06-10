import Web3 from "web3";
import DAOToken from "../abi/DAOToken.json";
import ICO_DAOToken from "../abi/ICO_DAOToken.json";

// const web3CustomProvider = "ws://localhost:8546"; // LVA Chain
const web3CustomProvider = "ws://localhost:9545"; // Local truffle development chain
export const web3 = new Web3(web3CustomProvider);

export const getDAOToken = (address) => {
  return new web3.eth.Contract(DAOToken.abi, address);
};

export const getICO_DAOToken = (address) => {
  return new web3.eth.Contract(ICO_DAOToken.abi, address);
};

export const drizzleOptions = {
  web3: {
    block: false,
    customProvider: web3,
  },
  polls: {
    blocks: 3000
  },
  contracts: [DAOToken, ICO_DAOToken],
  events: {
    DAOToken: ["Transfer"],
  },
};

// NOTE: The interface type of `generateStore` is wrong. The functions attribute name for the reducers is `appReducers` NOT `reducers`.
// export const store = generateStore({
//   drizzleOptions,
//   appReducers: reducers,
//   appSagas: sagas,
//   disableReduxDevTools: false, // enable ReduxDevTools!
// });
