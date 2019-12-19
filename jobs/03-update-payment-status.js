sqlString(state => {
  console.log(state.data.transactionCode);
  const record_id=`SELECT record FROM entry WHERE string_value=#${state.data.transactionCode}`;
  console.log(record_id);
});