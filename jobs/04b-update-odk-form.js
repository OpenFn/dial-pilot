// Your job goes here.
console.log('State:', state.response.body);
get(
  'http://167.71.88.252/formXml',
  {
    query: {
      formId: 'registration_form',
    },
  },
  state => {
    let template = state.data.body;

    const positionEx = /<item>\s+<label>[^<>]*<\/label>\s+<value>[^<>]*<\/value>\s+<\/item>/gi;
    const positionMatches = template.match(positionEx);
    template = template.replace(positionEx, '');

    const selectEx = /<select1\s+ref="\/RegistrationForm\/position">/gi;
    const selectMatches = template.match(selectEx);
    template = template.replace(
      selectEx,
      selectMatches[0] + positionMatches[0]
    );

    const versionEx = /id="\S+"\s+version="(\S+)"/;
    const versionMatches = template.match(versionEx);

    const currentVersion = Number.parseInt(versionMatches[1]);
    state.template = template.replace(currentVersion, currentVersion + 1);
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
