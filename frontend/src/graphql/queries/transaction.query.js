import { gql } from "@apollo/client";

export const GET_TRANSACTIONS_BY_USER=gql`
    query GetTransactionsByUser{
        getAllTransactionsByUser{
            _id
            userId
            description
            paymentType
            category
            amount
            location
            date
        }
    }
`;

export const GET_TRANSACTION=gql`
    query GetTransaction($id:ID!){
        getTransaction(transactionId:$id){
            _id
            description
            paymentType
            category
            amount
            location
            date
        }
    }
`;

export const GET_STATS_BY_CATEGORY=gql`
    query GetStatsByCategory{
        getStatsByCategory{
            category
            totalAmount
        }
    }
`;
