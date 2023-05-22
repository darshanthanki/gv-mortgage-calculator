jQuery(function($){
	// Get the modal
	var modal = $('#modalDialogCalc');

	// Get the button that opens the modal
	var btn = $("#newcalculate");

	// Get the <span> element that closes the modal
	var span = $(".close");

	$(document).ready(function(){
		// When the user clicks the button, open the modal 
		btn.on('click', function() {
			modal.show();
		});
		
		// When the user clicks on <span> (x), close the modal
		span.on('click', function() {
			$('#modalDialogCalc .modalcalc-content').animate({top: '800px'}, 1000);
			setTimeout(function(){
			modal.hide();
			$('#modalDialogCalc .modalcalc-content').removeAttr("style");
			},1100);
		});
	});

	// When the user clicks anywhere outside of the modal, close it
	$('body').bind('click', function(e){
		if($(e.target).hasClass("modalcalc")){
			$('#modalDialogCalc .modalcalc-content').animate({top: '800px'}, 1000);
			setTimeout(function(){
			modal.hide();
			$('#modalDialogCalc .modalcalc-content').removeAttr("style");
			},1100);
		}
	});
	$('.calc-r-slider').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 3000,
		arrows: false,
		dots: true,
	});
}); 
/*
var btn = document.querySelector(".modalcalc-right button");
var i = 0;
btn.onclick = function() {
	document.querySelector(".modalcalc-overlay").style.display = "block";
    document.querySelector(".calcprocess button").innerText = i;
    document.querySelector(".calcprocess button").classList.remove("finished");
    document.querySelector(".calcprocess button").classList.add("loading");
	
    var inter = setInterval(function() {
        document.querySelector(".calcprocess button").innerText = i++;
        document.querySelector(".calcprocess button").classList.remove('percent-' + (i - 1));
        document.querySelector(".calcprocess button").classList.add('percent-' + i);
        if (i === 100) {
            document.querySelector(".calcprocess button").classList.remove("loading");
            document.querySelector(".calcprocess button").classList.add("finished");
            document.querySelector(".calcprocess button").innerText = '';
            clearInterval(inter);
            i = 0;
            document.querySelector(".calcprocess button").classList.remove('percent-100');
			document.querySelector(".modalcalc-overlay").style.display = "none";
        }
    }, 100);
}
*/