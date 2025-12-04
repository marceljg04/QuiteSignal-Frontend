import Analyzer from "../components/Sentiment/Analyzer";
import LogoutButton from "../components/Auth/Logout";

export default function AnalyzerPage() {
  return (
    <div className="page-container">
      <div className="page-flex-end">
        <LogoutButton />
      </div>

      <h1 className="page-title">Analyzer</h1>
      <Analyzer />
    </div>
  );
}
