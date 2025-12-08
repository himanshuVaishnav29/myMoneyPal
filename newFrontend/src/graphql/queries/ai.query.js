import { gql } from '@apollo/client';

export const GET_AI_RECOMMENDATIONS = gql`
  query GetAIRecommendations($forceRefresh: Boolean) {
    getAIRecommendations(forceRefresh: $forceRefresh) {
      headline
      mood
      sarcastic_tips
      unusual_spending_alerts
      currentMonthTotal
      lastMonthTotal
      difference
      transactionCount
      isRateLimited
      hoursRemaining
    }
  }
`;
