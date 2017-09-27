var Person = require('../app/controllers/person');

module.exports = function (app) {

    app.post('/person/add', Person.add);
    app.get('/person/list', Person.list);
    app.delete('/person/del', Person.del);
};
