import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { AddProcess } from "./components/AddProcess";
import { ProcessDetail } from "./components/ProcessDetail";
import { CostEfficiency } from "./components/CostEfficiency";
import { YardResources } from "./components/YardResources";
import { SimulationResults } from "./components/SimulationResults";
import { SimulationPlayground } from "./components/SimulationPlayground";
import { ProductionPlanning } from "./components/ProductionPlanning";
import { Reports } from "./components/Reports";
import { Login } from "./components/Login";

export const router = createBrowserRouter([
  { path: "/login", Component: Login },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "add-process", Component: AddProcess },
      { path: "process/:id", Component: ProcessDetail },
      { path: "cost-efficiency", Component: CostEfficiency },
      { path: "yard-resources", Component: YardResources },
      { path: "simulation-results", Component: SimulationResults },
      { path: "simulation-playground", Component: SimulationPlayground },
      { path: "production-planning", Component: ProductionPlanning },
      { path: "reports", Component: Reports },
      { path: "settings", Component: Dashboard },
    ],
  },
]);
