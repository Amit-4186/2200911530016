import ShortenerForm from "./components/ShortenerForm.jsx";
import StatsViewer from "./components/StatsViewer.jsx";

export default function App() {
  return (
    <div className="container">
      <h1>URL Shortner</h1>
      <ShortenerForm />
      <StatsViewer />
    </div>
  );
}