// Your job goes here.
get(
  'http://209.97.153.241/formXml',
  {
    query: {
      formId: 'evaluation_form',
    },
  },
  state => {
    let template = state.data.body;
    let templateUpdated = false;

    const itemEx = /<item>\s?<label>[^<>]*<\/label>\s?<value>[^<>]*<\/value>\s?<\/item>/gi;
    const itemMatches = template.match(itemEx);

    const selectUserEx = /<select1\s+ref="\/EvaluationForm\/social_worker_id">/gi;

    console.log(`Receiving ${state.new_employees.length} new data!`);

    for (let j = 0; j < state.new_employees.length; j++) {
      let userExists = false;

      let userId = state.new_employees[j].person_id.split('|')[1];
      console.log(`Processing user: ${userId}.`);

      for (let i = 0; i < itemMatches.length; i++) {
        if (itemMatches[i].indexOf(userId) >= 0) {
          userExists = true;
        }
      }

      if (!userExists) {
        const selectUserMatches = template.match(selectUserEx);
        const msisdn = state.new_employees[j].msisdn;
        const userItem =
          `<item><label>${state.new_employees[j].person_name}</label><value>${userId}_${msisdn}</value></item>`;
        console.log(`Adding user: ${userItem}.`);
        template = template.replace(
          selectUserEx,
          selectUserMatches[0] + userItem
        );
        templateUpdated = true;
      } else {
        console.log('Not seeing any user to add. Moving along!');
      }
    }

    if (templateUpdated) {
      const versionEx = /id="\S+"\s+version="(\S+)"/;
      const versionMatches = template.match(versionEx);
      const currentVersion = Number.parseInt(versionMatches[1]);
      console.log(`Updating form version from: ${currentVersion}`);
      template = template.replace(currentVersion, currentVersion + 1);
    }

    state.template = template;
    return state;
  }
);

post('http://209.97.153.241/formUpload', {
  formData: state => {
    return {
      form_def_file: {
        value: state.template,
        options: {
          filename: 'evaluation_form.xml'
        }
      }
    };
  },
});
