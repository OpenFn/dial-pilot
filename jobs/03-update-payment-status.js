sqlString(state => {
  console.log(state.data.transactionCode);
  return `SELECT record FROM entry WHERE string_value='${state.data.transactionCode}'`;
});

alterState(state => {
  // Note: we pluck out on the 'RowDataResponses' from the SQL server.
  const record = state.response.body.filter(x => x.id !== undefined);
  // Get the first record
  state.data.record = record
   return state;
});

sqlString(state => {
  console.log(state);
})