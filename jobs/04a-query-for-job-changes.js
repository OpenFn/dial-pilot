sqlString(state => {
  return "SELECT position_id, position_name, salary, facility_id, facility_name, status FROM position_updates WHERE status='NEW';";
});

alterState(state => {
  state.new_jobs = state.response.body;
  console.log(state.new_jobs);
  return state;
})

sqlString(state => {
  return `UPDATE position_updates SET status='PROCESSED' WHERE status='NEW'`;
});