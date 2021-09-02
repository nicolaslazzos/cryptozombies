import React from "react";
import Web3 from "web3";

const Web3Context = React.createContext<Web3 | null>(null);

export const Web3Provider: React.FC = (props) => {
  const [web3, setWeb3] = React.useState<Web3 | null>(null);

  React.useEffect(() => {
    window.addEventListener("load", function () {
      // @ts-ignore
      if (window?.web3) {
        // user the injected provider (mist / metamask)
        // @ts-ignore
        const web3js = new Web3(window.web3.currentProvider);

        setWeb3(web3js);
      } else {
        this.alert("You need to install MetaMask!");
      }
    });
  }, []);

  return <Web3Context.Provider value={web3}>{props.children}</Web3Context.Provider>;
};
