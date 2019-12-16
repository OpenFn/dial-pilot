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
    const matches = template.match(versionEx);

    const currentVersion = Number.parseInt(matches[1]);
    template = template.replace(currentVersion, currentVersion + 1);

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
