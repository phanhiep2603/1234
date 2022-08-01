$(document).ready(function() {
	$('#dataTables-example').DataTable({
		responsive: true
	});
});

$("div.alert").delay(3000).slideUp();

function xacnhanxoa(msg) {
	if(window.confirm(msg)) {
		return true;
	}
	return false;
}
$(document).ready( function () {
   $('#addImages').click(function(){
      $('#insert').append('<div class="form-group"><input type="file" name="fEditDetail[]"></div>');
   });
});

$(document).ready( function () {
   $('#addSizes').click(function(){
      $('#insertSize').append('<div class="form-group">Input Size <input type="text" name="SizeAddDetail[]"></div>');
   });
});

$(document).ready( function () {
   $('a#del_image').on('click',(function(){
      var url = "http://localhost/shopbh/admin/product/delimg/";
      var _token = $("form[name='frmEditProduct']").find("input[name='_token']").val();
      var idImg = $(this).parent().find("img").attr("idImg");
      var img = $(this).parent().find("img").attr("src");
      var rid = $(this).parent().find("img").attr("id");
      $.ajax({
      	url: url + idImg,
      	type: 'GET',
      	cache: false,
      	data: {"_token": _token,"idImg": idImg,"urlImg": img},
      	success: function(data) {
      		if(data == "Ok!"){
      			$("#"+rid).remove();
      		}else{
      			alert("Error!");
      		}
      	}
      });
   }));
});