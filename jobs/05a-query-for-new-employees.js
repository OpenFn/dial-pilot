sqlString(state => {
  return "SELECT person_id, person_name, msisdn, status FROM employee_updates WHERE status='NEW';";
});

alterState(state => {
  state.new_employees = state.response.body;
  console.log(state.new_employees);
  return state;
})

sqlString(state => {
  return `UPDATE employee_updates SET status='PROCESSED' WHERE status='NEW'`;
});