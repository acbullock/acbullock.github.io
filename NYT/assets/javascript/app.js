var functionSearchNYT = function(q, limit, begin, end){
	var queryURL="https://api.nytimes.com/svc/search/v2/articlesearch.json";

	if(begin=="0101"){
		begin="18510101";
	}
	if(end=="1231"){
		end="20171231";
	}
	queryURL += '?' + $.param({
  		"api-key": "42bf7ba292424630b3592745169913dd",
  		"q": q,
  		"begin_date":begin,
  		"end_date":end
	});
	$.ajax({
		
  		url: queryURL,
  		method: 'GET',
	}).done(function(result) {
    $("#results").empty();
  		var articles = result.response.docs;
  		if(articles.length==0){
  			var noResultsLabel = $("<label>");
  			noResultsLabel.text("No Results.")
  			$("#results").append(noResultsLabel);
  		}
  		else{
  		for(var i=0; i< limit; i++){
        var number = $("<label>");
        number.addClass("fa-stack fa-lg");
        number.append($("<i class='fa fa-square fa-stack-2x'></i>"));
        number.append($("<i class='fa fa-inverse fa-stack-1x'>"+(i+1)+"</i>"));

        
        





        var headline = $("<h3>");
        headline.text(articles[i].headline.main);
        headline.css("font-weight","bold");
        headline.prepend(number);
        
        var section = $("<h4>");
        section.text(articles[i].section_name);
        
        var dateTime= $("<h4>");
        dateTime.text(articles[i].pub_date);
        //alert(dateTime.text());

        var link = $("<a>");
        link.attr("target", "_blank");
        link.text(articles[i].web_url);
        link.attr("href", link.text());

        var container = $("<div>");

        container.addClass("well");
        container.css("border-width", "1px");
        container.css("border-style", "solid");
        container.css("margin-bottom", "20px");

        //container.append(number);
        container.append(headline);
        container.append(section);
        container.append(dateTime);
        container.append(link);

        $("#results").append(container);
      }

}


		}).fail(function(err) {
  				throw err;
	});
};
$("#submit").on("click", function(){
	functionSearchNYT($("#title").eq(0).val(), $("#limit").eq(0).val(), $("#begin").eq(0).val()+"0101", $("#end").eq(0).val()+"1231");
});

$("#clear").on("click", function(){
  $("#results").empty();
});

var validateFunction = function(){
	var hasError = false;
	if($("#title").eq(0).val()==""){
		hasError=true;
		$("#title").addClass("has-error");
	}
	else{
		
		$("#submit").prop("disabled", false);
		$("#title").remove("has-error");
	}
	
	if($("#begin").eq(0).val()!="" && $("#begin").eq(0).val().length!=4){
		hasError=true;
		$("#submit").prop("disabled", true);
		$("#begin").addClass("has-error");
	}
	else{
		$("#submit").prop("disabled", false);
		$("#begin").removeClass("has-error");
	}
	if($("#end").eq(0).val()!="" && $("#end").eq(0).val().length!=4){
		hasError=true;
		$("#submit").prop("disabled", true);
		$("#end").addClass("has-error");
	}
	else{
		$("#submit").prop("disabled", false);
		$("#end").removeClass("has-error");
	}

	if($("#begin").eq(0).val()!="" && isNaN(parseInt($("#begin").eq(0).val()))){
		hasError=true;
		$("#submit").prop("disabled", true);
		$("#begin").addClass("has-error");
	}
	else{
		
		$("#begin").removeClass("has-error");
	}
	if($("#end").eq(0).val()!="" && isNaN(parseInt($("#end").eq(0).val()))){
		hasError=true;
		
		$("#end").addClass("has-error");
	}
	else{
		
		$("#end").removeClass("has-error");
	}

	

	if(hasError){
		$("#submit").prop("disabled", true);
	}
	else
		$("#submit").prop("disabled", false);
}
document.onkeyup = function(){
	validateFunction();
};
validateFunction();
//functionSearchNYT();