import { useState } from "react";
import Auth from "./pages/Auth";
import Feed from "./components/Feed";
import Landing from "./pages/Landing";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [showAuth, setShowAuth] = useState(false);

  if (isLoggedIn) {
    return <Feed setIsLoggedIn={setIsLoggedIn} />;
  }

  if (showAuth) {
    return <Auth setIsLoggedIn={setIsLoggedIn} />;
  }

  return <Landing setShowAuth={setShowAuth} />;
}

export default App;
