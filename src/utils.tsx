export const convertToDatetime = (timestamp: string) => {
  const date = new Date(parseInt(timestamp)*1000).toLocaleDateString("en-US")
  const time = new Date(parseInt(timestamp)*1000).toLocaleTimeString("en-US")
  return [date, time]
}

export const formatTransaction = (transaction: any, walletAdress: string) => {
  transaction.isBuy = transaction.to && (walletAdress === transaction.from)
  transaction.transactionBuddy = transaction.isBuy ? transaction.to : transaction.from
  const [date, time] = convertToDatetime(transaction.timeStamp)
  transaction.date = date
  transaction.time = time
  return transaction
}

export const sortBy = (a: any, b: any, sortAsc: boolean, headerSort: string) => {
  const asc = sortAsc ? 1 : -1
  switch (headerSort) {
    case "date":
      return asc*(new Date(a[headerSort]).getTime() - new Date(b[headerSort]).getTime())
    case "time":
      return asc*(new Date(`01-01-2020 ${a[headerSort]}`).getTime() - new Date(`01-01-2020 ${b[headerSort]}`).getTime())
    default:
      return asc*(a[headerSort] - b[headerSort])
  }
}