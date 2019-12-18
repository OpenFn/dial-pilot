// Your job goes here.
get(
  'http://167.71.88.252/formXml',
  {
    query: {
      formId: 'registration_form',
    },
  },
  state => {
    let template = state.data.body;
    let templateUpdated = false;
    
    console.log('Start processing state ...');

    const itemEx = /<item>\s?<label>[^<>]*<\/label>\s?<value>[^<>]*<\/value>\s?<\/item>/gi;
    const itemMatches = template.match(itemEx);

    const selectFacilityEx = /<select1\s+ref="\/RegistrationForm\/position_facility">/gi;
    const selectPositionEx = /<select1\s+ref="\/RegistrationForm\/position">/gi;

    console.log(`Receiving ${state.response.body.length} new data!`);

    for(let j = 0; j < state.response.body.length; j ++) {
      let facilityExists = false;
      let positionExists = false;

      let facilityId = state.response.body[j].facility_id;
      console.log(`Processing facility: ${facilityId}.`);

      const positions = state.response.body[j].position_id.split('|'); 
      const salaries = state.response.body[j].salary.split('=');

      let positionId = `${positions[1]}_${salaries[1]}`;
      console.log(`Processing position: ${positionId}.`);
      for(let i = 0; i < itemMatches.length; i ++) {
        if (itemMatches[i].indexOf(facilityId) >= 0) {
          facilityExists = true;
        }
        if (itemMatches[i].indexOf(positionId) >= 0) {
          positionExists = true;
        }
      }

      if (!facilityExists) {
        const selectFacilityMatches = template.match(selectFacilityEx);
        const facilityItem = 
          `<item><label>${state.response.body[j].facility_name}</label><value>${facilityId}</value></item>`;
        console.log(`Adding facility: ${facilityItem}.`);
        template = template.replace(
          selectFacilityEx,
          selectFacilityMatches[0] + facilityItem
        );
        templateUpdated = true;
      } else {
        console.log('Not seeing any facility to add. Moving along!');
      }

      if (!positionExists) {
        const selectPositionMatches = template.match(selectPositionEx);
        const positionItem =
          `<item><label>${state.response.body[j].position_name}</label><value>${positionId}</value></item>`;
        console.log(`Adding position: ${positionItem}.`);
        template = template.replace(
          selectPositionEx,
          selectPositionMatches[0] + positionItem
        );
        templateUpdated = true;
      } else {
        console.log('Not seeing any position to add. Moving along!');
      }
    }

    if (templateUpdated) {
      const versionEx = /id="\S+"\s+version="(\S+)"/;
      const versionMatches = template.match(versionEx);
      const currentVersion = Number.parseInt(versionMatches[1]);
      console.log(`Updating form version from: ${currentVersion}`);
      template = template.replace(currentVersion, currentVersion + 1);
    }
    
    state.templateUpdated = templateUpdated;
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
          filename: 'registration_form.xml'
        }
      }
    };
  },
});
