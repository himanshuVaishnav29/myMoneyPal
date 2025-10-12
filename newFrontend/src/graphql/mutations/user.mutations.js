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

export const UPDATE_PROFILE = gql`
    mutation UpdateProfile($input: UpdateProfileInput!) {
        updateProfile(input: $input) {
            _id
            email
            fullName
            profilePicture
            gender
        }
    }
`;

export const REQUEST_PASSWORD_RESET = gql`
    mutation RequestPasswordReset($email: String!) {
        requestPasswordReset(email: $email) {
            message
            success
        }
    }
`;

export const VERIFY_OTP_AND_RESET_PASSWORD = gql`
    mutation VerifyOTPAndResetPassword($input: ResetPasswordInput!) {
        verifyOTPAndResetPassword(input: $input) {
            _id
            email
            fullName
        }
    }
`;

export const UPLOAD_PROFILE_IMAGE = gql`
    mutation UploadProfileImage($file: Upload!) {
        uploadProfileImage(file: $file) {
            url
            message
        }
    }
`;