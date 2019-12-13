sqlString(state => {
  // stored procedure will return a list of names, phone numbers (MSISDN), and salary info for employees that should be paid today
  return `SELECT position, facility, status FROM position_updates WHERE status='NEW'`;
});

alterState(state => {
  // Note: we pluck out on the 'RowDataResponses' from the SQL server.
  state.data.open_positions = state.response.body.filter(x => x.id !== undefined);
  return state;
});

sqlString(state => {
  // stored procedure will return a list of names, phone numbers (MSISDN), and salary info for employees that should be paid today
  return `UPDATE position_updates SET status='PROCESSED' WHERE status='NEW'`;
});