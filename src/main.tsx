import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/AuthContext.tsx";
import { FetchedProvider } from "./context/FetchedContext.tsx";
import { DataProvider } from "./context/DataContext.tsx";
import App from "./App.tsx";
import "react-phone-input-2/lib/style.css";
import "./index.css";


createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<AuthProvider>
			<DataProvider>
				<FetchedProvider>
					<App />
				</FetchedProvider>
			</DataProvider>
		</AuthProvider>
	</StrictMode>,
);
