$(document).ready(function(){
	$(".updatecart").click(function(){
		var rowId = $(this).attr('id');
		var qty = $(this).parent().parent().find(".qty").val();
		$.ajax({
			url: '/update-cart/',
			type: 'GET',
			cache: false,
			data: {"id":rowId,"qty":qty},
			success:function(data){
				if (typeof data == 'object') {
					window.location = "cart-info"
				}else{
					alert("Error!");
				}
			}
		});
	});
	
	const subTotal  = document.querySelector('.subTotal');
	const tax  = document.querySelector('.tax');
	const totalAmout  = document.querySelector('.totalamoutafter');
	const total = document.querySelectorAll('td.total');
	var result = 0;
	var stringvalue
	total.forEach( e => {
		stringvalue = e.innerText.slice(1);
		result += parseInt(stringvalue); 
	})
	if (subTotal) {
		subTotal.innerText = `$${result}`;
		const taxResult = result * 10/100;
		tax.innerText = `$${taxResult}`;
		const totalAmoutResult = result + taxResult;
		totalAmout.innerText = `$${totalAmoutResult}`
	}
});

