// @trigger 'when 2a succeeds'
// @credential 'ihris-mifos-combined'
// @adaptor 'http'
// -----------------------------------------------------------------------------

// Hang 'payees' on state so that operations which replace "response" don't
// overwrite these data. QUESTION: Why pluck body[0] instead of body[*]? What
// happens if there are multiple payees? Is that first item in the body array an
// array itself?
alterState(state => {
  state.payees = state.response.body[0];
  console.log(state.payees);
  return state;
});

// ===========================================================================
// Make payment requests in Mifos with the reponse, either in bulk or by
// iterating through the array of registrants and making a separate request
// for each one ==============================================================
each(
  state.payees.toArray(),
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
      console.log(JSON.stringify(state.response.body));
      state.data.person_payments = {
        'form[person_payments][0][0][fields][id]': 'person_payments|0',
        'form[person_payments][0][0][fields][parent]':
          'person|' + state.data.person_id,
        'form[person_payments][0][0][fields][date][day]': today.getDate(),
        'form[person_payments][0][0][fields][date][month]':
          today.getMonth() + 1,
        'form[person_payments][0][0][fields][date][year]': today.getFullYear(),
        'form[person_payments][0][0][fields][amount]': state => {
          return state.data.salary / 52;
        },
        'form[person_payments][0][0][fields][transactionId]': state => {
          return state.response.body.transactionId;
        },
        'form[person_payments][0][0][fields][status]': state => {
          if (state.data.success === true) {
            return 'initiated';
          }
          return 'failed';
        },
      };
      console.log(state.data.person_payments);
      // =====================================================================
      // Create "initiated" payments in iHRIS with their mifos external IDs ==
      post(state.configuration.ihrisUrl + '/manage/person_payments', {
        authentication: state.configuration.ihrisAuth,
        formData: state => {
          state.data.person_payments.submit_type = 'confirm';
          return state.data.person_payments;
        },
      });
      post(state.configuration.ihrisUrl + '/manage/person_payments', {
        authentication: state.configuration.ihrisAuth,
        formData: state => {
          state.data.person_payments.submit_type = 'save';
          return state.data.person_payments;
        },
        options: {
          successCodes: [302],
        },
      });
    }
  )
);
