// dynamic_example.js
// Taylor Rose (tjr1351 [at] rit.edu)
// Controller for question page. Dynamically loads questions from XML

_xmlhttp=new XMLHttpRequest();
_xmlhttp.open("GET","questions.xml",false);
_xmlhttp.send();
_xmlDoc=_xmlhttp.responseXML;
var question_list=_xmlDoc.getElementsByTagName("Question");

var lang_acronym = {
	'en': 'English',
	'es': 'Spanish',
	'fr': 'French'
	}

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

function refreshQuestions() 
{
	$(".question-div").remove();
	
	printQuestions();
	
}
