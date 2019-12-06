// @trigger 'odk submission' either via Aggregate JSON Forwarding or via direct
//          submission to OpenFn.org/inbox
// @credential 'ihris'
// @adaptor 'http'
// -----------------------------------------------------------------------------

// =============================================================================
// Pluck out parts of the ODK submission and prepare our 'person' object that we
// will use in multiple requests to iHRIS. =====================================
alterState(state => {
  state.person = {
    'form[person][0][0][fields][id]': 'person|0',
    'form[person][0][0][fields][surname]': state.data.lastName,
    'form[person][0][0][fields][firstname]': state.data.firstName,
    'form[person][0][0][fields][othername]': state.data.other,
    'form[person][0][0][fields][nationality]': 'country|AS',
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
  })
);
