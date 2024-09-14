const userTypeDef=`#graphql

    type User {
        _id:ID!
        email:String!
        fullName:String!
        password:String!
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
        login(input:LogInInput!):User
        logout:LogoutResponse
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
`;

export default userTypeDef;