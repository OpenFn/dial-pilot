// Pluck out parts of the ODK submission and prepare our 'person_postion' object that we
// will use in multiple requests to iHRIS. =====================================
alterState(state => {
  // The position field in the form holds the position ID and the salary
  const positionData = state.data.RegistrationForm.position.split('_');
  const startDateComponents = state.data.RegistrationForm.start_date.split('-')
  console.log(positionData)
  console.log(startDateComponents)
  console.log(state.data.person_id)
  state.person_position = {
    'form[person_position][0][0][fields][id]': 'person_position|0',
    'form[person_position][0][0][fields][parent]': state.data.person_id,
    'form[person_position][0][0][fields][position]': 'position|'+positionData[0],
    'form[person_position][0][0][fields][start_date][day]': startDateComponents[2],
    'form[person_position][0][0][fields][start_date][month]': startDateComponents[1],
    'form[person_position][0][0][fields][start_date][year]': startDateComponents[0],
    'form[salary][0][0][fields][salary]': 'currency|3='+positionData[1]
  };
  return state;
});

// =============================================================================
// Create records via iHRIS api, with the hostUrl, port, and authentication
// handled by the credential ===================================================
post(
  '/manage/make_offer',
  {
    formData: state => {
      state.person_position.submit_type = 'confirm';
      state.person_position.can_edit_position = '1';
      return state.person_position;
    },
  },
  post('/manage/make_offer', {
    formData: state => {
      state.person_position.submit_type = 'save';
      return state.person_position;
    },
    options: {
      successCodes: [302],
    },
  })
);
