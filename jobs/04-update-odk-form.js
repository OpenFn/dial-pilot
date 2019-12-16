// Your job goes here.
console.log('State:', state.response.body);
get(
  'http://167.71.88.252/formXml',
  {
    query: {
      formId: 'registrion_form'
    }
  },
  function (state) {
    let template = state.data.body;

    const versionEx = /id="\S+"\s+version="(\S+)"/;
    const versionMatches = template.match(versionEx);

    const currentVersion = Number.parseInt(versionMatches[1]);
    template = template.replace(currentVersion, currentVersion + 1);

    const positionEx = /<item>\s+<label>[^<>]*<\/label>\s+<value>[^<>]*<\/value>\s+<\/item>/gi;
    const positionMatches = template.match(positionEx);
    template = template.replace(positionEx, '');

    console.log('Remove select:');
    console.log(template);

    const selectEx = /<select1\s+ref="\/RegistrationForm\/position">/gi;
    const selectMatches = template.match(selectEx);
    template = template.replace(selectEx, selectMatches[0] + positionMatches[0]);

    console.log('Add select:');
    console.log(selectMatches);
    console.log(template);


    post(
      'http://167.71.88.252/formUpload',
      {
        formData: {
          form_def_file: state.template
        }
      },
      function(state) {
        console.log(state);
      }
    );
  }
);
