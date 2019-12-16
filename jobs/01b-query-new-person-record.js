sqlString(state => {
  // The person information is in state from the previous operation
  return (
    `SELECT id FROM hippo_person WHERE firstname='` +
    state.data.data[0].first_name +
    `' AND othername='` +
    state.data.data[0].middle_name +
    `' AND surname='` +
    state.data.data[0].last_name +
    `'`
  );
});

alterState(state => {
  // Note: we pluck out on the 'RowDataResponses' from the SQL server.
  const personData = state.response.body.filter(x => x.id !== undefined);
  // Get the first record
  state.data.person_id = personData[0] && personData[0].id
  return state;
});
