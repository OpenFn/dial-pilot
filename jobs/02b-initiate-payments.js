// @trigger 'when 2a succeeds'
// @credential 'ihris-mifos-combined'
// @adaptor 'http'
// -----------------------------------------------------------------------------

// Hang 'payees' on state so that operations which replace "response" don't
// overwrite these data. QUESTION: Why pluck body[0] instead of body[*]? What
// happens if there are multiple payees? Is that first item in the body array an
// array itself?
alterState(state => {
  state.data = { payees: state.response.body[0] };
  state.saved_config = state.configuration;
  return state;
});

// ===========================================================================
// Make payment requests in Mifos with the reponse, either in bulk or by
// iterating through the array of registrants and making a separate request
// for each one ==============================================================
each(
  dataPath('payees[*]'),
  post(
    `${state.configuration.mifosUrl}/channel/transactions`,
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
      body: state => {
        return {
          payer: {
            partyIdInfo: {
              partyIdType: 'MSISDN',
              partyIdentifier: '27710203999',
            },
          },
          payee: {
            partyIdInfo: {
              partyIdType: 'MSISDN',
              partyIdentifier: state.data.msisdn,
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
            amount: state.data.salary / 52,
          },
        };
      },
    },
    state => {
      const today = new Date();
      const currPayee = state.references[0];
      state.data.person_payment = {
        'form[person_payments][0][0][fields][id]': 'person_payments|0',
        'form[person_payments][0][0][fields][parent]':
          'person|' + currPayee.person_id,
        'form[person_payments][0][0][fields][date][day]': today.getDate(),
        'form[person_payments][0][0][fields][date][month]':
          today.getMonth() + 1,
        'form[person_payments][0][0][fields][date][year]': today.getFullYear(),
        'form[person_payments][0][0][fields][amount]': currPayee.salary / 52,
        'form[person_payments][0][0][fields][transactionId]':
          state.data.body.transactionId,
        'form[person_payments][0][0][fields][status]':
          state.data.statusCode === 200 ? 'initiated' : 'failed',
      };
      console.log(state.data.person_payment);
      console.log(state.configuraton);
      console.log(state.saved_config);
      // =====================================================================
      // Create "initiated" payments in iHRIS with their mifos external IDs ==
      post(
        `${state.saved_config.ihrisUrl}/manage/person_payments`,
        {
          authentication: state.configuration.ihrisAuth,
          formData: state => {
            state.data.person_payment.submit_type = 'confirm';
            console.log('PaymentData: ' + state.data.person_payment);
            return state.data.person_payment;
          },
        },
        post(`${state.saved_config.ihrisUrl}/manage/person_payments`, {
          authentication: state.configuration.ihrisAuth,
          formData: state => {
            state.references[1].person_payment.submit_type = 'save';
            return state.references[1].person_payment;
          },
          options: {
            successCodes: [302],
          },
        })
      )(state);
    }
  )
);
