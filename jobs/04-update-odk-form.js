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
    
    let indexOfVersion = template.lastIndexOf('version');
    // find the version code.
    while(template.substring(indexOfVersion, indexOfVersion + 1) < '0'
          || template.substring(indexOfVersion, indexOfVersion + 1) > '9'
          && indexOfVersion < template.length) {
      indexOfVersion = indexOfVersion + 1;
    }

    let currentVersion = '';
    while(template.substring(indexOfVersion, indexOfVersion + 1) >= '0'
          && template.substring(indexOfVersion, indexOfVersion + 1) <= '9'
          && indexOfVersion < template.length) {
      currentVersion = currentVersion + template.charAt(indexOfVersion);
      indexOfVersion = indexOfVersion + 1;
    }
    
    template = template.replace(currentVersion, Number.parseInt(currentVersion) + 1);

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
