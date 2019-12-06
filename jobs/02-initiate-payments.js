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
        authentication: state.configuration.mifosAuth,
        headers: {
          'content-type': 'application/json',
          'X-Tenant-Identifier': 'tn03',
        },
        // Can we send an array of payments to make in a single request?
        // body: state.data.registrants.map(r => {
        //   console.log(`Initiating payment for ${r.name}.`);
        //   return {
        //     payer: { msisdn: state.configuration.mifosAcct },
        //     payee: { msisdn: r.phone },
        //     amount: r.amount,
        //   };
        // }),
        body: {
          payer: {
            partyIdInfo: {
              partyIdType: 'MSISDN',
              partyIdentifier: '27710203999',
            },
          },
          payee: {
            partyIdInfo: {
              partyIdType: 'MSISDN',
              partyIdentifier: state.data.employeePhoneNumber,
            },
          },
          amountType: 'SEND',
          transactionType: {
            scenario: 'PAYMENT',
            initiator: 'PAYER',
            initiatorType: 'CONSUMER',
          },
          amount: {
            currency: 'USD',
            amount: 100,
          },
        },
      },
      state => {
        // =====================================================================
        // Create "initiated" payments in iHRIS with their mifos external IDs ==
        post(state.configuration.ihrisUrl, {
          authentication: state.configuration.ihrisAuth,
          formData: {
            'form[person_payments][0][0][fields][id]': 'person_payments|0',
            'form[person_payments][0][0][fields][parent]': state.data.personId,
            'form[person_ payments][0][0][fields][date][day]': state.data.day,
            'form[person_ payments][0][0][fields][date][month]':
              state.data.month,
            'form[person_ payments][0][0][fields][date][year]': state.data.year,
            'form[person_payments][0][0][fields][amount]': state => {
              console.log('Do some calculation in here?');
              return state.data.salary / 12;
            },
            'form[person_payments][0][0][fields][status]': 'initiated',
          },
        });
        return state;
      }
    );
    return state;
  }
);
