/**
 * Use this file to configure your truffle project.
 *
 * More information about configuration can be found at:
 *
 * trufflesuite.com/docs/advanced/configuration
 */

const path = require("path");

module.exports = {
  compilers: {
    solc: {
      version: '^0.8.0',
    }
  },

  // TODO - Here you can specify the output directory for the compiled ABIs
  contracts_build_directory: path.join(__dirname, "app/src/abi"), // FRONTEND

  /**
   * Networks define how you connect to your ethereum client. If you don't specify one, truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   *
   * See <http://truffleframework.com/docs/advanced/configuration>
   * for more details on how to specify configuration options!
   */

  networks: {
    // development: {
    //   host: "127.0.0.1",
    //   port: 7545,
    //   network_id: "*"
    // },
    // test: {
    //   host: "127.0.0.1",
    //   port: 7545,
    //   network_id: "*"
    // },
    prod: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "19010311"
    }
  }

};

