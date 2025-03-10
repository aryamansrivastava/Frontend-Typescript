import { BrowserRouter as Router } from "react-router-dom";
import UserRoutes from "./routes/user";
import { Provider } from "react-redux";
import {store} from "./store/store";
const App = () => {
  return (
    <Provider store={store}>
    <Router>
      <UserRoutes />
    </Router>
    </Provider>
  );
};

export default App;