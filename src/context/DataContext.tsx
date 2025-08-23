import { createContext, useState, useContext } from "react";

//////////////////////////////////////////////
//// CREATING CONTEXT ////
//////////////////////////////////////////////

interface DataContextType {
	tabShown: string;
	prevTabShown: string;
	handleTabShown: (tab: string) => void;
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

	const handleTabShown = function (tab: string) {
		setPrevTabShown(tabShown);
		setTabShown(tab);
	};

	// CREATE CONTEXT DATA
	let contextData = {
		tabShown,
		prevTabShown,
		handleTabShown,
	};

	return <DataContext.Provider value={contextData}>{children}</DataContext.Provider>;
};

//////////////////////////////////////////////
//// CREATING HOOK AND EXPORTING ////
//////////////////////////////////////////////
export const useDataContext = () => useContext(DataContext);
