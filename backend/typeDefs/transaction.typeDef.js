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
        tag:String!
    }

    type Query{

        getAllTransactionsByUser:[Transaction!]
        getTransactionsByUserPaginated(page:Int, limit:Int):TransactionPaginatedResponse!
        getDashboardSummary:DashboardSummary!
        getTransaction(transactionId:ID!):Transaction

        getStatsByCategory:[CategoryStatistics!]
        getCurrentWeekStatsByCategory:[CategoryStatistics!]
        getCurrentMonthStatsByCategory:[CategoryStatistics!]

        getStatsByPaymentType:[paymentTypeStatistics!]
        getCurrentWeekStatsByPaymentType:[paymentTypeStatistics!]
        getCurrentMonthStatsByPaymentType:[paymentTypeStatistics!]

        getStatsByTag:[tagStatistics!]
        getCurrentWeekStatsByTag:[tagStatistics!]
        getCurrentMonthStatsByTag:[tagStatistics!]
        
        getAIRecommendations(forceRefresh:Boolean):AIRecommendations!

    }
    type CategoryStatistics {
        category: String!
        totalAmount: Float!
    }
    type paymentTypeStatistics{
        paymentType:String!
        totalAmount:Float!
    }
    type tagStatistics{
        tag:String!
        totalAmount:Float!
    }
    type TransactionPaginatedResponse{
        transactions:[Transaction!]!
        totalCount:Int!
        currentPage:Int!
        totalPages:Int!
        hasNextPage:Boolean!
        hasPrevPage:Boolean!
    }
    
    type DashboardSummary{
        totalExpenses:Float!
        totalSavings:Float!
        totalInvestment:Float!
        recentTransactions:[Transaction!]!
        tagStats:[TagStat!]!
    }
    
    type TagStat{
        tag:String!
        totalAmount:Float!
    }
    
    type AIRecommendations{
        headline:String!
        mood:String!
        sarcastic_tips:[String!]!
        unusual_spending_alerts:[String!]!
        currentMonthTotal:Float!
        lastMonthTotal:Float!
        difference:Float!
        transactionCount:Int!
        isRateLimited:Boolean
        hoursRemaining:Int
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
        tag:String!
    }

    input UpdateTransactionInput{
        transactionId:ID!
        description:String
        paymentType:String
        category:String
        amount:Float
        location:String
        date:String
        tag:String
    }
    input UserFilterRequestInput{
        startDate:String
        endDate:String
        paymentType:String
        category:String
        tag:String
    }
    input excelFileDownloadInput{
        _id:ID!
        description:String!
        paymentType:String!
        category:String!
        amount:Float!
        location:String
        date:String!
        tag:String!
    }
`;

export default transactionTypeDef;