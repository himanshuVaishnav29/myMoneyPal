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
            tag
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
            tag
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

export const GET_CURRENT_WEEK_STATS_BY_CATEGORY=gql`
    query GetCurrentWeekStatsByCategory{
        getCurrentWeekStatsByCategory{
            category
            totalAmount
        }
    }
`;

export const GET_CURRENT_MONTH_STATS_BY_CATEGORY=gql`
    query GetCurrentMonthStatsByCategory{
        getCurrentMonthStatsByCategory{
            category
            totalAmount
        }
    }
`;


export const GET_STATS_BY_PAYMENT_TYPE=gql`
    query GetStatsByPaymentType{
        getStatsByPaymentType{
            paymentType
            totalAmount
        }
    }
`;

export const GET_CURRENT_WEEK_STATS_BY_PAYMENT_TYPE=gql`
    query GetCurrentWeekStatsByPaymentType{
        getCurrentWeekStatsByPaymentType{
            paymentType
            totalAmount
        }
    }
`;

export const GET_CURRENT_MONTH_STATS_BY_PAYMENT_TYPE=gql`
    query GetCurrentMonthStatsByPaymentType{
        getCurrentMonthStatsByPaymentType{
            paymentType
            totalAmount
        }
    }
`;


export const GET_STATS_BY_TAG=gql`
    query GetStatsByTag{
        getStatsByTag{
            tag
            totalAmount
        }
    }
`;


export const GET_CURRENT_WEEK_STATS_BY_TAG=gql`
    query GetCurrentWeekStatsByTag{
        getCurrentWeekStatsByTag{
            tag
            totalAmount
        }
    }
`;

export const GET_CURRENT_MONTH_STATS_BY_TAG=gql`
    query GetCurrentMonthStatsByTag{
        getCurrentMonthStatsByTag{
            tag
            totalAmount
        }
    }
`;