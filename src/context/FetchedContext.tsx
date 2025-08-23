 
import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import { useDataContext } from "./DataContext";
import type { ListingType } from "../utils/types";

const BASE_API_URL = import.meta.env.VITE_API_URL;

//////////////////////////////////////////////
//// CREATING CONTEXT ////
//////////////////////////////////////////////

interface FetchedContextType {
    listings: ListingType[] | [];
    myListings: ListingType[] | [];
    transactions: [] | any;
    setMyListings: (l: ListingType[] | []) => void;
    setTransactions: (t: [] | any) => void;
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
    const { region, gender, pageNum } = useDataContext();

    const [_, setError] = useState("");
    const [myListings, setMyListings] = useState<ListingType[] | []>([]);
    const [transactions, setTransactions] = useState([]);
    const [listings, setListings] = useState<ListingType[] | []>([]);

    useEffect(function() {
        handleFetchListings();
    }, [pageNum, region, gender]);

    async function handleFetchListings() {
        try {
            const query = new URLSearchParams({
                page: pageNum.toString(),
				...(region != "all-region" && { region }),
				...(gender != "all-gender" && { gender }),
            }).toString();

            const res = await fetch(`${BASE_API_URL}/listings/all?${query}`, {
                method: "GET", headers,
            });
            const data = await res.json();
            setListings(data?.data?.listings)

        } catch(err: any) {
            console.log(err?.message as string);
        }
    }

    
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
        setListings([]);
        
        if(token && token != "null") {
            handleFetchListings();
            handleFetchMe();
            handleFetchMyListings();
            handleFetchTransactions();
        }
    }, [token]);


    // CREATE CONTEXT DATA
    let contextData = {
        listings,
        myListings,
        transactions,
        setMyListings,
        setTransactions,
        handleFetchMyListings,
        handleFetchTransactions
    }


    return <FetchedContext.Provider value={contextData}>{children}</FetchedContext.Provider>
}


//////////////////////////////////////////////
//// CREATING HOOK AND EXPORTING ////
//////////////////////////////////////////////
export const useFetchedContext = () => useContext(FetchedContext);