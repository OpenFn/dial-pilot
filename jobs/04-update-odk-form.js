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
    
    let boundary = '--------------------------';
    for (var i = 0; i < 24; i++) {
      boundary += Math.floor(Math.random() * 10).toString(16);
    }

    const versionEx = /id="\S+"\s+version="(\S+)"/;
    const matches = template.match(versionEx);

    const currentVersion = Number.parseInt(matches[1]);
    template = template.replace(currentVersion, currentVersion + 1);

    alterState(state => {
      state.template = template;
      return state;
    });
  }
);

console.log('Template:');
console.log(state.template);

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
