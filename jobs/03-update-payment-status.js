sqlString(state => {
  console.log(state.data.transactionCode);
  return `SELECT record FROM entry WHERE string_value='${state.data.transactionCode}'`;
});

sqlString(state => {
  console.log(state.data.body);
  return `UPDATE entry SET string_value='completed' where record=${state.data.record} and string_value='initiated'`;
})