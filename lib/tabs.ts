// lib/tabs.ts

export const getCurrentTab = async () => {
  if (!chrome?.tabs) {
      console.error("This function must be run in an extension context.");
      return null;
  }
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
};