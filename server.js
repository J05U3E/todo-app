const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (err, req, res, next) { // middleware de error
  console.log(err);
  res.send('Algo salió mal');
});

app.listen(3001, function() {
  console.log('¡El servidor web está en servicio!');
});