// Your job goes here.
const cheerio = require('cheerio');

get('http://167.71.88.252/formXml?formId=registrion_form', {
  callback: function (state) {
    const template = state.data.data;
    const $ = cheerio.load(template, { xmlMode: true });

    // This part to remove a position.
    const positionSelect = $('select1[ref="/RegistrationForm/position"]');
    if (positionSelect.text().indexOf('10389-100000') >= 0) {
      $('item', positionSelect).each((_item, element) => {
        console.log(`Processing item: ${$(element).html()}`);
        if ($(element).text().indexOf('10389-100000') >= 0) {
          const removedItem = $(element).remove();
          console.log(`Removed item: ${$(removedItem).html()}`);
        }
      });
    }

    // This part to add a position.
    positionSelect.append(
      `<item>
             <label>Social Worker</label>
             <value>10389-100000</value>
           </item>`
    );

    const currentVersion = $('RegistrationForm').attr('version');
    $('RegistrationForm').attr('version', parseInt(currentVersion) + 1);

    const formData = new FormData();
    formData.append('form_def_file', $.html(), 'registration_form.xml');

    const formHeaders = formData.getHeaders();
    post('http://167.71.88.252/formUpload', {
      headers: {
        ...formHeaders,
      },
      formData: formData,
    });
  }
});