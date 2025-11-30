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
           token
           user{
               _id
               email
               fullName
               profilePicture
               gender
           }
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
    mutation RequestPasswordReset($email: String!, $timezone: String) {
        requestPasswordReset(email: $email, timezone: $timezone) {
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

export const SEND_SIGNUP_OTP = gql`
    mutation SendSignupOTP($input: SignUpInput!) {
        sendSignupOTP(input: $input) {
            message
            success
        }
    }
`;

export const VERIFY_SIGNUP_OTP = gql`
    mutation VerifySignupOTP($input: SignupOTPInput!) {
        verifySignupOTP(input: $input) {
            _id
            email
            fullName
            gender
            profilePicture
        }
    }
`;

export const RESEND_VERIFICATION_OTP = gql`
    mutation ResendVerificationOTP($email: String!, $password: String) {
        resendVerificationOTP(email: $email, password: $password) {
            message
            success
        }
    }
`;

export const VERIFY_EMAIL_OTP = gql`
    mutation VerifyEmailOTP($input: EmailOTPInput!) {
        verifyEmailOTP(input: $input) {
            message
            success
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