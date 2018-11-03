$(document).ready(function(){
  var favoriteList = []; //empty array for favorites list.
      var summaryExtract;
 //------------------For Bonus: Adding Additional ----------------------------
     var lastbuttonClicked = []; // array to hold 'topic' for last button clicked to be used to add additional gifs when clicked
 //---------------------------------------------------
     var topicsList = ["Playstation", "Last of Us", "Linkin Park","Doctor Who", "Harry Potter", "John Cena"]
     var buttonCreate = $("<div>");
     for(var i = 0; i < topicsList.length; i++){
          $("#buttonsFormulate").append("<button class='btn btn-light' id='" + topicsList[i] + "'>" + topicsList[i] + "</button>" + "	&nbsp;");
     }
//----------------------------------------------
     $("#submits").click(function(){    //  add a button if there is an actual user Input
       // without this, itll create empty buttons if user clicks on submit without any value
           event.preventDefault();  // event.preventDefault keeps it from submitting on default(was necessary with something else I was trying but maybe not anymore)
           if(($("#userInput").val().trim().length != 0)){
             topicsList.push($("#userInput").val()); //push new input into array
             $("#buttonsFormulate").append("<button type=" + $("#userInput").val() + ">" + $("#userInput").val() + "</button>" + "	&nbsp;"); //create button based on input submitted
             //console.log($("#submits"));
             console.log(topicsList); //show array in console log
               $("#buttonsFormulate").empty(); //clear div for re-entry of new array
             for(var i = 0; i < topicsList.length; i++){  //for loop to create buttons again for array with new inputs

                  $("#buttonsFormulate").append("<button class='btn btn-light' id='" + topicsList[i] + "'>" + topicsList[i] + "</button>"+ "	&nbsp;");
             }
           }
           else{ return false;} //else do nothing
     });
//----------------------------------------------

     $(document).on("click", "button", function() { //on button click AFTER it was dynamically created with the middle, this section will load the gifs
             //parameter detecting buttons specifically
           $("#gifSection").empty(); // clear previous gifs (not sure if assignment desires it but just in case since it looks cleaner)

           var topic = $(this).text(); // set topic variable to the text of clicked button
             //------------------For Bonus----------------------------
           lastbuttonClicked.push(topic);
           $.getJSON('https://en.wikipedia.org/api/rest_v1/page/summary/' + topic, function(data) {       // wikipedia api to get a summary based on button already created or new buttons added
                    summaryExtract = data.extract;                                                      //(only getJSON function worked with the api, .ajax and get kept giving me errors until I found this on stacked overflow)
                    console.log(summaryExtract);
                    $("#summ").html(summaryExtract); //where the summary is shown on the page
           });
             //------------------===========----------------------------
           $("#title").html("<h2>" + topic + "</h2>");
           var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +   //then  search the topic
             topic + "&api_key=dc6zaTOxFJmzC&limit=10"; // set limit to 10
             $.ajax({
               url: queryURL,
               method: "GET"
             })
               .then(function(response) {
                   var results = response.data;                      //put response in a variable
                     console.log(results);
                    for (var i = 0; i < results.length; i++) {                    // create divs based on response.data
                          var gifSection = $("<div class='card' style='width: 18rem;'>");
                          var rating = results[i].rating;
                          var p = $("<p>").text("Rating: " + rating);                       //puts the rating in the paragraph tag
                          var topicPic = $('<img class="card-img-top"   alt="Card image cap">');
                          topicPic.attr("src", results[i].images.fixed_height_still.url);      // then grabs image still
                          topicPic.attr("data-still", results[i].images.fixed_height_still.url);      // sets still image to data-still attribute
                          topicPic.attr("data-animate", results[i].images.fixed_height.url);      // grabs this for the animate attribute
                          topicPic.attr("data-state", "still");      // sets current state to still
                          gifSection.prepend(p);                                             // add results to top of the page
                          gifSection.prepend(topicPic);
                          $("#gifSection").prepend(gifSection);     // prepends the gifs
                       }
               });
           //  }
     });
//----------------------------------------------
     $(document).on("click", "img", function() {                // this section of code animates the gifs or makes still based on state
             // set a variable with state attribute
             var state = $(this).attr("data-state");
             // if image is still, switch it to animate
             if (state === "still") {
               $(this).attr("src", $(this).attr("data-animate"));
               $(this).attr("data-state", "animate");
             } else {
               //otherwise vise versa, which helps create a toggle
               $(this).attr("src", $(this).attr("data-still"));
               $(this).attr("data-state", "still");
             }
     });
 //------------------For Bonus to add an additonal 10 gifs----------------------------
     $("#additionalRequests").click(function(){
         //console.log($(topic));
           // if(($("#userInput").val().trim().length != 0)){
         // only add gifs if the array 'lastbuttonClicked' has a value
           var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +   //then  search the topic
             lastbuttonClicked[lastbuttonClicked.length-1] + "&api_key=dc6zaTOxFJmzC&limit=20"; // set limit to 10

             $.ajax({
               url: queryURL,
               method: "GET"
             })
               .then(function(response) {
              if(lastbuttonClicked !== undefined){
                   var results = response.data;                      //put response in a variable
                     console.log(results);
                    for (var i = 10; i < results.length; i++) {   // grabs NEXT 10 gifs
                         var gifSection = $("<div class='card' style='width: 18rem;'>");
                          var rating = results[i].rating;
                          //console.log(rating);
                          var p = $("<p>").text("Rating: " + rating);                       //puts the rating in the paragraph tag
                          var topicPic = $('<img class="card-img-top"   alt="Card image cap">');
                          topicPic.attr("src", results[i].images.fixed_height_still.url);      // then grabs image still
                          topicPic.attr("data-still", results[i].images.fixed_height_still.url);      // sets still image to data-still attribute
                          topicPic.attr("data-animate", results[i].images.fixed_height.url);      // grabs this for the animate attribute
                          topicPic.attr("data-state", "still");      // sets current state to still
                          gifSection.prepend(p);                                             // add results to top of the page
                          gifSection.prepend(topicPic);
                          $("#gifSection").prepend(gifSection);     // prepends the gifs
                       }
                   }
               });
     });
     //------------------For Bonus to save favorite gifs----------------------------
       $(document).on("dblclick", ".card-img-top", function() {    //double click function to grab favorite gif
            console.log($(this)[0].dataset.animate);   //grabs the animated version of the gif
            favGifLink = $(this)[0].dataset.animate;
           //if(favoriteList.includes(favGifLink)){              //check if link is already in favorites list
           if(favoriteList.includes(favGifLink)){              //check if link is already in favorites list

             return false;                                     //if it is,return false
           }
           else{
               favoriteList.push($(this)[0].dataset.animate);     //else push it into the array.
           }
             localStorage.setItem("favoriteGifs", JSON.stringify(favoriteList));
       });

       $("#favoriteGifsDiv").on("click", function(){
         var temp;
                 $("#favorites").empty(); //clear div from previous entry if it exists
         var getItem = JSON.parse(localStorage.getItem("favoriteGifs"));

           $("#favorites").html("Favorite Gifs: </br>")

          for (var i = 0; i < getItem.length; i++) {
               var favoriteGifs = $("<div class='card' style='width: 18rem;'>");
                var topicPic = $('<img class="card-img-top"   alt="Card image cap">');
                temp = "<div class='card' style='width: 18rem;'><img src='" + getItem[i] + "' style='width:200px;'  /></div>";
                console.log(getItem[i]);
                  // append gifs into favoriteGifs div
                if("#favorites".includes(temp)){              //check if link is already in favorites div
                  return false;                                     //if it is,return false
                }
                else{
                    $("#favorites").append(temp);      //else push it into the div in similar fashion.
                }
             }

             $("#favorites").append("<hr>")
       });

       $("#cl").on("click",function(){      //function to clear the favorite gifs and local storage
                 $("#favorites").empty();
                 localStorage.clear();
       });

});
