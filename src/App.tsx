import { BrowserRouter as Router } from "react-router-dom";
import UserRoutes from "./routes/user";

const App = () => {
  return (
    <Router>
      <UserRoutes />
    </Router>
  );
};

export default App;