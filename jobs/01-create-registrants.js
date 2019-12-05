// @trigger 'odk submission' either via Aggregate JSON Forwarding or via direct
//          submission to OpenFn.org/inbox
// @credential 'ihris'
// @adaptor 'http'
// -----------------------------------------------------------------------------

// =============================================================================
// Create records via iHRIS api, with the hostUrl, port, and authentication
// handled by the credential ===================================================
post('/manage/person', {
  formData: {
    'form[person][0][0][fields][id]': 'person|0',
    'form[person][0][0][fields][surname]': 'something',
    'form[person][0][0][fields][firstname]': 'firsty',
    'form[person][0][0][fields][othername]': 'othery',
    'form[person][0][0][fields][nationality]': 'country|AS',
    'form[person][0][0][fields][residence]': 'district|3',
    'ajax_list_form[person][0][0][fields][residence][country]': 'country|UG',
    'ajax_list_form[person][0][0][fields][residence][district]': 'district|3',
    'ajax_list_form[person][0][0][fields][residence][county]': '',
  },
});
