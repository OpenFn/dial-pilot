sqlString(state => {
  return "SELECT position, facility, status FROM position_updates WHERE status='NEW';";
});

// alterState(state => {
//   state.data.open_positions = JSON.parse(JSON.stringify(state.response.body));
//   return state;
// });

// QUESTION: Should we wait to do this update until after we've done things in Mifos?
// sqlString(state => {
//   // stored procedure will return a list of names, phone numbers (MSISDN), and salary info for employees that should be paid today
//   return `UPDATE position_updates SET status='PROCESSED' WHERE status='NEW'`;
// });