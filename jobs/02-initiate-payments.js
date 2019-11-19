// @trigger 'daily'
// @credential 'ihris-mifos-combined'
// @adaptor 'http'
// -----------------------------------------------------------------------------

// =============================================================================
// Get registrants meeting 'payment required' criteria =========================
get(
  '/registrants/',
  { query: { daysSinceLastPayment: '>30', type: 'cct', status: 'enrolled' } },
  // ===========================================================================
  // Make payment requests in Mifos with the reponse, either in bulk or by
  // iterating through the array of registrants and making a separate request
  // for each one ==============================================================
  state => {
    post(
      state.configuration.mifosUrl,
      {
        headers: { 'content-type': 'json' },
        authentication: state.configuration.mifosAuth,
        body: state.data.registrants.map(r => {
          console.log(`Initiating payment for ${r.name}.`);
          return {
            payer: { msisdn: state.configuration.mifosAcct },
            payee: { msisdn: r.phone },
            amount: r.amount,
          };
        }),
      },
      state => {
        // =====================================================================
        // Create "initiated" payments in iHRIS with their mifos external IDs ==
        post(state.configuration.ihrisUrl, {
          authentication: state.configuration.ihrisAuth,
          body: {
            status: 'initiated',
            mifosTxId: state.response.txId,
            dateInitiated: state.response.timestamp,
          },
        });
        return state;
      }
    );
    return state;
  }
);