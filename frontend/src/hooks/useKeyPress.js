import { useEffect, useCallback } from 'react';

export default function useKeyPress(keys, action) {
  const handleKeyPress = useCallback((event) => {
    // Check if the pressed key matches
    // Support single keys like "Escape" or combinations like "ctrl+k" / "meta+k"
    const isCombo = keys.includes("+");
    
    if (isCombo) {
      const parts = keys.toLowerCase().split("+");
      const key = parts.pop();
      const needsCtrl = parts.includes("ctrl");
      const needsMeta = parts.includes("meta");
      const needsShift = parts.includes("shift");
      
      const ctrlMatch = needsCtrl ? event.ctrlKey : true;
      const metaMatch = needsMeta ? event.metaKey : true;
      const shiftMatch = needsShift ? event.shiftKey : true;
      
      if (
        event.key.toLowerCase() === key &&
        ctrlMatch &&
        metaMatch &&
        shiftMatch &&
        (event.ctrlKey || event.metaKey || event.shiftKey) // Ensure at least one modifier was pressed if it's a combo
      ) {
        event.preventDefault();
        action(event);
      }
    } else {
      if (event.key === keys || event.key.toLowerCase() === keys.toLowerCase()) {
        action(event);
      }
    }
  }, [keys, action]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);
}
