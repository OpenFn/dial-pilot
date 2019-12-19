sqlString(state => {
  console.log(state);
  const record_id=`SELECT record FROM entry WHERE string_value=#${state.transactionId}`;
  console.log(record_id);
});