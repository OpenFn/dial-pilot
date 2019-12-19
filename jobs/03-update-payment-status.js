sqlString(state => {
  console.log(state.data.transactionCode);
  return `SELECT record FROM entry WHERE string_value='${state.data.transactionCode}'`;
});

alterState(state => {
  // Note: we pluck out on the 'RowDataResponses' from the SQL server.
  const recordData = state.response.body.filter(x => x.record !== undefined);
  // Get the first record
  console.log(recordData);
  state.data.record = recordData[0] && recordData[0].record;
  return state;
});

sqlString(state => {
  console.log(state.data.body);
  return `UPDATE entry SET string_value='completed' where record=${state.data.record} and string_value='initiated'`;
});

sqlString(state => {
  console.log(state.data.body);
  return `UPDATE last_entry SET string_value='completed' where record=${state.data.record} and string_value='initiated'`;
});