sqlString(state => {
  return "SELECT position_id, position_name, salary, facility_id, facility_name, status FROM position_updates WHERE status='NEW';";
});

// alterState(state => {
//   state.data.open_positions = JSON.parse(JSON.stringify(state.response.body));
//   return state;
// });

// QUESTION: Should we wait to do this update until after we've done things in Mifos?
//   SC: This is the job that runs when a new position is created in iHRIS, so no Mifos calls needed (sorry the comment below was misleading)
// sqlString(state => {
//   return `UPDATE position_updates SET status='PROCESSED' WHERE status='NEW'`;
// });