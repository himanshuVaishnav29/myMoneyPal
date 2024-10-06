const transactionTypeDef=`#graphql

    type Transaction{
        _id:ID!
        userId:ID!
        description:String!
        paymentType:String!
        category:String!
        amount:Float!
        location:String!
        date:String!
    }

    type Query{

        getAllTransactionsByUser:[Transaction!]
        getTransaction(transactionId:ID!):Transaction

        getStatsByCategory:[CategoryStatistics!]
        getCurrentWeekStatsByCategory:[CategoryStatistics!]
        getCurrentMonthStatsByCategory:[CategoryStatistics!]

        getStatsByPaymentType:[paymentTypeStatistics!]
        getCurrentWeekStatsByPaymentType:[paymentTypeStatistics!]
        getCurrentMonthStatsByPaymentType:[paymentTypeStatistics!]
    }
    type CategoryStatistics {
        category: String!
        totalAmount: Float!
    }
    type paymentTypeStatistics{
        paymentType:String!
        totalAmount:Float!
    }
    type Mutation{
        createTransaction(input:CreateTransactionInput!):Transaction!
        updateTransaction(input:UpdateTransactionInput!):Transaction!
        deleteTransaction(transactionId:ID!):Transaction!
        userFilterRequest(input:UserFilterRequestInput!):[Transaction!]
        exportCsv(input: [excelFileDownloadInput]!): String
    }

    input CreateTransactionInput{
        description:String!
        paymentType:String!
        category:String!
        amount:Float!
        location:String
        date:String!
    }

    input UpdateTransactionInput{
        transactionId:ID!
        description:String
        paymentType:String
        category:String
        amount:Float
        location:String
        date:String
    }
    input UserFilterRequestInput{
        startDate:String
        endDate:String
        paymentType:String
        category:String
    }
    input excelFileDownloadInput{
        _id:ID!
        description:String!
        paymentType:String!
        category:String!
        amount:Float!
        location:String
        date:String!
    }
`;

export default transactionTypeDef;