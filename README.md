# express-render-static
Express middleware to automatically render templates.
Functions similar to serve-static (express.static) but instead of sending the file, the res.render method of express is invoked.

# Usage
A minimal example would look like this:
```
var express = require('express');
var app = express();
var path = require('path');
var renderStatic = require('express-render-static');
var config = {
  extension: 'jade',
  locals: {...}
};

app.set('view engine', 'jade');
app.use('/render', renderStatic(path.join(__dirname, '/templates'), config);

app.listen(3000, function () {
  console.log('server running');
});
```
Now calls to `/render/file.jade` will invoke
`res.render(path.join(__dirname, '/templates', '/file.jade'), config.locals)`. If the call does not match the file extension (or req.method !== 'GET'), next() will be called.

The `config` argument is optional and will default to `{extension: 'jade', locals: {}}`.
