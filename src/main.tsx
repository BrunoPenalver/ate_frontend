
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes/routes";
import { PrimeReactProvider} from 'primereact/api';
import { Provider } from "react-redux";
import { stores } from "./stores/stores";
import "primereact/resources/themes/lara-light-green/theme.css";
import "./styles/resets.css";
import "./styles/index.css";
import 'primeicons/primeicons.css';


const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement || document.createElement("div"));

root.render(
  <PrimeReactProvider>
    <Provider store={stores}>
      <RouterProvider router={router} />
    </Provider>
  </PrimeReactProvider>
);
