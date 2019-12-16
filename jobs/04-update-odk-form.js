// Your job goes here.
console.log('State:', state.response.body);
get('http://167.71.88.252/formXml?formId=registrion_form', {
  callback: function (state) {
    console.log('Returned state:', state.response.body);
    let template = state.response.body;
    
    let boundary = '--------------------------';
    for (var i = 0; i < 24; i++) {
      boundary += Math.floor(Math.random() * 10).toString(16);
    }
    
    const version = /id=\S+ version="(\S+)"/;
    const matches = version.exec(template);
    console.log(matches);
    
    const currentVersion = Number.parseInt(matches[1]);
    
    template = template.replace(matches[1], currentVersion + 1);

    post('http://167.71.88.252/formUpload', {
      headers: {
        'content-type': 'multipart/form-data; boundary=' + boundary
      },
      formData: {
        'form_def_file': template
      },
      options: {
        successCodes: [201],
      }
    });
  }
});
