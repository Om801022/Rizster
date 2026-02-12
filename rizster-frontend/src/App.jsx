import { useState } from "react";
import Auth from "./pages/Auth";
import Feed from "./components/Feed";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  return (
    <div className="container mt-4">
      <h2>Rizster</h2>
      {isLoggedIn ? (
        <Feed setIsLoggedIn={setIsLoggedIn} />
      ) : (
        <Auth setIsLoggedIn={setIsLoggedIn} />
      )}
    </div>
  );
}

export default App;
