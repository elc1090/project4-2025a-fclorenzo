// popup.tsx

import { useState, useEffect } from "react";
import useFirebaseAuth from "~lib/useFirebaseAuth";
import { getCategories, addLink } from "~lib/firestore"; // Make sure getCategories is imported
import { getCurrentTab } from "~lib/tabs";
import type { Category, Link} from "~lib/types";

function IndexPopup() {
  const { authUser, loading, signOut } = useFirebaseAuth();
  
  // --- NEW: State for the bookmarking UI ---
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // --- NEW: Effect to fetch categories when the user is logged in ---
  useEffect(() => {
    // Only run if we have a logged-in user
    if (authUser) {
      getCategories(authUser.uid).then(userCategories => {
        // We are casting here because firestore functions return a generic DocumentData[]
        const typedCategories = userCategories as Category[];
        setCategories(typedCategories);

        // Pre-select the first category in the list
        if (typedCategories.length > 0) {
          setSelectedCategory(typedCategories[0].id);
        }
      });
    }
  }, [authUser]); // This effect re-runs whenever the authUser state changes


  // --- NEW: Handler to save the link ---
  const handleSaveLink = async () => {
    if (!authUser || !selectedCategory) {
      setStatusMessage("A category must be selected.");
      return;
    }
    
    setIsSaving(true);
    setStatusMessage("Saving...");

    const currentTab = await getCurrentTab();
    if (!currentTab?.url) {
      setStatusMessage("Error: Could not get current tab information.");
      setIsSaving(false);
      return;
    }

    try {
      await addLink(
        currentTab.url,
        currentTab.title || "No Title", // Provide a fallback for title
        selectedCategory,
        authUser.uid
      );
      setStatusMessage("✅ Link saved successfully!");
    } catch (error) {
      console.error("Error saving link:", error);
      setStatusMessage("❌ Failed to save link.");
    } finally {
      setIsSaving(false);
      // Optional: close the popup automatically after success
      setTimeout(() => window.close(), 1500);
    }
  };

  // --- Existing loading state ---
  if (loading) {
    return (
      <div style={{ width: 200, height: 100, display: "grid", placeContent: "center" }}>
        <p>Loading...</p>
      </div>
    );
  }

  // --- Existing logged-out state ---
  if (!authUser) {
    return (
      <div style={{ width: 240, padding: 16, textAlign: "center", display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h2>Welcome to LinkSync!</h2>
        <p>Log in to start saving your bookmarks.</p>
        <button onClick={() => window.open("https://linksync-573c8.web.app")}>
          Login on Website
        </button>
      </div>
    );
  }

  // --- UPDATED: The main UI for logged-in users ---
  return (
    <div style={{ width: 280, padding: 16, display: "flex", flexDirection: "column", gap: "12px" }}>
      <p style={{margin: 0, textAlign: 'center'}}>
        Logged in as <strong>{authUser.email}</strong>
      </p>
      <hr style={{width: '100%'}}/>
      
      <h4>Save current tab to:</h4>
      <select title="Select a cathegory"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        style={{ padding: "8px" }}
        disabled={categories.length === 0 || isSaving}
      >
        {categories.length > 0 ? (
          categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))
        ) : (
          <option>No categories found...</option>
        )}
      </select>

      <button onClick={handleSaveLink} disabled={!selectedCategory || isSaving}>
        {isSaving ? "Saving..." : "Save Link"}
      </button>

      {statusMessage && <p style={{ textAlign: "center", margin: 0, minHeight: '20px' }}>{statusMessage}</p>}

      <button 
        onClick={() => window.open("https://linksync-573c8.web.app/dashboard")} 
        style={{ background: "transparent", border: "1px solid #ccc" }}
      >
        Open Dashboard
      </button>

      <button 
        onClick={signOut} 
        style={{ background: "transparent", border: "1px solid #ccc" }}
      >
        Sign Out
      </button>
    </div>
  );
}

export default IndexPopup;