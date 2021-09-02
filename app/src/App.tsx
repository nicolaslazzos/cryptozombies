import React from "react";

import { Web3Provider } from "./web3";

const App: React.FC = () => {
  return (
    <Web3Provider>
      <div></div>
    </Web3Provider>
  );
};

export default App;
