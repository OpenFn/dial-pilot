sqlString(state => {
  console.log(state.data.transactionCode);
  return `SELECT record FROM entry WHERE string_value='${state.data.transactionCode}'`;
});

sqlString(state => {
  console.log(state);
})