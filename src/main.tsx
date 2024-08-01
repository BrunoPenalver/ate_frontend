
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes/routes";
import { addLocale, PrimeReactProvider} from 'primereact/api';
import { Provider } from "react-redux";
import { stores } from "./stores/stores";
import 'primeicons/primeicons.css';
import "primereact/resources/themes/lara-light-green/theme.css";
import "./styles/resets.css";
import "./styles/index.css";
import 'primeicons/primeicons.css';
import { ConfirmDialog } from "primereact/confirmdialog";

addLocale('es', {
  firstDayOfWeek: 1,
  dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
  dayNamesMin: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  today: 'Hoy',
  clear: 'Limpiar'
});

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement || document.createElement("div"));

root.render(
  <PrimeReactProvider>
    <Provider store={stores}>
      <RouterProvider router={router} />
      <ConfirmDialog/>
    </Provider>
  </PrimeReactProvider>
);
