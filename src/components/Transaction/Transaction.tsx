import React from 'react';
import { ITransactionProps } from '../../customTypes';

const Transaction = (props: ITransactionProps) => {
  return (<tr>
    <td>{props.transactionDetails.date}</td>
    <td>{props.transactionDetails.time}</td>
    <td>{props.transactionDetails.blockNumber}</td>
    <td>{props.transactionDetails.transactionBuddy}</td>
    <td className={props.transactionDetails.isBuy ? "buy" : "sell"}>{props.transactionDetails.value}</td>
  </tr>)
}

export default Transaction;
