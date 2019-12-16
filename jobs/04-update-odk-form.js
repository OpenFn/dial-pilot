// Your job goes here.
console.log('State:', state.response.body);
get('http://167.71.88.252/formXml?formId=registrion_form', {
  callback: function (state) {
    console.log('Returned state:', state.response.body);
    const template = state.response.body;

    post('http://167.71.88.252/formUpload', {
      headers: formData.getHeaders(),
      formData: {
        'form_def_file': template
      },
    });
  }
});