$(document.forms["reg-form"]).on("submit", function(){
		var form = $(this);

		$(".error", form).html("");
		$(":submit", form).button("loading");

		$.ajax({
			url: "/reg",
			method: "POST",
			data: form.serialize(),
			complete: function(){
				$(":submit", form).button("reset");
			},
			statusCode: {
				200: function(){
					form.html("You in site").addClass("alert-success");
					window.location.href = "/"
				},
				403: function(jqXHR){
					console.log(jqXHR.responseText);
					var error = JSON.parse(jqXHR.responseText);
					$(".error", form).html(error.message);
				}
			}
		});
		return false;
	});