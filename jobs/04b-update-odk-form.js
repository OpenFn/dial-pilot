// Your job goes here.
get(
  'http://209.97.153.241//formXml',
  {
    query: {
      formId: 'registration_form',
    },
  },
  state => {
    console.log('Start processing state and form template!');

    let template = state.data.body;
    let templateUpdated = false;

    const itemEx = /<item>\s?<label>[^<>]*<\/label>\s?<value>[^<>]*<\/value>\s?<\/item>/gi;
    const itemMatches = template.match(itemEx);

    const selectFacilityEx = /<select1\s+ref="\/RegistrationForm\/position_facility">/gi;
    const selectPositionEx = /<select1\s+ref="\/RegistrationForm\/position">/gi;

    console.log(`Received ${state.new_jobs.length} new data!`);

    for(let j = 0; j < state.new_jobs.length; j ++) {
      let facilityExists = false;
      let positionExists = false;

      let facilityId = state.new_jobs[j].facility_id;
      console.log(`Processing facility: ${facilityId}.`);

      const positions = state.new_jobs[j].position_id.split('|'); 
      const salaries = state.new_jobs[j].salary.split('=');

      let positionId = `${positions[1]}_${salaries[1]}`;
      console.log(`Processing position: ${positionId}.`);
      for(let i = 0; i < itemMatches.length; i ++) {
        if (itemMatches[i].indexOf(facilityId) >= 0) {
          facilityExists = true;
        }
        if (itemMatches[i].indexOf(positionId) >= 0) {
          if (state.new_jobs[j].status === 'CLOSED') {
            console.log(`Removing closed position: ${positionId}.`);
            template = template.replace(itemMatches[i], '');
            templateUpdated = true;
          }
          positionExists = true;
        }
      }

      if (!facilityExists) {
        const selectFacilityMatches = template.match(selectFacilityEx);
        const facilityItem = 
          `<item><label>${state.new_jobs[j].facility_name}</label><value>${facilityId}</value></item>`;
        console.log(`Adding facility: ${facilityItem}.`);
        template = template.replace(
          selectFacilityEx,
          selectFacilityMatches[0] + facilityItem
        );
        templateUpdated = true;
      } else {
        console.log('Not seeing any facility to add. Moving along!');
      }

      if (!positionExists && state.new_jobs[j].status === 'NEW') {
        const selectPositionMatches = template.match(selectPositionEx);
        const positionItem =
          `<item><label>${state.new_jobs[j].position_name}</label><value>${positionId}</value></item>`;
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
    
    state.template = template;
    return state;
  }
);

post('http://209.97.153.241//formUpload', {
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
