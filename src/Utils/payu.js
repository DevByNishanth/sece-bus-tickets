const PAYU_URL = "https://test.payu.in/_payment";

/**
 * Redirects the user to PayU Checkout.
 * Extracts the target payment gateway URL from the checkout API response
 * (action / checkoutUrl / paymentUrl) and forwards all parameters from payuParams
 * both inside the URL query string and via hidden POST form fields.
 *
 * Explicitly guarantees that:
 * - key
 * - txnid
 * - amount
 * - productinfo
 * - firstname
 * - email
 * - phone
 * - surl
 * - furl
 * - hash
 * - service_provider
 * - pg
 * - udf1, udf2, udf3, udf4, udf5
 * are forwarded in the query string and form fields.
 *
 * Saves transaction identifiers (bookingId, txnid, amount, snapshot) to sessionStorage
 * and localStorage so the payment-result screen can recover the booking even if the
 * gateway callback omitted them from the redirect URL.
 *
 * @param {Object} paymentData - Payment parameters from backend checkout API response
 * @param {Object} [bookingData] - Optional booking object for state preservation
 */
export const redirectToPayU = (paymentData, bookingData) => {
  if (!paymentData) {
    throw new Error("Payment data is missing");
  }

  // 1. Resolve payment and booking objects safely
  const resolvedPayment =
    paymentData.payment ||
    paymentData.data?.payment ||
    paymentData;

  const resolvedBooking =
    bookingData ||
    paymentData.booking ||
    paymentData.data?.booking ||
    null;

  // Extract payuParams object
  const payuParamsObj =
    resolvedPayment.payuParams ||
    paymentData.payuParams ||
    paymentData.params ||
    (resolvedPayment.key && resolvedPayment.txnid ? resolvedPayment : {});

  // 2. Extract transaction references with highest priority
  const txnid =
    payuParamsObj.txnid ||
    resolvedPayment.txnid ||
    paymentData.txnid ||
    "";

  const bookingId =
    paymentData.bookingId ||
    resolvedPayment.bookingId ||
    resolvedBooking?._id ||
    resolvedBooking?.bookingId ||
    payuParamsObj.udf1 ||
    "";

  const amount =
    payuParamsObj.amount ||
    resolvedPayment.amount ||
    paymentData.amount ||
    resolvedBooking?.totalAmount ||
    "";

  const bookingNumber =
    resolvedBooking?.bookingNumber ||
    paymentData.bookingNumber ||
    resolvedPayment.bookingNumber ||
    "";

  // Persist references across cross-origin redirect
  try {
    if (bookingId) {
      sessionStorage.setItem("last_booking_id", String(bookingId));
      localStorage.setItem("last_booking_id", String(bookingId));
    }
    if (txnid) {
      sessionStorage.setItem("last_txnid", String(txnid));
      localStorage.setItem("last_txnid", String(txnid));
    }
    if (amount) {
      sessionStorage.setItem("last_payment_amount", String(amount));
      localStorage.setItem("last_payment_amount", String(amount));
    }
    if (bookingNumber) {
      sessionStorage.setItem("last_booking_number", String(bookingNumber));
      localStorage.setItem("last_booking_number", String(bookingNumber));
    }
    if (resolvedBooking) {
      sessionStorage.setItem("last_booking_snapshot", JSON.stringify(resolvedBooking));
      localStorage.setItem("last_booking_snapshot", JSON.stringify(resolvedBooking));
    }
  } catch (err) {
    console.warn("[PayU Redirect] Failed to write to web storage:", err);
  }

  // 3. Target URL from checkout API response (action / checkoutUrl / paymentUrl)
  const targetBaseUrl =
    resolvedPayment.action ||
    resolvedPayment.checkoutUrl ||
    resolvedPayment.paymentUrl ||
    paymentData.action ||
    paymentData.checkoutUrl ||
    paymentData.paymentUrl ||
    (import.meta.env.VITE_PAYMENT && import.meta.env.VITE_PAYMENT !== "mock"
      ? import.meta.env.VITE_PAYMENT
      : null) ||
    PAYU_URL;

  // 4. Construct complete params dictionary matching backend checkout payuParams
  const params = {
    key: payuParamsObj.key || resolvedPayment.key || "keYJB5",
    txnid: txnid, // Crucial parameter
    amount: payuParamsObj.amount || (amount ? String(amount) : "0.00"),
    productinfo:
      payuParamsObj.productinfo ||
      resolvedPayment.productinfo ||
      (bookingNumber ? `Bus Booking ${bookingNumber}` : "Bus Booking"),
    firstname: payuParamsObj.firstname || resolvedPayment.firstname || "Customer",
    email: payuParamsObj.email || resolvedPayment.email || "customer@example.com",
    phone: payuParamsObj.phone || resolvedPayment.phone || "9876543210",
    surl: payuParamsObj.surl || resolvedPayment.surl || "",
    furl: payuParamsObj.furl || resolvedPayment.furl || "",
    hash: payuParamsObj.hash || resolvedPayment.hash || "",
    service_provider:
      payuParamsObj.service_provider ||
      resolvedPayment.service_provider ||
      "payu_paisa",
    pg: payuParamsObj.pg || resolvedPayment.pg || "UPI",
    udf1:
      payuParamsObj.udf1 !== undefined && payuParamsObj.udf1 !== null
        ? String(payuParamsObj.udf1)
        : String(bookingId || ""),
    udf2:
      payuParamsObj.udf2 !== undefined && payuParamsObj.udf2 !== null
        ? String(payuParamsObj.udf2)
        : "",
    udf3:
      payuParamsObj.udf3 !== undefined && payuParamsObj.udf3 !== null
        ? String(payuParamsObj.udf3)
        : "",
    udf4:
      payuParamsObj.udf4 !== undefined && payuParamsObj.udf4 !== null
        ? String(payuParamsObj.udf4)
        : "",
    udf5:
      payuParamsObj.udf5 !== undefined && payuParamsObj.udf5 !== null
        ? String(payuParamsObj.udf5)
        : "",
    ...payuParamsObj
  };

  // Re-assert txnid to ensure nothing overwrites it
  params.txnid = txnid;

  // Append txnid and bookingId to surl and furl so that when PayU redirects back to backend callback,
  // the backend receives req.query.txnid even if its body-parser middleware fails to parse req.body
  if (params.surl && !params.surl.includes("txnid=") && txnid) {
    const sep = params.surl.includes("?") ? "&" : "?";
    params.surl = `${params.surl}${sep}txnid=${encodeURIComponent(txnid)}&bookingId=${encodeURIComponent(bookingId || params.udf1 || "")}`;
  }
  if (params.furl && !params.furl.includes("txnid=") && txnid) {
    const sep = params.furl.includes("?") ? "&" : "?";
    params.furl = `${params.furl}${sep}txnid=${encodeURIComponent(txnid)}&bookingId=${encodeURIComponent(bookingId || params.udf1 || "")}`;
  }

  // Ordered list of standard PayU parameters
  const primaryKeys = [
    "key",
    "txnid",
    "amount",
    "productinfo",
    "firstname",
    "email",
    "phone",
    "surl",
    "furl",
    "hash",
    "service_provider",
    "pg",
    "udf1",
    "udf2",
    "udf3",
    "udf4",
    "udf5"
  ];

  // 5. Build URL query string with parameters
  const queryParams = new URLSearchParams();
  const addedKeys = new Set();

  primaryKeys.forEach((key) => {
    if (params[key] !== undefined && params[key] !== null) {
      queryParams.append(key, String(params[key]));
      addedKeys.add(key);
    }
  });

  // Append any extra fields present
  Object.entries(params).forEach(([key, value]) => {
    if (addedKeys.has(key)) return;
    if (value === undefined || value === null || typeof value === "object") return;
    queryParams.append(key, String(value));
  });

  const queryString = queryParams.toString();
  const separator = targetBaseUrl.includes("?") ? "&" : "?";
  const fullUrlWithParams = queryString
    ? `${targetBaseUrl}${separator}${queryString}`
    : targetBaseUrl;

  console.log("[PayU Redirect] Forwarding to URL with txnid & payuParams:", fullUrlWithParams);
  console.log("[PayU Redirect] Payload params:", params);

  // 6. Create and submit POST form targeting fullUrlWithParams with all hidden inputs
  const form = document.createElement("form");
  form.method = "POST";
  form.action = fullUrlWithParams;
  form.name = "payuForm";

  primaryKeys.forEach((key) => {
    if (params[key] !== undefined && params[key] !== null) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = String(params[key]);
      form.appendChild(input);
    }
  });

  Object.entries(params).forEach(([key, value]) => {
    if (addedKeys.has(key)) return;
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