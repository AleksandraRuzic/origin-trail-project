import React from 'react';
import { EHeader } from '../../customTypes';
import { ITableState, ITableProps } from '../../customTypes';
import { sortBy } from '../../utils';
import Transaction from '../Transaction/Transaction';

class Table extends React.Component<ITableProps, ITableState> {
  state: ITableState = {
    sortAsc: true,
    headerSort: EHeader.date,
  }

  sortByColumn = (str: string) => {
    this.state.headerSort === str ? this.setState({sortAsc: !this.state.sortAsc}) : this.setState({headerSort : str as EHeader, sortAsc: true});
  }


  render() {
    return (<table>
    <tr>
      <th onClick = {() => this.sortByColumn("date")}>Date</th>
      <th onClick = {() => this.sortByColumn("time")}>Time</th>
      <th onClick = {() => this.sortByColumn("blockNumber")}>Block number</th>
      <th onClick = {() => this.sortByColumn("transactionBuddy")}>Transaction buddy</th>
      <th onClick = {() => this.sortByColumn("value")}>Quantity</th>
    </tr>
    {this.props.transactions.sort((a, b) => sortBy(a, b, this.state.sortAsc, this.state.headerSort)).map(transaction => <Transaction transactionDetails={transaction} walletAdress={this.props.walletAdress}/>)}
  </table>);}
}

export default Table;
