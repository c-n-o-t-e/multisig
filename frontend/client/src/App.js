import React, { useEffect, useState } from 'react';
import Multisig from './contracts/Multisig.json';
import { getWeb3 } from './utils.js';

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [quorum, setQuorum] = useState(undefined);
  const [transfers, setTransfers] = useState([]);
  const [approvers, setApprovers] = useState([]);
  const [ids, setIds] = useState(undefined);
  const [approval, setApproval] = useState(undefined);
  

  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Multisig.networks[networkId];
      const contract = new web3.eth.Contract(
        Multisig.abi,
        deployedNetwork && deployedNetwork.address,
      );
      const quorum = await contract.methods
        .quorum()
        .call();

      setWeb3(web3);
      setAccounts(accounts);
      setContract(contract);
      setQuorum(quorum);
    }
    init();
    window.ethereum.on('accountsChanged', accounts => {
      setAccounts(accounts);
    });
  }, []);

  useEffect((e) => {
    if(typeof contract !== 'undefined' && typeof web3 !== 'undefined') {
      updateBalance();
      idds();
      approvals();

     
      
      
      
    }
  }, [accounts, contract, web3]);

  async function updateBalance() {
    const balance = await web3.eth.getBalance(contract.options.address);
    setBalance(balance);
  }

  async function createTransfer(e) {
    e.preventDefault();
    const amount = e.target.elements[0].value;
    const to = e.target.elements[1].value;
    await contract.methods
      .createTransfer(amount, to)
      .send({from: accounts[0]});
   await idds();
   await approvals();
  };

  async function sendTransfer(e) {
     e.preventDefault();
    const iid = e.target.elements[0].value;
    await contract.methods
      .sendTransfer(iid)
      .send({from: accounts[0]});
    await updateBalance();
    await approvals();
  };


  async function tranferss(e) {
    e.preventDefault();
    const iid = e.target.elements[0].value;
   const trans =  await contract.methods.transfers(iid)
    .call();
    setTransfers(trans);
  }

  async function approverss(e) {
    e.preventDefault();
    const id = e.target.elements[0].value;
    const appro = await contract.methods.approvers(id)
    .call();
    setApprovers(appro); 
  } 

  async function approvals() {
   const id = (await contract.methods.nextId()
    .call()) - 1;
   const appra = await contract.methods.approvals(accounts[0], id)
    .call();
    setApproval(appra);
  }

  async function idds() {
    const id = (await contract.methods.nextId()
    .call()) - 1;
    setIds(id); 
  } 


  if (!web3) {
    return <div>Loading...</div>;
  }

  return (

       <div className="container">
       <h1 className="text-center">Multisig</h1>

       
            <p>Balance: <b>{balance}</b> wei </p>
            <p>Contract Created: <b>{ids}</b></p>
        

              <div className='poy'>
             <div ><h2 className='p'>Create transfer</h2></div>
             <div ><h2 className='t'>Send transfer</h2></div></div>
             <div className='pos'>
             <form className='pot' onSubmit={e => createTransfer(e)}>
               <div>
                 <label htmlFor="amount">Amount</label>
                 <input type="number" />
               </div>
               <div>
                 <label>To</label>
                 <input type="text"   />
                  <input type="submit" value ='Submit'/>              
               </div>
               </form>
           <div>

              
               <form className='pot' onSubmit={e => sendTransfer(e)}>
                 <div>
                   <label htmlFor="number">Id</label>
                   <input type="number" />
                                 
                 </div>
                 

           {approval ? (
                <p> Already approved</p>
                ) : (
                     <input type="submit" value ='Submit'/> 
                )
              } 

              </form>
                 </div>
           </div>

           
              <h2>Transfer Info</h2>
              <div className='pos'>
              
               <form onSubmit={e => tranferss(e)}>
                 <div>
                   <label htmlFor="number">Id</label>
                   <input type="number"/>
                     <input type="submit" value ='Submit'/> 

                 </div></form>       
           </div>
            <p> id: {transfers.id} </p>
            <p> amount: {transfers.amount} </p>
            <p> to: {transfers.to} </p>
            <p> approvals: {transfers.approvals} </p>
            <p> sent: {transfers.sent} </p>
    
            
            
         </div>
  );
}

export default App;
