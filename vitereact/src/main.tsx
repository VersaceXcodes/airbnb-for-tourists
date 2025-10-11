import { createRoot } from "react-dom/client";
import AppWrapper from "./AppWrapper.tsx";
import { setupGlobalErrorHandling } from "./utils/errorHandler";
import "./index.css";

// Setup global error handling
setupGlobalErrorHandling();

createRoot(document.getElementById("root")!).render(
			<AppWrapper /> 
);
