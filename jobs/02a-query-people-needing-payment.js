
sqlString(state => {

  // get phone number records 
  return 'SELECT id, start_date FROM hippo_person_position';
  // + `WHERE start_date = '${new Date().toString()}' and age(last_payment_date) > '30 days'`
});

alterState(state => {
  // Note: we pluck out on the 'RowDataResponses' from the SQL server.
  state.data.records = state.response.body.filter(x => x.id !== undefined);
  return state;
});
