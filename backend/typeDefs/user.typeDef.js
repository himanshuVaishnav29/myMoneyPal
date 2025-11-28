const userTypeDef=`#graphql

    type User {
        _id:ID!
        email:String!
        fullName:String!
        password:String
        gender:String!
        salt:String
        profilePicture:String
    }

    type Query {
        authUser:User
        getUser(userId:ID!):User
    }

    type Mutation{
        signUp(input:SignUpInput!):User
        # signUp(email:String!,name:String!,password:String!,gender:String!):User
        login(input:LogInInput!):LoginResponse
        logout:LogoutResponse
        updateProfile(input:UpdateProfileInput!):User
        uploadProfileImage(file:Upload!):ImageUploadResponse
        requestPasswordReset(email:String!, timezone:String):OTPResponse
        verifyOTPAndResetPassword(input:ResetPasswordInput!):User
    }

    type LoginResponse{
        user: User
        token: String
    }

    input SignUpInput{
        email:String!
        fullName:String!
        password:String!
        gender:String!
    }

    input LogInInput{
        email:String!
        password:String!
    }

    type LogoutResponse{
        message:String!
    }

    type OTPResponse{
        message:String!
        success:Boolean!
    }

    input UpdateProfileInput{
        fullName:String
        profilePicture:String
    }

    scalar Upload

    type ImageUploadResponse{
        url:String!
        message:String!
    }

    input ResetPasswordInput{
        email:String!
        otp:String!
        newPassword:String!
    }
`;

export default userTypeDef;