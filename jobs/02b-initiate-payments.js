// @trigger 'when 2a succeeds'
// @credential 'ihris-mifos-combined'
// @adaptor 'http'
// -----------------------------------------------------------------------------

// ===========================================================================
// Make payment requests in Mifos with the reponse, either in bulk or by
// iterating through the array of registrants and making a separate request
// for each one ==============================================================
alterState(state => {
  console.log(state.response.body);
  return state;
});

each(
  dataPath('response.body[*]'),
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
              partyIdentifier: dataValue('MSISDN')(state),
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
            amount: state.data.salary / 12,
          },
        };
      },
    },
    state => {
      console.log(state.data);
      // =====================================================================
      // Create "initiated" payments in iHRIS with their mifos external IDs ==
      return post(state.configuration.ihrisUrl, {
        authentication: state.configuration.ihrisAuth,
        formData: {
          'form[person_payments][0][0][fields][id]': 'person_payments|0',
          'form[person_payments][0][0][fields][parent]': state.data.personId,
          'form[person_ payments][0][0][fields][date][day]': state.data.day,
          'form[person_ payments][0][0][fields][date][month]': state.data.month,
          'form[person_ payments][0][0][fields][date][year]': state.data.year,
          'form[person_payments][0][0][fields][amount]': state => {
            console.log('Do some calculation in here?');
            return state.data.salary / 12;
          },
          'form[person_payments][0][0][fields][status]': state => {
            if (state.data.success === true) {
              return 'initiated';
            }
            return 'failed';
          },
        },
      });
    }
  )
);
