var game={
  //array containing button text
  topics:["tom cruise","leonardo dicaprio", "denzel washington", "will smith","ryan reynolds", "ben kingsley","morgan freeman", "jason statham", "ben affleck", "matt damon", "kevin spacey", "forest whitaker", "johnny depp", ],
  //results:[],

  //function to get from the giphy api - search criteria passed as parameter
  searchGiphy:function(search){
    
    //var queryURL = "https://api.giphy.com/v1/gifs/search?q="+search+"&api_key=dc6zaTOxFJmzC&limit="+$("#numResults").val();

    //query gifphy for button text (search)
    var queryURL = "https://api.giphy.com/v1/gifs/search?q="+search+"&api_key=dc6zaTOxFJmzC&limit=10";

    //ajax call..
    $.ajax({
        url: queryURL,
        method: 'GET'
      }).done(function(response) {
          //save data
          var results = response.data;
         
          //display results
          $("#gifs").empty();

          //loop through the results..
          for(var i = 0; i < results.length; i++){

            //create a container for each response
            //it will contain a rating caption and the gif..

            //configure container...
            var container = $("<div>");
            container.addClass("col-md-5 col-xs-12 col-sm-12 thumbnail");
            container.css("margin", "10px");
            container.css("border-width", "1px");
            container.css("border-style", "solid");

            //configure the gif..
            var img =  $("<img>");
            img.addClass("img-responsive");
            img.css("padding", "10px");
            img.addClass("col-md-12 col-sm-12 col-xs-12");
            img.attr("src", results[i].images.original_still.url);
            img.attr("data-still", "true");
            img.attr("data-static", results[i].images.original_still.url)
            img.attr("data-animated", results[i].images.original.url);

            //clicking image should toggle the src between animated/still
            img.on("click", function(){
              
              
              if($(this).attr("data-still")=="true"){
                  $(this).attr("src", $(this).attr("data-animated"));
                  $(this).attr("data-still", "false");

              }
              else{
                $(this).attr("src", $(this).attr("data-static"));
                $(this).attr("data-still", "true");
              }
            });


            //configure the caption..
            var cap = $("<div>");
            cap.addClass("caption col-md-12 col-sm-12 col-xs-12");
            cap.text("Rating: "+results[i].rating);

            //append the image and the caption to the container div
            container.append(img);
            container.append(cap);

            //append the result to the gifs area..
            $("#gifs").append(container);
           
          }
        }
    );
  },

  //empties the button area and redraws all buttons in the topic array..
  redrawButtons : function(){
    //clear current buttons
    $("#wordButtons").empty();

    //create a button for each string in topics array..
    $.each(this.topics, function(index, value){
      var btn = $("<button>");
      btn.addClass("btn btn-primary col-md-2");
      btn.text(value);
      btn.css("margin", "10px");
      btn.on("click", function(){
        game.searchGiphy(value);
      });
      $("#wordButtons").append(btn);
    });
  },
  createButton:function(){
    var text=$("#newButton").eq(0).val();
    game.topics.push(text);
    game.redrawButtons();
    $("#newButton").eq(0).val(""); 
  }
};

//disable the submit button if the input is empty
//or if it contains a string already in the topics array..
var refreshAddBtn = function(){
  var text = $("input").eq(0).val();
  if((text=="")||$.inArray(text, game.topics)!==-1){
    $("#addGifBtn").prop("disabled", true);
    $("input").eq(0).addClass("input-danger");
  }
  else
    $("#addGifBtn").prop("disabled", false);
};


refreshAddBtn();
game.redrawButtons();

//submit button logic..
$("#addGifBtn").on("click", function(event){
  event.preventDefault()
  game.createButton();
  refreshAddBtn();
});

//check if the submit button needs to be disabled with each key stroke.
document.onkeyup = function(){
  refreshAddBtn();
};
