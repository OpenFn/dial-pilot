sqlString(state => {
  return `SELECT name, start_date, salary FROM hippo_person_position
    WHERE start_date = ${new Date()} and age(last_payment_date) > '30 days'`;
});

alterState(state => {
  console.log(state.references);
  return state;
});
