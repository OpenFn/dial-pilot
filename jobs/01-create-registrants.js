// @trigger 'odk submission' either via Aggregate JSON Forwarding or via direct
//          submission to OpenFn.org/inbox
// @credential 'ihris'
// @adaptor 'http'
// -----------------------------------------------------------------------------

// =============================================================================
// Create records via iHRIS api, with the hostUrl, port, and authentication
// handled by the credential ===================================================
post('/registrants', {
  headers: { 'content-type': 'json' },
  body: {
    msisdn: state.data.phoneNumber,
    name: `${state.data.firstName} ${state.data.lastName}`,
    gender: state.data.sex,
  },
});