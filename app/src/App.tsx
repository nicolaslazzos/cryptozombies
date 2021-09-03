import React from "react";

import { useWeb3 } from "./web3";
import { cryptozombies } from "./contracts";

const App: React.FC = () => {
  const { web3, address } = useWeb3();

  const [contract, setContract] = React.useState<any>();
  const [zombies, setZombies] = React.useState<any[]>([]);

  React.useEffect(() => {
    initializeContract();
  }, []);

  React.useEffect(() => {
    updateOwnerZombies();
  }, [address]);

  const initializeContract = async () => {
    try {
      const contract = new web3.eth.Contract(cryptozombies.abi, cryptozombies.address);

      setContract(contract);
    } catch (e) {
      console.error(e);
    }
  };

  const getZombieDetails = async (id: number) => {
    return contract?.methods.zombies(id).call();
  };

  const getZombieOwner = async (id: number) => {
    return contract?.methods.zombieToOwner(id).call();
  };

  const getZombiesByOwner = async (owner: string) => {
    return contract?.methods.getZombiesByOwner(owner).call();
  };

  const updateOwnerZombies = async () => {
    try {
      const ids = await getZombiesByOwner(address);

      let zombies: any[] = [];

      if (!!ids?.length) {
        zombies = await Promise.all(ids.map((id: number) => getZombieDetails(id)));
      }

      setZombies(zombies);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      {zombies.map((z: any) => {
        return `${JSON.stringify(z)}\n`;
      })}
    </div>
  );
};

export default App;
