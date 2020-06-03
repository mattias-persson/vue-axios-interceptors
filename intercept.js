try {
    window.intercepted = new Vue();
} catch (e){
    console.error('Require vue-axios-interceptors after you require Vue.');
}

window.axios.interceptors.response.use(function (response) {
    handleResponse(response);
    
    return response;
}, function (error) {
    handleResponse(error.response);
        
    return Promise.reject(error);
});

function handleResponse(response){
    var categories = ['informational', 'success', 'redirection', 'client-error', 'server-error'];
    var status = response ? response.status : null;
    var codes = statusCodes();

    if(!status || !codes[status]){
        return false;
    }

    var statusCategory = parseInt(status.toString().charAt(0));
    var category = categories[statusCategory - 1];
    var sluggedCode = slugify(codes[status]);
    var data = {status: status, code: codes[status], body: response.data};

    // Parse the validation errors.
    if(parseInt(status) === 422){
        data.body = handleValidationErrors(response);
    }

    window.intercepted.$emit('response', data);
    window.intercepted.$emit('response:' + category, data);
    window.intercepted.$emit('response:' + sluggedCode, data);
    window.intercepted.$emit('response:' + status, data);
    window.intercepted.$emit('response:' + statusCategory + 'xx', data);

    return true;
}

function handleValidationErrors(response){
    if(!response.data){
        return null;
    }

    // Attempt to parse Laravel-structured validation errors.
    try {
        let messages = [];
      
        for(var key in response.data.errors){
            response.data.errors[key].map(function(message){
                messages.push(message);
            });
        }

        return messages;
    } catch (e) {
        return response.data;
    }
}

function slugify(string){
    return string.toString().toLowerCase().trim()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/&/g, '-and-')         // Replace & with 'and'
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-'); 
}

function statusCodes(){
    return {
        '100': 'Continue',
        '101': 'Switching Protocols',
        '102': 'Processing',

        '200': 'OK',
        '201': 'Created',
        '202': 'Accepted',
        '203': 'Non-authoritative Information',
        '204': 'No Content',
        '205': 'Reset Content',
        '206': 'Partial Content',
        '207': 'Multi-Status',
        '208': 'Already Reported',
        '226': 'IM Used',

        '300': 'Multiple Choices',
        '301': 'Moved Permanently',
        '302': 'Found',
        '303': 'See Other',
        '304': 'Not Modified',
        '305': 'Use Proxy',
        '307': 'Temporary Redirect',
        '308': 'Permanent Redirect',

        '400': 'Bad Request',
        '401': 'Unauthorized',
        '402': 'Payment Required',
        '403': 'Forbidden',
        '404': 'Not Found',
        '405': 'Method Not Allowed',
        '406': 'Not Acceptable',
        '407': 'Proxy Authentication Required',
        '408': 'Request Timeout',
        '409': 'Conflict',
        '410': 'Gone',
        '411': 'Length Required',
        '412': 'Precondition Failed',
        '413': 'Payload Too Large',
        '414': 'Request-URI Too Long',
        '415': 'Unsupported Media Type',
        '416': 'Requested Range Not Satisfiable',
        '417': 'Expectation Failed',
        '418': 'I\'m a teapot',
        '421': 'Misdirected Request',
        '422': 'Unprocessable Entity',
        '423': 'Locked',
        '424': 'Failed Dependency',
        '426': 'Upgrade Required',
        '428': 'Precondition Required',
        '429': 'Too Many Requests',
        '431': 'Request Header Fields Too Large',
        '444': 'Connection Closed Without Response',
        '451': 'Unavailable For Legal Reasons',
        '499': 'Client Closed Request',

        '500': 'Internal Server Error',
        '501': 'Not Implemented',
        '502': 'Bad Gateway',
        '503': 'Service Unavailable',
        '504': 'Gateway Timeout',
        '505': 'HTTP Version Not Supported',
        '506': 'Variant Also Negotiates',
        '507': 'Insufficient Storage',
        '508': 'Loop Detected',
        '510': 'Not Extended',
        '511': 'Network Authentication Required',
        '599': 'Network Connect Timeout Error',
    };
}