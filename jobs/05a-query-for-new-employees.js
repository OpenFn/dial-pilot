sqlString(state => {
  return "SELECT person_id, person_name, msisdn, status FROM employee_updates WHERE status='NEW';";
});

sqlString(state => {
  return `UPDATE employee_updates SET status='PROCESSED' WHERE status='NEW'`;
});