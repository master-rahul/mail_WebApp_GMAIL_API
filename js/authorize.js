var YOUR_CLIENT_ID = '358956356096-0v8h0vu7alqn4cbe540v22mvt7mp7tg6.apps.googleusercontent.com';
var YOUR_REDIRECT_URI = 'http://localhost:8000/options/';

function oauth2SignIn() {
    var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';    // Google OAuth 2.0 endpoint 
    var form = document.createElement('form');      // Form to send request to Google OAuth 2.0 endpoint, We can use direct url including all data in params
    form.setAttribute('method', 'POST');
    form.setAttribute('action', oauth2Endpoint);

    // Parameters to pass to OAuth 2.0 endpoint.
    var params = {
        'client_id': YOUR_CLIENT_ID,
        'redirect_uri': YOUR_REDIRECT_URI,
        'scope': 'https://mail.google.com',
        'state': 'try_sample_request',
        'include_granted_scopes': 'true',
        'response_type': 'token',
        //'login_hint': `${mailData.sender.value}`

    };
    // Add form parameters as hidden input values.
    for (var p in params) {
        var input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
    }
    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
}