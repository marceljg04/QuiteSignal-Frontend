import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import RegisterPage from "./pages/RegisterPage";
import AnalyzerPage from "./pages/AnalyzerPage";
import { AuthProvider } from "./Context/AuthProvider";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/analyze"
            element={
              <PrivateRoute>
                <AnalyzerPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
