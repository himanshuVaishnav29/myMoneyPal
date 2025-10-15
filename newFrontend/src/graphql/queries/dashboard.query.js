import { gql } from '@apollo/client';

export const GET_DASHBOARD_SUMMARY = gql`
    query GetDashboardSummary {
        getDashboardSummary {
            totalExpenses
            totalSavings
            totalInvestment
            recentTransactions {
                _id
                description
                paymentType
                category
                amount
                date
                tag
            }
            tagStats {
                tag
                totalAmount
            }
        }
    }
`;