import React from "react";

import { useWeb3 } from "./web3";
import { cryptozombies } from "./contracts";

const App: React.FC = () => {
  const { web3, address } = useWeb3();

  const [contract, setContract] = React.useState<any>();
  const [zombies, setZombies] = React.useState<any[]>([]);

  const [createForm, setCreateForm] = React.useState({ name: "", loading: false });
  const [feedForm, setFeedForm] = React.useState({ zombieId: "", victimId: "", loading: false });
  const [levelUpForm, setLevelUpForm] = React.useState({ zombieId: "", loading: false });

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

  const changeCreateFormValue = (e: any) => {
    setCreateForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const createZombie = () => {
    const { name } = createForm;

    if (!name) return;

    setCreateForm((prev) => ({ ...prev, loading: true }));

    return contract.methods
      .createRandomZombie(name)
      .send({ from: address })
      .on("receipt", () => {
        updateOwnerZombies();

        setCreateForm((prev) => ({ ...prev, loading: false }));
      })
      .on("error", (error: Error) => {
        console.error(error);

        setCreateForm((prev) => ({ ...prev, loading: false }));
      });
  };

  const changeFeedFormValue = (e: any) => {
    setFeedForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const feedOnKitty = () => {
    const { zombieId, victimId } = feedForm;

    if (!zombieId || !victimId) return;

    setFeedForm((prev) => ({ ...prev, loading: true }));

    return contract.methods
      .feedOnKitty(zombieId, victimId)
      .send({ from: address })
      .on("receipt", () => {
        updateOwnerZombies();

        setFeedForm((prev) => ({ ...prev, loading: false }));
      })
      .on("error", (error: Error) => {
        console.error(error);

        setFeedForm((prev) => ({ ...prev, loading: false }));
      });
  };

  const changeLevelUpFormValue = (e: any) => {
    setLevelUpForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const levelUp = () => {
    const { zombieId } = levelUpForm;

    if (!zombieId) return;

    setLevelUpForm((prev) => ({ ...prev, loading: true }));

    contract.methods
      .levelUp(zombieId)
      .send({ from: address, value: web3.utils.toWei("0.001", "ether") })
      .on("receipt", () => {
        updateOwnerZombies();

        setLevelUpForm((prev) => ({ ...prev, loading: false }));
      })
      .on("error", (error: Error) => {
        console.error(error);

        setLevelUpForm((prev) => ({ ...prev, loading: false }));
      });
  };

  return (
    <div>
      <h4>Create Zombie</h4>
      <input
        type="text"
        name="name"
        placeholder="Zombie Name"
        value={createForm.name}
        onChange={changeCreateFormValue}
      />
      <button onClick={createZombie}>{createForm.loading ? "Creating..." : "Create Zombie"}</button>
      <br />
      <h4>Feed Zombie</h4>
      <input
        type="number"
        name="zombieId"
        placeholder="Zombie ID"
        value={feedForm.zombieId}
        onChange={changeFeedFormValue}
      />
      <input
        type="number"
        name="victimId"
        placeholder="Victim ID"
        value={feedForm.victimId}
        onChange={changeFeedFormValue}
      />
      <button onClick={feedOnKitty}>{feedForm.loading ? "Feeding..." : "Feed Zombie"}</button>
      <br />
      <h4>Level Up Zombie</h4>
      <input
        type="number"
        name="zombieId"
        placeholder="Zombie ID"
        value={levelUpForm.zombieId}
        onChange={changeLevelUpFormValue}
      />
      <button onClick={levelUp}>{levelUpForm.loading ? "Leveling Up..." : "Level Up Zombie"}</button>
      <br />
      {zombies.map((z: any) => {
        return `${JSON.stringify(z)}\n`;
      })}
    </div>
  );
};

export default App;
