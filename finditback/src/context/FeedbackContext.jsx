import React, { createContext, useContext, useMemo, useState } from "react";

const FeedbackContext = createContext(null);

export const FeedbackProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState(null);

  const notify = (message, type = "info") => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2800);
  };

  const confirmAction = (message) =>
    new Promise((resolve) => {
      setConfirmState({ message, resolve });
    });

  const closeConfirm = (result) => {
    if (confirmState?.resolve) {
      confirmState.resolve(result);
    }
    setConfirmState(null);
  };

  const value = useMemo(
    () => ({
      notify,
      confirmAction,
    }),
    []
  );

  return (
    <FeedbackContext.Provider value={value}>
      {children}

      <div style={{ position: "fixed", top: "16px", right: "16px", zIndex: 3000, display: "flex", flexDirection: "column", gap: "10px" }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              minWidth: "240px",
              maxWidth: "360px",
              padding: "10px 12px",
              borderRadius: "10px",
              background: toast.type === "error" ? "#fee2e2" : "#e0f2fe",
              color: toast.type === "error" ? "#991b1b" : "#0c4a6e",
              border: toast.type === "error" ? "1px solid #fecaca" : "1px solid #bae6fd",
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              fontSize: "14px",
            }}
          >
            {toast.message}
          </div>
        ))}
      </div>

      {confirmState && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.45)",
            zIndex: 3500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "420px",
              background: "#fff",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 12px 28px rgba(0,0,0,0.22)",
            }}
          >
            <h3 style={{ margin: "0 0 10px 0", fontSize: "18px", color: "#1f2937" }}>Confirm Action</h3>
            <p style={{ margin: "0 0 18px 0", fontSize: "14px", color: "#4b5563" }}>{confirmState.message}</p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                onClick={() => closeConfirm(false)}
                style={{ border: "1px solid #d1d5db", background: "#fff", color: "#374151", borderRadius: "8px", padding: "8px 12px", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => closeConfirm(true)}
                style={{ border: "1px solid #2563eb", background: "#2563eb", color: "#fff", borderRadius: "8px", padding: "8px 12px", cursor: "pointer" }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error("useFeedback must be used within FeedbackProvider");
  }
  return context;
};


