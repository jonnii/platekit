import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "../../src/fonts.css";
import "./styles.css";

const root = document.getElementById("root")!;
const app = <StrictMode><App /></StrictMode>;
// Production HTML is prerendered by the site build; dev serves an empty root.
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
