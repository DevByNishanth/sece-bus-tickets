const PAYU_URL = "https://test.payu.in/_payment";

/**
 * Redirects the user to PayU Checkout.
 *
 * @param {Object} paymentData - Payment parameters from backend
 */
export const redirectToPayU = (paymentData) => {
  if (!paymentData) {
    throw new Error("Payment data is missing");
  }

  const form = document.createElement("form");

  form.method = "POST";
  form.action =
    paymentData.paymentUrl ||
    paymentData.action ||
    paymentData.checkoutUrl ||
    import.meta.env.VITE_PAYMENT ||
    PAYU_URL;

  // All fields received from backend (support payuParams, params, or direct)
  const params = paymentData.payuParams || paymentData.params || paymentData;

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || typeof value === "object") return;

    const input = document.createElement("input");

    input.type = "hidden";
    input.name = key;
    input.value = String(value);

    form.appendChild(input);
  });

  document.body.appendChild(form);

  form.submit();
};

export default redirectToPayU;