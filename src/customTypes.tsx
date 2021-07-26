export enum ERenderIndicator {
  blanc = "blanc",
  table = "table",
  balance = "balance",
  error = "error",
  inputForDate = "inputForDate" ,
  inputForStartingBlock = "inputForStartingBlock"
}
export enum EHeader {
  date = "date",
  time = "time",
  blockNumber = "blockNumber",
  transactionBuddy = "transactionBuddy",
  value = "value"
}
export interface IProps {}
export interface ITransactionProps {
  transactionDetails: any,
  walletAdress: string
}
export interface IState {
  transactions: [any] | [],
  balance: string,
  walletAdress: string,
  selectedWalletAdress: string,
  startBlock: string,
  date: string,
  renderIndicator: ERenderIndicator,
  errorMsg: string
}

export interface ITableProps {
  transactions: [any] | [],
  walletAdress: string
}
export interface ITableState {
  sortAsc: boolean,
  headerSort: EHeader
}