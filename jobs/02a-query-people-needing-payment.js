sqlString(state => {
   return 'SELECT id, form FROM form_field WHERE form=(select id from form where name=`person_payments`) and field=(select id from field where name=`date`)'
});

alterState(state => {
  state.data.payment_date_field = state.response.body[0]
});

SELECT MAX(date_value) FROM entry WHERE record in (SELECT id)
sqlString(state => {
  // select all current employees who have been working for at least one week
  return 'SELECT id, parent, position FROM hippo_person_position WHERE start_date < DATE(DATE_SUB(NOW(), INTERVAL 7 DAY))';
});

alterState(state => {
  state.data.curr_employees = state.response.body.filter(x => x.id !== undefined);
});

state.data.curr_employees && state.data.curr_employees.map(employee => {
  // get last payment date for this employee
  sqlString
})

sqlString(state => {
  // select person_position records
  
  // get phone number records 
  return 'SELECT id, start_date FROM hippo_person_position';
  // + `WHERE start_date = '${new Date().toString()}' and age(last_payment_date) > '30 days'`
});

alterState(state => {
  // Note: we pluck out on the 'RowDataResponses' from the SQL server.
  state.data.records = state.response.body.filter(x => x.id !== undefined);
  return state;
});
