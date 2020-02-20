sqlString(state => {
  // The person information is in state from the previous operation
  console.log(state.references[0].RegistrationForm)
  return (
    `SELECT id FROM hippo_person WHERE firstname='` +
    state.references[0].RegistrationForm.first_name +
    `' AND surname='` +
    state.references[0].RegistrationForm.last_name +
    `'`
  );
});

alterState(state => {
  // Note: we pluck out on the 'RowDataResponses' from the SQL server.
  const personData = state.response.body;
  console.log(personData);
  // Get the first record
  state.data.person_id = personData[0] && personData[0].id
   return state;
});
