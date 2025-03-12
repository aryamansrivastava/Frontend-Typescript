import { BrowserRouter as Router } from "react-router-dom";
import UserRoutes from "./routes/user";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import AppLayout from "./layout";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="flex bg-gray-900 items-center justify-center min-h-screen">
          <AppLayout>
            <UserRoutes />
          </AppLayout>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
