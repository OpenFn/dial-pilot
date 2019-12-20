// @trigger 'when employee evaluation form arrives'
// @credential 'ihris-mifos-combined'
// @adaptor 'http'
// -----------------------------------------------------------------------------

alterState(state => {
  state.payee = state.data.EvaluationForm;
  state.saved_config = state.configuration;
  return state;
});

post(
  `${state.configuration.mifosUrl}/channel/transactions`,
  {
    authentication: state.configuration.mifosAuth,
    headers: {
      'content-type': 'application/json',
      'X-Tenant-Identifier': 'tn03',
    },
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
            partyIdentifier: state.payee.social_worker_id.split('_')[1],
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
          // Calculate the bonus amount - for now just use number of clients seen * 100
          amount: state.payee.client_counts*100,
        },
      };
    },
  },
  state => {
    const today = new Date();
    console.log("State.data: "+JSON.stringify(state.data))
    state.data.person_payment = {
      'form[person_payments][0][0][fields][id]': 'person_payments|0',
      'form[person_payments][0][0][fields][parent]':
        'person|' + state.payee.social_worker_id.split('_')[1],
      'form[person_payments][0][0][fields][date][day]': today.getDate(),
      'form[person_payments][0][0][fields][date][month]':
        today.getMonth() + 1,
      'form[person_payments][0][0][fields][date][year]': today.getFullYear(),
      'form[person_payments][0][0][fields][amount]': state.payee.client_counts*100,
      'form[person_payments][0][0][fields][transactionId]':
        state.data.body.transactionId,
      'form[person_payments][0][0][fields][status]':
        state.data.body.transactionId ? 'initiated' : 'failed',
    };
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
);

