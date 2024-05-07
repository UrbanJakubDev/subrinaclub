import { ITransaction } from "@/interfaces/interfaces";

/**
 * Calculates the sum of positive points in an array of transactions.
 * 
 * @param transactions - An array of transactions.
 * @returns The sum of positive points in the transactions.
 */
export const sumPosPointsInTransactions = (transactions: ITransaction[]) => {
    let sum = 0;
    transactions.forEach((transaction: ITransaction) => {
       // Sum points if greater than 0
       if (transaction.amount > 0) {
          sum += transaction.amount;
       }
    });
    return sum;
 };

/**
 * Calculates the sum of negative points in an array of transactions.
 *
 * @param transactions - An array of transactions.
 * @returns The sum of negative points in the transactions.
 */
export const sumNegPointsInTransactions = (transactions: ITransaction[]) => {
    let sum = 0;
    transactions.forEach((transaction: ITransaction) => {
       // Sum points if less than 0
       if (transaction.amount < 0) {
          sum += transaction.amount;
       }
    });
    return sum;
 };

/**
 * Calculates the balance in an array of transactions.
 *
 * @param transactions - An array of transactions.
 * @returns The balance in the transactions.
 */
export const balanceInTransactions = (transactions: ITransaction[]) => {
    let sum = 0;
    transactions.forEach((transaction: ITransaction) => {
       // Sum all points
       sum += transaction.amount;
    });
    return sum;
 }


 