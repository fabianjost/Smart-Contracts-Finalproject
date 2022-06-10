import React, { useState } from "react";
import { Drizzle, generateStore } from "@drizzle/store";
import { DrizzleContext } from "@drizzle/react-plugin";
import MyDrizzleApp from "./pages/MyDrizzleApp";
import { drizzleOptions } from "./utils/config"
import "./App.css";

const options = drizzleOptions;
const drizzleStore = generateStore(options);
const drizzle = new Drizzle(options, drizzleStore);

const App = () => {
  const [stackId, setStackId] = useState()

  const changeValue = (_value) => {
    const contract = drizzle.contracts.ICO_DAOToken;
    const stackId = contract.methods.buy.cacheSend({from: '0x1e579C30Cd42Cb2606287A07c1dDFf36515Ce3F0', value: _value});
    setStackId(stackId);
  }

  return (
    <DrizzleContext.Provider drizzle={drizzle}>
      <DrizzleContext.Consumer>
        {drizzleContext => {
          const { drizzle, drizzleState, initialized } = drizzleContext;

          if (!initialized) {
            return <h1>Loading...</h1>
          }

          return (
            <>
              <MyDrizzleApp drizzle={drizzle} drizzleState={drizzleState} changeValue={changeValue} stackId={stackId} />
            </>);
        }}
      </DrizzleContext.Consumer>
    </DrizzleContext.Provider>
  );
}

export default App;
