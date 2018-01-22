$.extend({
  hint:  function(type, msg){
    var htm = `<div class="alert alert-${type}">${msg}</div>`
    $('body').append(htm);
  }
})