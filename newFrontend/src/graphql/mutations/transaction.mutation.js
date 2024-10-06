import {gql} from "@apollo/client";

export const CREATE_TRANSACTION=gql`
    mutation CreateTransaction($input:CreateTransactionInput!){
        createTransaction(input:$input){
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


export const UPDATE_TRANSACTION = gql`
	mutation UpdateTransaction($input: UpdateTransactionInput!) {
		updateTransaction(input: $input) {
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

export const DELETE_TRANSACTION=gql`
    mutation DeleteTransaction($transactionId: ID!){
        deleteTransaction(transactionId: $transactionId){
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

export const USER_FILTER_REQUEST=gql`
	mutation UserFilterRequest($input: UserFilterRequestInput!){
		userFilterRequest(input:$input){
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



export const EXPORT_AS_CSV = gql`
  mutation ExportAsCsv($input: [excelFileDownloadInput]!) {
    exportCsv(input: $input)
  }
`;