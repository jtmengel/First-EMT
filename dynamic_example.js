/* dynamic_example.js
 * Taylor Rose (tjr1351 [at] rit.edu)
 * Scott JT Mengel (slm8604 [at] gmail.com]
 * Controller for question page. Dynamically loads questions from XML
 * 
 * @constructor lang_acronym
 * @constructor _xmlhttp
 * @constructor _xmlDoc
 * @constructor question_list
 * @constructor question_group_list
 */
_xmlhttp = new XMLHttpRequest();
_xmlhttp.open("GET","questions.xml",false);
_xmlhttp.send();
_xmlDoc=_xmlhttp.responseXML;
var question_group_list = [];
var question_list=_xmlDoc.getElementsByTagName("Question");
var lang_acronym = {
	 'en': 'English',
	 'es': 'Spanish',
	 'fr': 'French' }

/* 
 *  makeGroups() will sort the questions list into groups
 *	@var qType - the type of a question - used to sort the question
 *	@var question_group_list - the list of groups that's built dynamically from the XML
 *	@var makeNew - a boolean that will cause the question to make a new group in question_group_list if its group is not already represented
 *
 *	Note: The format of question_group_list[n][m] is a 2D array where n is the list of questionTypes
 *			and m is the list of questions that belong in the catagory appropriately with exception to
 *			m=0 which is the string value of the group Type. 
 */
function makeGroups()
{
	console.log("makeGroups - start");
	for( j=0; j<question_list.length; j++ ) {
		var qType = (question_list[j].getElementsByTagName("type"))[0].childNodes[0].nodeValue.replace(/^\s+|\s+$/g, '');
		var makeNew = true;
		
		for( k=0; k<question_group_list.length; k++ ){
			if( question_group_list[k][0] === qType ) {
				question_group_list[k].push( question_list[j] ) ;
				makeNew = false;
			}
		}
		
		if(makeNew) question_group_list.push( [qType] );
	}
}

/*
 *	populateSelects
 *	
 *	@var child_list
 */ 
function populateSelects()
{
	var child_list = question_list[0].childNodes;
	console.log( child_list);
	
	for (i=0; i<child_list.length;i++)
	{
		//console.log(child_list[i].nodeName);
		$('#lang_patient').append('<option value="' + child_list[i].nodeName + 
		'>' + lang_acronym[child_list[i].nodeName] + '</option>'); 
	}
}

/*
 * printQuestions
 * 
 * @var $question_div
 * @var $anchor
 * @var $question
 * @var $top
 * @var $bottom
 */
function printQuestions()
{
	var select = document.getElementById('lang_patient');
	patient_lang = select.options[select.selectedIndex].value;
	
	var select = document.getElementById('lang_provider');
	provider_lang = select.options[select.selectedIndex].value;
	
	for (i=0;i<question_list.length;i++)
	{ 
		var $question_div = $('<div id="question-div" class="question-div" />');
		$("#wrapper").append($question_div);
		var $anchor = $('<a href="media/video/test" id="anchor" class ="' + patient_lang + '" caption="' + (question_list[i].getElementsByTagName(patient_lang))[0].childNodes[0].nodeValue + '" >');
		$question_div.append($anchor);
		var $question = $('<div class="question">');
		$anchor.append($question);
		var $top = $('<div class="top">');
		$question.append($top);
		var $bottom = $('<div class="bottom">');
		$question.append($bottom);
		$top.append( (question_list[i].getElementsByTagName(patient_lang))[0].childNodes[0].nodeValue );
		$bottom.append( (question_list[i].getElementsByTagName(provider_lang))[0].childNodes[0].nodeValue );			
	}
	$('#wrapper.link').hide();
	$('.'+ provider_lang).show();
	$('.'+ patient_lang).show();
	$('#wrapper a').lightBox();
}

/*
 *	refreshQuestions
 */
function refreshQuestions() 
{
	$(".question-div").remove();
	
	printQuestions();
	
}
