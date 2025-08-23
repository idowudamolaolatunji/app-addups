import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { FetchedProvider } from "./context/FetchedContext.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import "react-phone-input-2/lib/style.css";
import { DataProvider } from "./context/DataContext.tsx";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT;

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<GoogleOAuthProvider clientId={clientId}>
			<AuthProvider>
				<DataProvider>
					<FetchedProvider>
						<App />
					</FetchedProvider>
				</DataProvider>
			</AuthProvider>
		</GoogleOAuthProvider>
	</StrictMode>,
);
