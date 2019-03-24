
//==================================================================================
// search field / bar handler
$(function(){
	var searchfield = $('#query');
	var icon = $('#search-btn');

	// focus event handler 
	$(searchfield).on('focus',function(){
						$(this).animate({
							width:'60%'
						},400);

						$(icon).animate({
						right:'275px' 
						},400);
	});
	// Blur event handler 
	$(searchfield).on('blur',function(){
								if(searchfield.val() == '')
								{
						           $(searchfield).animate({
									    width:'45%'
								        },400,function(){});
						           $(icon).animate({
									    right:'388px'
								        },400,function(){});
						          // alert("Please enter something");
								}
     });
    // preventing form from submitting
  $('#search-form').submit(function(e){
  							e.preventDefault();
    });

});
//===================================================================================
// this function is called when form is submitted
function search(){
	if($('#query').val() != '')
	{
			// clear results which are already displayed
			$('#results').html('');
			$('#buttons').html('');

			// get form input
			q=$('#query').val();

		  // run get request on API
		     $.get(
		     		 "https://www.googleapis.com/youtube/v3/search", // url from where to fetch data
		     		 {
		     		 	part :  'snippet, id',
		     		 	q    :  q, // value to search  
		     		 	type :  'video', // content type
		     		 	key  :  'your api key' // API key
		     		 },
		     		    function(data){ // callback function on successfull return 
					     		 	var nextPageToken = data.nextPageToken;
					     		 	var prevPageToken = data.prevPageToken;

					     		 	// value returned is in data and it is in json format
					     		 	console.log(data);

					     		 	// value returned is in object form
					     		 	// in data "items" has important details like videoID, description, title, author, and content

					     		 	$.each(data.items, function(i,item){
								     		 		// get output
								     		 		var output= getOutput(item); // getOutput is function declared below
								     		 		// display results
								     		 		$('#results').append(output); 
					     		 	});
					     		 	var buttons = getButton(prevPageToken,nextPageToken);
					     		 	// display buttons
					     		 	$('#buttons').append(buttons);
		     		      }
		     	);
	}
	else
	{
		// alert("Please provide appropriate data.");
		$('#results').html('');
			$('#buttons').html('');
		
      $('.for_error').addClass('for_error_only');
	}
	
}


//==================================================================================
//build next page function

function nextPage(){

	var token = $('#next-button').data('token');
	var q= $('#next-button').data('query');
	// clear results
	$('#results').html('');
	$('#buttons').html('');

	// get form input
	q=$('#query').val();

	// run get request on API
     $.get(
     		 "https://www.googleapis.com/youtube/v3/search",
     		 {
     		 	part 			: 'snippet, id',
     		 	q               :  q,
     		 	pageToken       : token, // important for paging functioning
     		 	type            : 'video',
     		 	key             : 'AIzaSyDfRZqmiJs7pFyvG1S-mIDMTzLzfet43p8'
     		 },
     		 function(data){
     		 			var nextPageToken = data.nextPageToken;
		     		 	var prevPageToken = data.prevPageToken;

		     		 	console.log(data);
		     		 	$.each(data.items, function(i,item){
		     		 		// get output
		     		 		var output= getOutput(item);
		     		 		// display results
		     		 		$('#results').append(output);
		     		 	});
		     		 	var buttons = getButton(prevPageToken,nextPageToken);
		     		 	// display buttons
		     		 	$('#buttons').append(buttons);
     		   }
     	);
}
//==================================================================================
//build prev page function

function prevPage(){

	var token = $('#prev-button').data('token');
	var q= $('#prev-button').data('query');
	// clear results
	$('#results').html('');
	$('#buttons').html('');

	// get form input
	q=$('#query').val();

	// run get request on API
     $.get(
     		 "https://www.googleapis.com/youtube/v3/search",
     		 {
     		 	part      : 'snippet, id',
     		 	q         :  q,
     		 	pageToken : token,
     		 	type      : 'video',
     		 	key       : 'AIzaSyDfRZqmiJs7pFyvG1S-mIDMTzLzfet43p8'
     		 },
     		 function(data){
		     		 	var nextPageToken = data.nextPageToken;
		     		 	var prevPageToken = data.prevPageToken;

		     		 	//console.log(data);
		     		 	$.each(data.items, function(i,item){
		     		 		// get output
		     		 		var output= getOutput(item);
		     		 		// display results
		     		 		$('#results').append(output);
		     		 	});
		     		 	var buttons = getButton(prevPageToken,nextPageToken);
		     		 	// display buttons
     		 			$('#buttons').append(buttons);
     		 }
     	);
}

//==================================================================================
// build output

function getOutput(item){
	// extracting some basic info. from data recieved
	var videoId 		= item.id.videoId;
	var title   		= item.snippet.title;
	var description 	= item.snippet.description;
	var thumb 			= item.snippet.thumbnails.high.url;
	var channelTitle 	= item.snippet.channelTitle;
	var videoDate 		= item.snippet.publishedAt;

	// build output string
	var output = 
	'<li class="jumbotron li-element">' +

		'<div class="list-left ">' +
		   '<img src="'+thumb+'" >' +
		'</div>' +

	    '<div class="list-right">' +
	       '<h3 class="video-title">'+
		       '<a id="myBtn" target=".modal-content" href="http://www.youtube.com/embed/'+ videoId +'" >'
		        + title +
		        '</a>'+
	       '</h3><br/>'+
	       '<small class="video-date-channel">By <span class="cTitle">' +channelTitle+'</span> on '+videoDate+'</small>'+
	       '<p class="video-description">'+ description + '</p>' +
	    '</div>'+
	'</li>' +

	'<div class="clearfix"></div>'+
	'';

	return output;
}
//===================================================================================
function getButton(prevPageToken,nextPageToken){
	if(! prevPageToken) // when on 1st page u cannat go to previous page , so no prev btn
	{
	 var btnoutput =
	     '<div class="button-conatiner">' +
             '<button id="next-button" class="paging-button btn btn-success" data-token="'+nextPageToken+'" data-query="'+
               q+'" onclick="nextPage();">'+
               'Next Page'+
              '</button>'+
        '</div>';          
	}else
	{
		var btnoutput = 
		'<div class="button-conatiner">' +
		   '<button id="prev-button" class="paging-button btn btn-success" data-token="'+prevPageToken+'" data-query="'+
		       q+'" onclick="prevPage();">'+
		       'Prev Page'+
		   '</button>'+
          '<button id="next-button" class="paging-button btn btn-success" data-token="'+nextPageToken+'" data-query="'+
               q+'" onclick="nextPage();">Next Page</button>'+
            '</div>';  
	}

	return btnoutput;
}
//===================================================================================

// Get the modal


$(document).ready(function(){
	var modal = document.getElementById('myModal');
    var span = document.getElementsByClassName("close")[0];

  $("#myBtn").click(function(){
       modal.style.display = "block";
  });
   $("span").click(function(){
          modal.style.display = "none";
  });
   $(window).click(function(event){
         if (event.target == modal) {
    modal.style.display = "none";
  }
  });
});
