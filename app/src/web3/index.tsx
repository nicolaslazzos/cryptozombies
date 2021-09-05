import React from "react";
import Web3 from "web3";

export type Web3Type = any;

export interface Web3ContextProps {
  web3: Web3Type;
  contracts: { [name: string]: any };
  address: string;
}

export interface Web3ProviderProps {
  onReady?: (ctx: Web3ContextProps) => void;
  onAddressChange?: (ctx: Web3ContextProps) => void;
}

const defaultContext: Web3ContextProps = { web3: null, contracts: {}, address: "" };

const Web3Context = React.createContext<Web3ContextProps>(defaultContext);

export const useWeb3 = () => React.useContext(Web3Context);

export const Web3Provider: React.FC<Web3ProviderProps> = (props) => {
  const [context, setContext] = React.useState<Web3ContextProps>(defaultContext);

  React.useEffect(() => {
    window.addEventListener("load", async () => {
      // @ts-ignore
      if (window?.web3) {
        // use the injected provider (mist / metamask)

        // @ts-ignore
        const web3js: any = new Web3(window.web3.currentProvider);

        // @ts-ignore
        if (window?.ethereum) {
          // @ts-ignore
          await window.ethereum.enable();
        }

        setContext((prev) => ({ ...prev, web3: web3js, address: web3js.eth.accounts?.[0] ?? "" }));

        console.info("Web3 provider initialized!");
      } else {
        setContext((prev) => ({ ...prev, web3: null, address: "" }));

        alert("You need to install MetaMask!");
      }
    });
  }, []);

  React.useEffect(() => {
    if (!context.web3) return;

    const accountInterval = setInterval(() => {
      context.web3.eth.getAccounts((error: Error, accounts: any[]) => {
        if (error) {
          console.error(error);
        } else {
          setContext((prev) => ({ ...prev, address: accounts?.[0] ?? "" }));
        }
      });
    }, 1000);

    props?.onReady?.(context);

    return () => clearInterval(accountInterval);
  }, [context.web3]);

  React.useEffect(() => {
    props?.onAddressChange?.(context);
  }, [context.address]);

  return <Web3Context.Provider value={context}>{!!context.web3 && props.children}</Web3Context.Provider>;
};
