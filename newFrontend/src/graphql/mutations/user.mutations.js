import { gql } from "@apollo/client";

export const SIGN_UP=gql`
    mutation SignUp($input:SignUpInput!){
        signUp(input:$input){
            email
            fullName
            password
            gender
        }
    }
`;

export const LOGIN=gql`
    mutation Login($input:LogInInput!){
        login(input:$input){
           email
           password
        }
    }
`;

export const LOGOUT=gql`
    mutation Logout {
		logout {
			message
		}
	}
`;