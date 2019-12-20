// Your job goes here.
get(
  'http://167.71.88.252/formXml',
  {
    query: {
      formId: 'evaluation_form',
    },
  },
  state => {
    let template = state.data.body;
    let templateUpdated = false;

    console.log(state.new_employees)

    const itemEx = /<item>\s?<label>[^<>]*<\/label>\s?<value>[^<>]*<\/value>\s?<\/item>/gi;
    const itemMatches = template.match(itemEx);

    const selectUserEx = /<select1\s+ref="\/EvaluationForm\/social_worker_id">/gi;

    console.log(`Receiving ${state.response.body.length} new data!`);

    for (let j = 0; j < state.response.body.length; j++) {
      let userExists = false;

      let userId = state.response.body[j].person_id.split('|')[1];
      console.log(`Processing user: ${userId}.`);

      for (let i = 0; i < itemMatches.length; i++) {
        if (itemMatches[i].indexOf(userId) >= 0) {
          userExists = true;
        }
      }

      if (!userExists) {
        const selectUserMatches = template.match(selectUserEx);
        const msisdn = state.response.body[j].msisdn;
        const userItem =
          `<item><label>${state.response.body[j].person_name}</label><value>${userId}_${msisdn}</value></item>`;
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

post('http://167.71.88.252/formUpload', {
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
