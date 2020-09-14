/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/**
 * Sample transaction processor function.
 * @param {org.network.co.Transfer} Transfer - The Transfer transaction instance.
 * @transaction
 */


async function Transfer(Transfer){
    ns='org.network.co';
    const factory=getFactory();
    const fromAccount=Transfer.fromAccount;
  	const toAccount=Transfer.toAccount;
  	if(fromAccount.balance<Transfer.amount)
    {
      throw new Error('Insufficient Funds');
    }

    fromAccount.balance-=Transfer.amount;
    toAccount.balance+=Transfer.amount;
    const accountRegistry = await getAssetRegistry(ns+'.Account');
    const fromUser = fromAccount.user;
    const fromBank = fromAccount.bank;
    const toUser = toAccount.user;
    const toBank = toAccount.bank;
    var r = Math.floor(Math.random()*1000)+1000;
    let txn = factory.newResource(ns,'Txn',fromUser.userId+toUser.userId+r);
    txn.fromAccount=fromAccount;
    txn.toAccount=toAccount;
    txn.amount=Transfer.amount;
  	if(fromBank==toBank)
    {
      fromBank.txns.push(txn);
    }
  	else
    {
    fromBank.txns.push(txn);
    toBank.txns.push(txn);
  	}
  	if(fromUser==toUser)
    {  
    toUser.txns.push(txn);
    }
  	else
    {
    fromUser.txns.push(txn);
    toUser.txns.push(txn);
  	}
   
 	const txnRegistry = await getAssetRegistry(ns+'.Txn');
    const userRegistry = await getParticipantRegistry(ns+'.User');
    const bankRegistry = await getParticipantRegistry(ns+'.Bank');
    await userRegistry.update(fromUser);
    await accountRegistry.update(fromAccount);
    await accountRegistry.update(toAccount);
    await userRegistry.update(toUser);
    await bankRegistry.update(fromBank);
    await bankRegistry.update(toBank);
  	await txnRegistry.add(txn);
    
}

/**
 * Sample transaction processor function.
 * @param {org.network.co.CreateAccount} CreateAccount - Creating an Account.
 * @transaction
 */

async function CreateAccount(CreateAccount){
    ns='org.network.co';
    const factory=getFactory();
    const user=CreateAccount.user;
  	const bank=CreateAccount.bank;
  
    var r = Math.floor(Math.random()*1000)+1000;
    let account = factory.newResource(ns,'Account',user.userId+bank.bankId+r);
  	account.balance=CreateAccount.amount;
  	account.bank=bank
    account.user=user
  	user.accounts.push(account);
  	bank.accounts.push(account);
   
    const userRegistry = await getParticipantRegistry(ns+'.User');
  	const accountRegistry = await getAssetRegistry(ns+'.Account');
    const bankRegistry = await getParticipantRegistry(ns+'.Bank');
    await userRegistry.update(user);
    await bankRegistry.update(bank);
  	await accountRegistry.add(account);
  	
 

}
