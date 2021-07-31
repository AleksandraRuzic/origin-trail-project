import React from 'react';
import axios from 'axios'
import Table from '../Table/Table';
import {IProps, IState, ERenderIndicator} from '../../customTypes'
import { formatTransaction } from '../../utils';
import {database} from '../../database/config'

class Main extends React.Component<IProps, IState> {
  state: IState = {
    transactions: [],
    balance: "",
    walletAdress: "",
    selectedWalletAdress: "",
    startBlock: "0",
    date: "",
    renderIndicator: ERenderIndicator.blanc,
    errorMsg: ""
  }

  changeWalletAdress = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({walletAdress: e.currentTarget.value})
  }

  changeDate = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({date: e.currentTarget.value})
  }

  changeStartBlock = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({startBlock: e.currentTarget.value})
  }

  chooseOption(str : string) {
    this.setState({renderIndicator: str as ERenderIndicator})
  }

  takeDataFromApiAndPutToDb = (callback : (params:any) => any) => {
    database.ref('wallets').child(this.state.walletAdress).once('value', (snapshot) => {
      const dataFromDb = snapshot.val();
      var maxNumberBlock = dataFromDb ? Number(dataFromDb.maxBlockNumber) : 0;
      axios.get(
        `https://api.etherscan.io/api?module=account&action=txlist&address=${this.state.walletAdress}&startblock=${maxNumberBlock}&sort=desc&apikey=B6RZUVP8CMD8PAKN78VZRND32AT5YS2TN9`
      ).then(res => {
        this.setState({selectedWalletAdress: this.state.walletAdress});
       // Error
        if(res.data.status === "0" && res.data.results !== []) {
          this.setState({renderIndicator : ERenderIndicator.error, errorMsg: res.data.result}) 
        }
        else {
          const dataFromApi = res.data.result.map((x: any) => formatTransaction(x, this.state.walletAdress));
          var transactionsRes = dataFromApi;
          if(dataFromApi.length > 0) {
            maxNumberBlock = Math.max.apply(Math, transactionsRes.map((o: any) => { return Number(o.blockNumber) }));
            database.ref(`wallets/${this.state.walletAdress}/maxBlockNumber`).set(maxNumberBlock);

            dataFromApi.forEach((transaction: any) => {
              database.ref(`wallets/${this.state.walletAdress}/transactions/${transaction.timeStamp}`).set(transaction);
            });

            if(dataFromDb) {
              const transactionsFromDb = Object.values(dataFromDb.transactions);
              transactionsRes = transactionsFromDb.concat(dataFromApi);
            }
          }
          callback(transactionsRes);            
        }
      });
  });
}

  clickStartingBlock = () => {
//    database.ref('wallets').remove()
    this.takeDataFromApiAndPutToDb((transactionsRes : any) => {
      const retVal = transactionsRes.filter((x: any) => Number(x.blockNumber) >= Number(this.state.startBlock));
      this.setState({renderIndicator : ERenderIndicator.table,
                    transactions: retVal}) ;
    });
  }
  
  clickBalanceForDate = () => {
    const date = Date.parse(this.state.date)/1000
    date ?  this.takeDataFromApiAndPutToDb((transactionsRes) => {
              const data = transactionsRes.filter((transaction : any) => Number(transaction.timeStamp) <= date)
                                          .map((x : any) => x.isBuy? -Number(x.value) : Number(x.value));
              const balance = data.reduce((prev : any, curr : any) => prev+curr);
              this.setState({renderIndicator: ERenderIndicator.balance, balance: balance});
            }) :
            this.setState({renderIndicator : ERenderIndicator.error, errorMsg: "Invalid date!"});
    // date ? axios.get(
    //   `https://api.etherscan.io/api?module=account&action=txlist&address=${this.state.walletAdress}&sort=asc&apikey=B6RZUVP8CMD8PAKN78VZRND32AT5YS2TN9`
    // ).then(res => {
    //   this.setState({selectedWalletAdress: this.state.walletAdress});
    //   res.data.status === "0" ? this.setState({renderIndicator : ERenderIndicator.error, errorMsg: res.data.result}) 
    //                           : this.setState({transactions: res.data.result.map((x: any) => formatTransaction(x, this.state.walletAdress))})
    // //  I don't have a pro API usage plan so I can't use the adequate call
    // //  const wantedBlock = this.state.transactions
    // //                                 .filter(transaction => (Number(transaction.timeStamp) <= Date.parse(this.state.date)/1000))
    // //                                 .reduce((prev, current) => (prev.timeStamp > current.timeStamp) ? prev : current)
    // //                                 .blockNumber
    //   axios.get(
    //  //  `https://api.etherscan.io/api?module=account&action=balancehistory&address=${this.state.selectedWalletAdress}&blockno=${wantedBlock}&apikey=B6RZUVP8CMD8PAKN78VZRND32AT5YS2TN9`
    // `https://api.etherscan.io/api?module=account&action=balance&address=${this.state.walletAdress}&tag=latest&apikey=B6RZUVP8CMD8PAKN78VZRND32AT5YS2TN9`
    //    ).then(res => {
    //     res.data.status === "0" ? this.setState({renderIndicator : ERenderIndicator.error, errorMsg: res.data.result}) 
    //                             : this.setState({renderIndicator: ERenderIndicator.balance, balance: res.data.result});
    //   })
    // }) : this.setState({renderIndicator : ERenderIndicator.error, errorMsg: "Invalid date!"})
  }


  renderOption() {
    switch (this.state.renderIndicator) {
      case ERenderIndicator.blanc:
        return <p></p>
      case ERenderIndicator.inputForDate:
        return <div>
          <input type="text" onChange={this.changeDate}/>
          <button type="button" onClick={this.clickBalanceForDate}>Balance on date c:</button>
        </div>
      case ERenderIndicator.inputForStartingBlock:
        return <div>
          <input type="text" onChange={this.changeStartBlock}/>
          <button type="button" onClick={this.clickStartingBlock}>Transaction after starting block c:</button>
        </div>
      case ERenderIndicator.table:
        return <Table transactions={this.state.transactions} walletAdress={this.state.selectedWalletAdress}/>
      case ERenderIndicator.error:
          return (<div><p>No data for specified input!</p> <p>{this.state.errorMsg}</p></div>)
      case ERenderIndicator.balance:
        return (<p>Your balance for given date {this.state.date} is {this.state.balance}</p>)
   }
  }


  render() {
    return (<div>
      <label>Info for wallet</label>
      <input type="text" onChange={this.changeWalletAdress}/>

      <p>What do you want to see? c:</p>
      <div>
        <input type="radio" name="option" checked= {this.state.renderIndicator === ERenderIndicator.inputForStartingBlock} onChange={x => this.chooseOption("inputForStartingBlock")}/>
        <label>Transactions from a given start block</label>
      </div>
      <div>
        <input type="radio" name="option" checked= {this.state.renderIndicator === ERenderIndicator.inputForDate} onChange={x => this.chooseOption("inputForDate")}/>
        <label>Balance on a given date</label>
      </div>
      {this.renderOption()}
    </div>)
  }
}

export default Main;
