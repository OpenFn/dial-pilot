// @trigger 'mifos-payment-webhook'
// @credential 'ihris'
// @adaptor 'http'
// -----------------------------------------------------------------------------

// =============================================================================
// Update payment records via iHRIS api, with the hostUrl, port, and auth
// handled by the credential ===================================================
put(`/payments/${state.data.txId}/`, {
  headers: { 'content-type': 'json' },
  body: {
    status: state.data.paymentStatus,
    mifosTxId: state.response.txId,
    dateCompleted:
      // =======================================================================
      // Only set dateCompleted if status === 'completed' ======================
      state.data.paymentStatus === 'completed' && state.response.timestamp,
  },
});
