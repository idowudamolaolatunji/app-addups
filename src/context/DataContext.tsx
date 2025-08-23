import { createContext, useState, useContext } from "react";

//////////////////////////////////////////////
//// CREATING CONTEXT ////
//////////////////////////////////////////////

interface DataContextType {
	tabShown: string;
	prevTabShown: string;
	handleTabShown: (tab: string) => void;

	///////////////////////////////////////////
	region: string;
	gender: string;
	hasMore?: boolean;
	pageNum: string | number;
	setRegion: (r: string) => void;
	setGender: (g: string) => void;
	setHasMore?: (hm: boolean) => void;
	setPageNum?: (pn: string | number) => void;
}

const DataContext = createContext<DataContextType | any>(null);
export default DataContext;

//////////////////////////////////////////////
//// CREATING PROVIDER ////
//////////////////////////////////////////////
interface DataProviderProps {
	children: React.ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
	const [tabShown, setTabShown] = useState("explore");
	const [prevTabShown, setPrevTabShown] = useState("");

	const [region, setRegion] = useState("all-region");
	const [gender, setGender] = useState("all-gender");
	// const [hasMore, setHasMore] = useState(false);
	const [pageNum] = useState(1);

	const handleTabShown = function (tab: string) {
		setPrevTabShown(tabShown);
		setTabShown(tab);
	};

	// CREATE CONTEXT DATA
	let contextData = {
		tabShown,
		prevTabShown,
		handleTabShown,

		/////////////////
		region,
		gender,
		// hasMore,
		pageNum,
		setRegion,
		setGender,
		// setHasMore,
		// setPageNum,
	};

	return <DataContext.Provider value={contextData}>{children}</DataContext.Provider>;
};

//////////////////////////////////////////////
//// CREATING HOOK AND EXPORTING ////
//////////////////////////////////////////////
export const useDataContext = () => useContext(DataContext);
