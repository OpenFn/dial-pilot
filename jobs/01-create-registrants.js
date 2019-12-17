// @trigger 'odk submission' either via Aggregate JSON Forwarding or via direct
//          submission to OpenFn.org/inbox
// @credential 'ihris'
// @adaptor 'http'
// -----------------------------------------------------------------------------

// =============================================================================
// Pluck out parts of the ODK submission and prepare our 'person' object that we
// will use in multiple requests to iHRIS. =====================================
console.log(JSON.stringify(state.data))
alterState(state => {
  state.person = {
    'form[person][0][0][fields][id]': 'person|0',
    'form[person][0][0][fields][surname]': state.data.RegistrationForm.last_name,
    'form[person][0][0][fields][firstname]': state.data.RegistrationForm.first_name,
    'form[person][0][0][fields][othername]': state.data.RegistrationForm.middle_name,
    'form[person][0][0][fields][nationality]': `country|${state.data.RegistrationForm.region}`,
    'form[person][0][0][fields][residence]': 'district|3',
  };
  return state;
});

// =============================================================================
// Create records via iHRIS api, with the hostUrl, port, and authentication
// handled by the credential ===================================================
post(
  '/manage/person',
  {
    formData: state => {
      state.person.submit_type = 'confirm';
      return state.person;
    },
  },
  post('/manage/person', {
    formData: state => {
      state.person.submit_type = 'save';
      return state.person;
    },
    options: {
      successCodes: [302],
    },
  })
);

