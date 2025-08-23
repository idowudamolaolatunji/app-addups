 
import { createContext, useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";

//////////////////////////////////////////////
//// CREATING CONTEXT ////
//////////////////////////////////////////////

const BASE_API_URL = import.meta.env.VITE_API_URL;

interface AuthContextType {
	user: Record<string, unknown> | null;
	token: string | null;
	handleChange: (user: Record<string, unknown>, token: any) => void;
	handleUser: (user: Record<string, unknown>) => void;
	signoutUser: () => boolean;
}

const AuthContext = createContext<AuthContextType | any>(null);
export default AuthContext;

//////////////////////////////////////////////
//// CREATING PROVIDER ////
//////////////////////////////////////////////
interface AuthProviderProps {
	children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const storedUser = Cookies.get("user_obj");
	const [user, setUser] = useState(storedUser == null ? null : JSON.parse(storedUser));
	const [token, setToken] = useState<any | null>(Cookies.get("token") ? Cookies.get("token") : null);
	const isAuthenticated = user && token;

	const headers = {
		"Content-Type": "application/json",
		Authorization: `Bearer ${token}`,
	};

	function handleChange(user: Record<string, unknown> | any, token: string | any) {
		setUser(user);
		setToken(token);
	}

	function handleUser(user: Record<string, unknown> | any) {
		setUser(user);
	}

	async function signoutUser() {
        const res = await fetch(`${BASE_API_URL}/auth/logout`, { method: "POST", headers });
        if (!res.ok) return false;
		
		handleChange(null, null);
		Cookies.remove("user_obj");
		Cookies.remove("token");
        return true
    }

	useEffect(
		function () {
			Cookies.set("user_obj", JSON.stringify(user), { expires: 365 });
			Cookies.set("token", token, { expires: 365 });
		},
		[user, token],
	);

	// CREATE CONTEXT DATA
	let contextData = {
		user,
		token,
		headers,
		handleChange,
		handleUser,
		isAuthenticated,
		signoutUser,
	};

	return <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>;
};

//////////////////////////////////////////////
//// CREATING HOOK AND EXPORTING ////
//////////////////////////////////////////////
export const useAuthContext = () => useContext(AuthContext);