// ContractInteraction.js
import Web3 from 'web3';
import DepositContractABI from './contract/compile/depositContract.json'; // Import your contract ABI
import erc20TokenABI from './contract/compile/mockErc20.json';
const contractAddress = "0xEaF84229217E799a56019ee0218a9aC390E5E07D"; // Replace with your actual contract address
let web3;
let contract;
const erc20TokenAddress = "0x19FAf7c9F153B6dD70D9E366B960dA102696A3E0";
let erc20TokenContract;

const initWeb3 = async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.enable();
    } catch (error) {
      console.error('Error connecting to wallet:', error);
    }
  } else {
    console.error('No wallet detected');
  }

  if (web3) {
    contract = new web3.eth.Contract(DepositContractABI, contractAddress);
    erc20TokenContract = new web3.eth.Contract(erc20TokenABI, erc20TokenAddress);
  }
};

const getAccount = async () => {
  const accounts = await web3.eth.getAccounts();
  return accounts[0];
};

const connectWallet = async () => {
  await initWeb3();
  return getAccount();
};

const disconnectWallet = () => {
  web3 = null;
  contract = null;
};

const depositToContract = async (amount) => {
  try {
    await initWeb3();
    const account = await getAccount();

    // Ensure the contract has been approved to spend the user's tokens
    const allowance = await erc20TokenContract.methods.allowance(account, contractAddress).call();
    if (allowance < amount) {
      await erc20TokenContract.methods.approve(contractAddress, web3.utils.toWei('1000000000', 'ether')).send({ from: account });
    }

    // Transfer ERC20 tokens from the user to the contract
    await contract.methods.deposit(web3.utils.toWei(amount.toString(), 'ether')).send({ from: account });

    console.log(`Deposited ${amount} tokens into the contract`);
  } catch (error) {
    console.error('Error depositing to contract:', error);
    throw error;
  }

};

const getContractBalance = async () => {
  await initWeb3();
  const balance = await contract.methods.getTotalDepositedAmount().call();
  return web3.utils.fromWei(balance, 'ether');
  console.log(`Contract balance: ${web3.utils.fromWei(balance, 'ether')} tokens`);
};


const withdrawFromContract = async (amount) => {
  try {
    await initWeb3();
    const account = await getAccount();

    // Withdraw tokens from the contract
    await contract.methods.withdraw(web3.utils.toWei(amount.toString(), 'ether')).send({ from: account });

    console.log(`Withdrawn ${amount} tokens from the contract`);
  } catch (error) {
    console.error('Error withdrawing from contract:', error);
    throw error;
  }
};

const getDepositAmount = async (depositor) => {
  await initWeb3();
  const amount = await contract.methods.getDepositedAmount(depositor).call();
  return web3.utils.fromWei(amount, 'ether');
  console.log(`${depositor}'s deposited amount: ${web3.utils.fromWei(amount, 'ether')} tokens`);
};

const getAllDepositors = async () => {
  const depositors = await contract.methods.getAllDepositors().call();
  console.log('List of depositors:', depositors);
};

const getTokenBalance = async (addressToCheck) => {
  try {
    const tokenContract = new web3.eth.Contract(erc20TokenABI, erc20TokenAddress);
    
    // Get the balance of the address in tokens
    const balance = await tokenContract.methods.balanceOf(addressToCheck).call();
    return balance;
  } catch (error) {
    throw new Error(`Error retrieving token balance: ${error.message}`);
  }
};

export {
  connectWallet,
  disconnectWallet,
  getContractBalance,
  depositToContract,
  withdrawFromContract,
  getDepositAmount,
  getAllDepositors,
  getTokenBalance,
};
