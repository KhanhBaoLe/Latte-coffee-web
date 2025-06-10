"use client";

import { useCart } from "./CartContext";
import Toast from "./Toast";

export default function ToastWrapper() {
  const { showToast, setShowToast, toastMessage } = useCart();
  
  return (
    <Toast 
      message={toastMessage}
      isVisible={showToast}
      onClose={() => setShowToast(false)}
    />
  );
} 