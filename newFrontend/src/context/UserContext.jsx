import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_AUTHETICATED_USER } from '../graphql/queries/user.query';

const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const { data, loading, refetch } = useQuery(GET_AUTHETICATED_USER, {
        fetchPolicy: 'cache-first'
    });
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (data?.authUser) {
            setUser(data.authUser);
        }
    }, [data]);

    const updateUser = async (updatedData) => {
        setUser(prev => ({ ...prev, ...updatedData }));
        // Force refresh from server
        await refetch();
    };

    const refreshUser = async () => {
        const result = await refetch();
        if (result.data?.authUser) {
            setUser(result.data.authUser);
        }
    };

    return (
        <UserContext.Provider value={{
            user,
            loading,
            updateUser,
            refreshUser
        }}>
            {children}
        </UserContext.Provider>
    );
};