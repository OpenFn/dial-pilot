sqlString(state => {
  return "SELECT position_id, position_name, salary, facility_id, facility_name, status FROM position_updates WHERE status='NEW';";
});

sqlString(state => {
  return `UPDATE position_updates SET status='PROCESSED' WHERE status='NEW'`;
});