// src/components/ConnectWallet.js
import React, { useState, useEffect } from 'react';
import {
  connectWallet,
  disconnectWallet,
  getContractBalance,
  depositToContract,
  getDepositAmount,
  withdrawFromContract,
  getTokenBalance,
} from './contract.js';
import Web3 from 'web3';
const ConnectWallet = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [contractBalance, setContractBalance] = useState("");
  const [myBalance, setMyBalance] = useState("");
  
  useEffect(() => {
    const loadWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setWeb3(web3Instance);
          const accounts = await web3Instance.eth.getAccounts();
          updateContractBalance();
          updateMyBalance();
          setAccount(accounts[0]);
        } catch (error) {
          console.error('Error connecting to wallet:', error);
        }
      } else {
        console.error('No wallet detected');
      }
    };
    loadWeb3();
  }, []);


  const handleMaxButtonClick = async () => {
    try {
      // Ensure that the web3 object is initialized
      if (!web3) {
        console.error('Web3 not initialized');
        return;
      }
  
      // Ensure that the account variable is a valid Ethereum address
      const isValidAddress = web3.utils.isAddress(account);
  
      if (!isValidAddress) {
        console.error('Invalid Ethereum address:', account);
        return;
      }
  
      const myTokenBal = await getTokenBalance(account);
      setAmount(myTokenBal);
    } catch (error) {
      console.error('Error updating balance:', error);
    }
    
  };

  const handleDepositButtonClick = async () => {
    try {
      await depositToContract(amount);
      // You might want to refresh the UI or show a success message here
    } catch (error) {
      console.error('Error depositing to contract:', error);
      // Handle error, show an error message, etc.
    }
  };

  const handleGetwithdraw = async () => {
    try {
      await withdrawFromContract(amount);
      // You might want to refresh the UI or show the balance in your app
    } catch (error) {
      console.error('Error getting contract balance:', error);
      // Handle error, show an error message, etc.
    }
  };
  const updateContractBalance = async () => {
    const balance = await getContractBalance();
    setContractBalance(balance);
  };
  const updateMyBalance = async () => {
    try {
      // Ensure that the web3 object is initialized
      if (!web3) {
        console.error('Web3 not initialized');
        return;
      }
  
      // Ensure that the account variable is a valid Ethereum address
      const isValidAddress = web3.utils.isAddress(account);
  
      if (!isValidAddress) {
        console.error('Invalid Ethereum address:', account);
        return;
      }
  
      const mywalletBal = await getDepositAmount(account);
      setMyBalance(mywalletBal);
    } catch (error) {
      console.error('Error updating balance:', error);
    }
  }
  console.log();
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Deposit Form</h2>
        <div className="mb-4">
          
          
          
          <label htmlFor="amount" className="block text-gray-700 text-sm font-bold mb-2">
            Amount
          </label>
          <p className='text-black'>Total Deposited {contractBalance} Deelance</p>
          <p className='text-black'>You deposited {myBalance} deelance</p>
          <input
            type="number"
            id="amount"
            className="w-full text-black p-2 border rounded focus:outline-none focus:border-blue-500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2 mb-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded focus:outline-none"
            onClick={handleMaxButtonClick}
          >
            Max
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded focus:outline-none"
            onClick={handleDepositButtonClick}
          >
            Deposit
          </button>
          <button
            className="bg-red-500 text-white text-sm px-4 py-2 rounded focus:outline-none"
            onClick={handleGetwithdraw}
          >
            Withdraw-OwnerOnly
          </button>
          
        </div>
        {web3 ? (
          <p className='text-black'>Connected to wallet. Account: {account}</p>
        ) : (
          <p>Connect your wallet to proceed</p>
        )}
       
      </div>
    </div>
  );
};

export default ConnectWallet;
