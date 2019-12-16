// Your job goes here.
console.log('State:', state);
get('http://167.71.88.252/formXml?formId=registrion_form', {
  callback: function (state) {
    console.log('Returned state:', state);
    const template = state.data.data;

    const formData = new FormData();
    formData.append('form_def_file', template, 'registration_form.xml');

    post('http://167.71.88.252/formUpload', {
      headers: formData.getHeaders(),
      formData: formData,
    });
  }
});