sqlString(state => {
  console.log(state.data.transactionCode);
  return `SELECT record FROM entry WHERE string_value='${state.data.transactionCode}'`;
});

alterState(state => {
  // Note: we pluck out on the 'RowDataResponses' from the SQL server.
  const record = state.RowDataPacket[0];
  // Get the first record
  state.data.record = record
  return state;
});

sqlString(state => {
  console.log(state.data.record);
  return `UPDATE entry SET string_value='completed' where record=${state.data.record} and string_value='initiated'`;
})