import React from "react";
import { Drizzle, generateStore } from "@drizzle/store";
import { DrizzleContext } from "@drizzle/react-plugin";
import MyDrizzleApp from "./pages/MyDrizzleApp";
import { drizzleOptions } from "./utils/config"
import "./App.css";

const options = drizzleOptions;
const drizzleStore = generateStore(options);
const drizzle = new Drizzle(options, drizzleStore);

const App = () => {

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
              <MyDrizzleApp drizzle={drizzle} drizzleState={drizzleState} />
            </>);
        }}
      </DrizzleContext.Consumer>
    </DrizzleContext.Provider>
  );
}

export default App;
