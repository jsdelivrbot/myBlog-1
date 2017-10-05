$(window).load(function () {
	$(".logout").click(function(){
		var form = $("<form method=POST action=/logout>");
		$(document.body).append(form);
		form.submit();
		return false;
	});
	$(document.forms["comment-form"]).on("submit", function(){
		var form = $(this);

		$(".error", form).html("");
		$(":submit", form).button("loading");

		$.ajax({
			url: "/comment",
			method: "POST",
			data: form.serialize(),
			complete: function(){
				$(":submit", form).button("reset");
			},
			statusCode: {
				200: function(){
					form.html("");
					window.location.reload();
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
	$(document.forms["delete-comment-form"]).on("submit", function(){
		var form = $(this);

		$(".delete-error", form).html("");
		$(":submit", form).button("loading");

		$.ajax({
			url: "/deleteComment",
			method: "POST",
			data: form.serialize(),
			complete: function(){
				$(":submit", form).button("reset");
			},
			statusCode: {
				200: function(){
					window.location.reload();
				},
				403: function(jqXHR){
					console.log(jqXHR.responseText);
					var error = JSON.parse(jqXHR.responseText);
					$(".delete-error", form).html(error.message);
				}
			}
		});
		return false;
	});
})