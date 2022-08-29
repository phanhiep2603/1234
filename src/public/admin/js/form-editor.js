
var form = document.querySelector(".form-quills");
var introProduct = document.querySelector('input[name="introProduct"]');
var contentProduct = document.querySelector('input[name="contentProduct"]');

var categortiesintro = document.querySelector('#snow');
if (categortiesintro) {
    var snow = new Quill('#snow', {
        theme: 'snow'
    });
}

var categortiescontent = document.querySelector('#snow2');
if (categortiescontent) {
    var snow2 = new Quill('#snow2', {
        theme: 'snow'
    });
}


form.addEventListener('submit', function(e){
    introProduct.value = JSON.stringify(snow.getContents());
});


form.addEventListener('submit', function(e){
    contentProduct.value = JSON.stringify(snow2.getContents());
});

if(introProduct)
{
    if(introProduct.value)
{
    snow.setContents(JSON.parse(introProduct.value))
}
}

if(contentProduct) {
    if(contentProduct.value)
{
    snow2.setContents(JSON.parse(contentProduct.value))
}
}





