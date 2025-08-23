 
import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";

const BASE_API_URL = import.meta.env.VITE_API_URL;

//////////////////////////////////////////////
//// CREATING CONTEXT ////
//////////////////////////////////////////////

interface FetchedContextType {
    myListings: null | [] | any;
    transactions: [] | any;
    setMyListings: (l: [] | any) => void;
    setTransactions: (t: [] | any) => void;
	handleFetchMyListings: () => void;
	handleFetchTransactions: () => void;
}

const FetchedContext = createContext<FetchedContextType | any>(null);
export default FetchedContext;


//////////////////////////////////////////////
//// CREATING PROVIDER ////
//////////////////////////////////////////////
interface FetchedProviderProps {
	children: React.ReactNode;
}


export const FetchedProvider: React.FC<FetchedProviderProps> = ({ children }) => {
    const { token, headers, handleUser } = useAuthContext();

    const [_, setError] = useState("");
    const [myListings, setMyListings] = useState(null);
    const [transactions, setTransactions] = useState([]);

    
    async function handleFetchMe() {
        const res = await fetch(`${BASE_API_URL}/auth/me`, { method: "GET", headers })
        const data = await res.json();
        if (data?.data) handleUser(data?.data?.user);
    }

    async function handleFetchTransactions() {
        try {
            const res = await fetch(`${BASE_API_URL}/transactions/mine/t`, { method: "GET", headers })
            const data = await res.json();

            if(data.status == "fail") throw new Error();
            if (data?.data) setTransactions(data?.data?.transactions);

        } catch(err: any) {
            setError(err?.message);
        }
    }

    async function handleFetchMyListings() {
        try {
            const res = await fetch(`${BASE_API_URL}/listings/mine/p`, { method: "GET", headers })
            const data = await res.json();

            if(data.status == "fail") throw new Error();
            if (data?.data) setMyListings(data?.data?.listings);

        } catch(err: any) {
            setError(err?.message);
        }
    }


    useEffect(function () {
        if(token && token != "null") {
            handleFetchMe();
            handleFetchMyListings();
            handleFetchTransactions();
        }
    }, [token]);


    // CREATE CONTEXT DATA
    let contextData = {
        myListings,
        transactions,
        setMyListings,
        setTransactions,
        handleFetchMyListings
    }


    return <FetchedContext.Provider value={contextData}>{children}</FetchedContext.Provider>
}


//////////////////////////////////////////////
//// CREATING HOOK AND EXPORTING ////
//////////////////////////////////////////////
export const useFetchedContext = () => useContext(FetchedContext);