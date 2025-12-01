import { gql } from "@apollo/client";

export const GET_AUTHETICATED_USER=gql`
    query GetAuthenticatedUser{
        authUser{
            _id
            email
            fullName
            gender
            profilePicture
            timezone
        }
    }
`;