// Your job goes here.
var cheerio = require('cheerio')
const template = results.data;
const $ = cheerio.load(template, {xmlMode: true});

console.log('State:', state.response.body);
get('http://167.71.88.252/formXml?formId=registrion_form', {
  callback: function (state) {
    console.log('Returned state:', state.response.body);
    let template = state.response.body;
    
    let boundary = '--------------------------';
    for (var i = 0; i < 24; i++) {
      boundary += Math.floor(Math.random() * 10).toString(16);
    }
    
    console.log('String:', String);
    for (const property in String) {
      console.log('String props: ', property);
    }
    console.log('Substr:', template.substr);
    console.log('Substring:', template.substring);
    console.log('Replace:', template.replace);
    
    let indexOfVersion = template.lastIndexOf('version');
    // find the version code.
    while(template.substr(indexOfVersion, indexOfVersion + 1) < '0'
          || template.substr(indexOfVersion, indexOfVersion + 1) > '9'
          && indexOfVersion < template.length) {
      indexOfVersion = indexOfVersion + 1;
    }

    let currentVersion = '';
    while(template.substr(indexOfVersion, indexOfVersion + 1) >= '0'
          && template.substr(indexOfVersion, indexOfVersion + 1) <= '9'
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