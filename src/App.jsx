import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import RegisterPage from "./pages/RegisterPage";
import AnalyzerPage from "./pages/AnalyzerPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/analyze" element={<AnalyzerPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
