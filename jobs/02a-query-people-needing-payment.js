
sqlString(state => {
  // stored procedure will return a list of names, phone numbers (MSISDN), and salary info for employees that should be paid today
  return 'CALL get_employees_to_pay();';
});

//alterState(state => {
  // Note: we pluck out on the 'RowDataResponses' from the SQL server.
//  state.data.records = state.response.body[0];
//  return state;
//});