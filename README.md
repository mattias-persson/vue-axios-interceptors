# vue-axios-interceptors
Catch and handle ajax errors globally when using `Axios` with `Vue`.

### Installation
```bash
npm install vue-axios-interceptors --save
// or
yarn add url-parameters
```

```javascript
// Make sure you import this package after you've imported Vue:
window.Vue = require('vue');

require('vue-axios-interceptors');

// Make sure the axios package is available globally on the window object:
window.axios = require('axios');
```

### Usage
The package registers a new global event bus called `intercepted` on the `window` object and emits several events on it when an ajax call leads to an error. You can easily listen for these events to build a smooth error handling workflow, for example in a global component responsible for displaying error messages:

```javascript
// ErrorMessages.vue
mounted() {
    window.intercepted.$on('response', data => {
        console.log(data); // { status: 404, code: 'Not found', body: null }
        
        // Display the message.
    });
}
```

You can also listen for specific status codes and response categories, for example if you'd like to handle 4xx responses differently than 5xx responses:
```javascript
// Listen for any intercepted responses.
window.intercepted.$on('response', data => {
  // 
});

// Listen for any intercepted responses under the Client Error category (4xx).
window.intercepted.$on('response:client-error', data => {
  // 
});

// Listen for any intercepted responses under the Server Error category (5xx).
window.intercepted.$on('response:5xx', data => {
  // 
});

// Listen for a specific status.
window.intercepted.$on('response:404', data => {
  // 
});

// Listen for a specific HTTP code.
window.intercepted.$on('response:unprocessable-entity', data => {
  // 
});
```

For a complete list of status codes, visit https://httpstatuses.com/.

### Using this package with Laravel
If you're using Laravel >=5.5 as your backend, you're in luck. If your server returns a `422` response (typically a validation error), the package will automatically parse the returned failures into a flat array which you can access on `data.body`. This is way simpler to iterate through in order to display the messages than the original error message structure.