// Your job goes here.
console.log('State:', state.response.body);
get('http://167.71.88.252/formXml?formId=registrion_form', {
  callback: function (state) {
    console.log('Returned state:', state.data.body);
    let template = state.response.body.toString();
    
    let boundary = '--------------------------';
    for (var i = 0; i < 24; i++) {
      boundary += Math.floor(Math.random() * 10).toString(16);
    }

    let indexOfVersion = template.lastIndexOf('version');
    // find the version code.
    console.log(indexOfVersion);
    console.log('Current version: ', currentVersion);

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
