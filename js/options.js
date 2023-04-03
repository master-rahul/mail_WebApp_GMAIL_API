var params = {};
var regex = /([^&=]+)=([^&]*)/g, m;
var fragmentString = location.hash.substring(1);
var addRecieverValue = 0;
while (m = regex.exec(fragmentString)) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
}
if (Object.keys(params).length > 0) {
    localStorage.setItem('oauth2-test-params', JSON.stringify(params));
}

var sender = "";

function sendMail() {
    if (Object.keys(params).length <= 0) {
        console.log('Please Authorize First');
        return;
    }
    console.log('send mail option clicked');
    let newDom = sendMailDom();
    $('#div-body').append(newDom)
    anticipate($(' .mailing', newDom));
}
const anticipate = function (form) {
    const mailData = document.getElementById('mailData');
    $(form).submit(async (event) => {
        event.preventDefault();
        
        const call1 = await $.ajax({
            type: 'GET',
            url: 'https://www.googleapis.com/drive/v3/about?fields=user&' +
                'access_token=' + params['access_token'],
            success: function (response) {
                console.log(response.user.emailAddress);
                sender = response.user.emailAddress;
            },
            error: function (xhr, status, error) {
                console.log('Error: ' + error);
            }
        });
        console.log(form);
        console.log(form.serialize());
        const formData = new FormData(document.getElementById('mailData'));
        const call2 = $.ajax({
            type: 'POST',
            url: '/send',
            contentType: false,
            processData: false,
            data: formData,
            success: function (response) {
                console.log('hello');
            },
            error: function (xhr, status, error) {
                console.log('Error: ' + error);
            }
        });
    });
}


{/* <input name="addReciever" type="button" onclick="addReciever();" style="width: 32px; height: 33px; font-size: 1.1rem; padding: 5px 2px;" value="+">
    <br>
        <div id="recipents"></div> 
         <input id="attachement" type="file" name="fileData" placeholder="Attachements">
        <div style="display: flex;">
                            <div style="display: inline-flex;">Message:&nbsp;</div>
                            <div style="display: inline-flex;"><textarea name="message" placeholder="Type Your message here" required  style="font-size: 1rem; width: 818px; height: 400px"></textarea></div>
                        </div>
        */}

let sendMailDom = function(){
    return $(`<br><div style="border : 1px solid black; width: 940px; padding : 20px;">
                    <form action="/sendMail" method="POST" id="mailData" class="mailing" enctype="multipart/form-data">
                        From &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 
                        <input type="email" name="sender" placeholder="sender@gmail.com" required style="padding : 5px 10px; font-size: 1.1rem; margin-bottom: 5px; width:400px"> <br>
                        To &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 
                        <input type="email" name="receiver" placeholder="receiver@gmail.com" required style="padding : 5px 10px; font-size: 1.1rem; margin-bottom: 5px; width:800px"><br>
                        Subject &nbsp;: 
                        <input type="text" name="subject" placeholder="Subject.." required style="padding : 5px 10px; font-size: 1.1rem; margin-bottom: 5px; width:800px"> <br>
                        <br>
                        <div style="display: flex;">
                            <div style="display: inline-flex;">Message:&nbsp;</div>
                            <div style="display: inline-flex;"><textarea name="message" placeholder="Type Your message here" required  style="font-size: 1rem; width: 818px; height: 400px"></textarea></div>
                        </div>
                        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <input id="attachement" type="file" name="attachment" placeholder="Attachements" multiple>
                        <input type="hidden" name="access_token" value=${params['access_token']} style="margin : 10px;"> <br><br>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <input type="submit" value="Send" style="width: 80px; height: 30px; font-size: 1rem; padding: 5px 2px;">
                           
                    </form></div>
                `);
}

function viewDrafts() {
    if (Object.keys(params).length <= 0) {
        console.log('Please Authorize First');
        return;
    }
}
function viewInbox() {
    if (Object.keys(params).length <= 0) {
        console.log('Please Authorize First');
        return;
    }
    
}

function addReciever() {
    addRecieverValue++;
    console.log('add Reciever');
    $('#recipents').append(newRecepientDom);
}
let newRecepientDom = function () {
    return $(`
       <div id="${addRecieverValue}">
       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <input  type="email" name="receiver" placeholder="receiver@gmail.com" required style="padding : 5px 10px; font-size: 1.1rem; margin-bottom: 5px; width:800px">
        <input id="reciever-${addRecieverValue}" type="button" onclick="removeReciever(${addRecieverValue});" style="width: 32px; height: 33px; font-size: 1.1rem; padding: 5px 2px;" value="-">
        </div>
    `);
}
function removeReciever(num) {
    $(`#${num}`).remove();
   
}

var YOUR_CLIENT_ID = '358956356096-0v8h0vu7alqn4cbe540v22mvt7mp7tg6.apps.googleusercontent.com';
var YOUR_REDIRECT_URI = 'http://localhost:8000/options/';

function authorize() {
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









