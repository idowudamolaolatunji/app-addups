 
import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import type { ListingType } from "../utils/types";

const BASE_API_URL = import.meta.env.VITE_API_URL;

//////////////////////////////////////////////
//// CREATING CONTEXT ////
//////////////////////////////////////////////

interface FetchedContextType {
    handleFetchListings: () => void;
    ///////////////////////////////////////
    listings: ListingType[] | [];
    setListings: (l: ListingType[] | []) => void;
    listingLoading: boolean;
    myListings: ListingType[] | [];
    transactions: [] | any;
    setMyListings: (l: ListingType[] | []) => void;
    setTransactions: (t: [] | any) => void;
    ////////////////////////////////////////
    region: string;
	gender: string;
	hasMore: boolean;
	pageNum: number;
	setRegion: (r: string) => void;
	setGender: (g: string) => void;
	setHasMore: (hm: boolean) => void;
	setPageNum: (pn: number) => void;
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
    const [myListings, setMyListings] = useState<ListingType[] | []>([]);
    const [transactions, setTransactions] = useState([]);

    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    const [listings, setListings] = useState<ListingType[] | []>([]);
    const [listingLoading, setListingLoading] = useState(false);
    ////////////////////////////////////////////////////////////////
    const [region, setRegion] = useState("all-region");
	const [gender, setGender] = useState("all-gender");
	const [hasMore, setHasMore] = useState(false);
	const [pageNum, setPageNum] = useState(1);
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////

    async function handleFetchListings() {
        setListingLoading(true);

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
            setListings(prev => [...prev, ...data?.data?.listings])
            setHasMore(data?.data?.pagination?.page < data?.data?.pagination?.pages)

        } catch(err: any) {
            console.log(err?.message as string);
        } finally {
            setListingLoading(false);
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

    // CLEAR THE STATE, IF GENDER OR REGION CHANGES
    useEffect(function() {
        setTimeout(() => {
            setListings([]);
        }, 1000);
    }, [region, gender]);
    
    // CALL THE FETCH FUNCTION
    useEffect(function() {
        if(token && token != "null") {
            handleFetchListings();
        }
    }, [pageNum, region, gender, token]);

    // START FETCHING OTHER DATA
    useEffect(function () {
        if(token && token != "null") {
            handleFetchMe();
            handleFetchMyListings();
            handleFetchTransactions();
        }
    }, [token]);


    // CREATE CONTEXT DATA
    let contextData = {
        handleFetchListings,
        ///////////////////////
        ///////////////////////
        listings,
        setListings,
        listingLoading,
        myListings,
        transactions,
        setMyListings,
        setTransactions,
        handleFetchMyListings,
        handleFetchTransactions,
        ////////////////////////
        ////////////////////////
		region,
		gender,
		hasMore,
		pageNum,
		setRegion,
		setGender,
		setHasMore,
		setPageNum,
    }


    return <FetchedContext.Provider value={contextData}>{children}</FetchedContext.Provider>
}


//////////////////////////////////////////////
//// CREATING HOOK AND EXPORTING ////
//////////////////////////////////////////////
export const useFetchedContext = () => useContext(FetchedContext);