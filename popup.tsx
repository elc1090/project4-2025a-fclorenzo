// popup.tsx
import useFirebaseAuth from "~lib/useFirebaseAuth"; // Assuming you copied it to lib/

function IndexPopup() {
  const { authUser, loading, signOut, signInWithGoogle } = useFirebaseAuth();

  // The "Advanced Path" for handling Google Sign-In
  const handleGoogleSignIn = async () => {
    // This requires setting up an offscreen document in Plasmo
    // See Plasmo docs for "Firebase Authentication"
    // For now, we will guide the user to the website.
    console.log("Redirecting to website for login...");
    window.open("https://your-app-url.com/login");
  };

  if (loading) {
    return (
      <div style={{ width: 200, height: 100, display: "grid", placeContent: "center" }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div style={{ width: 240, padding: 16, textAlign: "center" }}>
        <h2>Welcome!</h2>
        <p>Please log in to save bookmarks.</p>
        <button onClick={() => window.open("https://your-app-url.com/login")}>
          Login on Website
        </button>
        {/* Or build your email/password form here */}
      </div>
    );
  }

  return (
    <div style={{ width: 240, padding: 16 }}>
      <h2>Hello, {authUser.email}!</h2>
      <p>You are logged in.</p>
      {/* Your bookmark saving UI goes here */}
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}

export default IndexPopup;