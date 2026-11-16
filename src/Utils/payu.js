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

  // Priority: If VITE_PAYMENT is explicitly set in .env, respect it first
  const targetUrl =
    import.meta.env.VITE_PAYMENT ||
    paymentData.paymentUrl ||
    paymentData.action ||
    paymentData.checkoutUrl ||
    PAYU_URL;

  // Development simulation bypass when PayU sandbox server is experiencing downtime (504 timeout)
  if (targetUrl === "mock" || targetUrl === "simulate" || targetUrl === "bypass") {
    const bookingId =
      paymentData.bookingId ||
      paymentData.booking?._id ||
      paymentData.payuParams?.udf1 ||
      "";
    const txnid = paymentData.txnid || paymentData.payuParams?.txnid || "";
    window.location.href = `/payment-result?bookingId=${encodeURIComponent(bookingId)}&txnid=${encodeURIComponent(txnid)}&status=success`;
    return;
  }

  const form = document.createElement("form");

  form.method = "POST";
  form.action = targetUrl;

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