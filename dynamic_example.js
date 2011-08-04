/* dynamic_example.js
 * Taylor Rose (tjr1351 [at] rit.edu)
 * Scott JT Mengel (slm8604 [at] rit.edu]
 * Controller for question page. Dynamically loads questions from XML
 * 
 * @constructor _xmlhttp
 * @constructor _xmlDoc
 * @constructor question_list
 * @constructor question_group_list
 * @constructor lang_acronym
 * @constructor lang_list
 */
_xmlhttp = new XMLHttpRequest();
_xmlhttp.open("GET","questions.xml",false);
_xmlhttp.send();
_xmlDoc=_xmlhttp.responseXML;
var question_group_list = [];
var question_list=_xmlDoc.getElementsByTagName("Question");
var lang_acronym = {};
var lang_list = _xmlDoc.getElementsByTagName("Language");

for (i=0; i<lang_list.length; i++){ //recommend placing this into makeGroups()
	var tuple = [
		lang_list[i].getElementsByTagName('full')[0].childNodes[0].nodeValue.replace(/^\s+|\s+$/g, ''),
		lang_list[i].getElementsByTagName('image')[0].childNodes[0].nodeValue.replace(/^\s+|\s+$/g, '')
		]
	lang_acronym[lang_list[i].getElementsByTagName('abbr')[0].childNodes[0].nodeValue.replace(/^\s+|\s+$/g, '')] = tuple;
}

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
	console.log('makeGroups called');//Delete Me
	for( j=0; j<question_list.length; j++ ) {
		var qType = (question_list[j].getElementsByTagName("type"))[0].childNodes[0].nodeValue.replace(/^\s+|\s+$/g, '');
		var makeNew = true;
		for( k=0; k<question_group_list.length; k++ ){
			if( question_group_list[k][0][0] === qType ) {
				question_group_list[k].push( [question_list[j],[] ] ) ;
				makeNew = false;
			}
		}
		if(makeNew) question_group_list.push( [
		  [ qType, 
		    $('<div class="slideToggler" id="'+qType+'"><h3>'+qType+'</h3></div>'), 
		    $('<div class="group-div" id="group-'+qType+'" />') ]
		  ]);
	}
}

/*
 *	populateSelects
 *	
 *	@var child_list
 *
 *	Dynamically populates the available languages from lang_acronym
 */ 
function populateSelects()
{
	console.log('populateSelects called');//Delete Me
	var url = $(location).attr('href');
	var lang = url.split("=")[1];
		
	var lang_patient = $('<select id="lang_patient">');
	var lang_provider = $('<select id="lang_provider">');
	
	$.each(lang_acronym, function(key, value) 
	{
		if (key === lang){
			lang_patient.append('<option selected="selected" value="' + key + 
			'">' + value[0] + '</option>'); 
		} else {
			lang_patient.append('<option value="' + key + 
			'">' + value[0] + '</option>'); 
		}
		if (key === 'en'){
			lang_provider.append('<option selected="selected" value="' + key + 
			'">' + value[0] + '</option>'); 
		} else {
			lang_provider.append('<option value="' + key + 
			'">' + value[0] + '</option>'); 
		}		
	});
	$('#lang_list').prepend(lang_patient);
	$('#lang_list').prepend('Patient\'s language');
	$('#lang_list').prepend(lang_provider);
	$('#lang_list').prepend('Provider\'s language');
}

/*
 * printQuestions
 * 
 * @var $question_div
 * @var $anchor
 * @var $question
 * @var $top
 * @var $bottom
 * @var $group-div
 */
function printQuestions()
{
	$('#wrapper').empty();
	var select = document.getElementById('lang_patient');
	patient_lang = select.options[select.selectedIndex].value;
	
	var select = document.getElementById('lang_provider');
	provider_lang = select.options[select.selectedIndex].value;
	
	for (h=0; h<question_group_list.length; h++) //For each group...
	{
		question_group_list[h][0][1].append(question_group_list[h][0][2]);
		$('#wrapper').append( question_group_list[h][0][1] );
		
		for (i=1; i<question_group_list[h].length; i++) //and for each question therein... 0 is string value, hence start at 1
		{
			var $question_div = $('<div id="question-div" class="question-div" />');
			$( question_group_list[h][0][2] ).append($question_div);
			var $anchor = $('<a href="media/video/'+ (question_group_list[h][i][0].getElementsByTagName(patient_lang))[0].getElementsByTagName('video')[0].childNodes[0].nodeValue.replace(/^\s+|\s+$/g, '') + '" id="anchor" class ="' + patient_lang + '" caption="' + (question_group_list[h][i][0].getElementsByTagName(patient_lang))[0].childNodes[0].nodeValue + '" >');

//	        if( question_group_list[h][i][1][0] === undefined ){
//		        question_group_list[h][i][1][0]  =  false;
//        		question_group_list[h][i][1][1]  =  $('<div class="button neutral">!</div>');
//    		}
//			$question_div.append(question_group_list[h][i][1][1] );
//			assignButtons( question_group_list[h][i][1] );

			$question_div.append($anchor);
			var $question = $('<div class="question">');
			$anchor.append($question);
			var $top = $('<div class="top">');
			$question.append($top);
			var $bottom = $('<div class="bottom">');
			$question.append($bottom);
			$top.append( (question_group_list[h][i][0].getElementsByTagName(patient_lang))[0].childNodes[0].nodeValue );
			$bottom.append( (question_group_list[h][i][0].getElementsByTagName(provider_lang))[0].childNodes[0].nodeValue );

	        if( question_group_list[h][i][1][0] === undefined ){
		        question_group_list[h][i][1][0]  =  false;
        		question_group_list[h][i][1][1]  =  $('<div class="button neutral">!</div>');
    		}
			$question_div.append(question_group_list[h][i][1][1] );
			assignButtons( question_group_list[h][i][1] );
		}
		makeItSlide(question_group_list[h][0]);
	}
	
	$('#wrapper.link').hide();
	$('.'+ provider_lang).show();
	$('.'+ patient_lang).show();
	$('#wrapper a').lightBox();
}

/*
 * makeItSlide
 * @param qgList Question Group List - passes in the question group information
 */
function makeItSlide(qgList)
{
	qgList[1].find('h3').click( function(){
		qgList[2].slideToggle('fast');
	} );
}

/*
 * addFlags
 */
function addFlags()
{
	$.each(lang_acronym, function(key, value) 
	{
		var lang_div = $('<div class="lang">');
		$('#wrapper').append(lang_div);
		var lang_anchor = $('<a href="./Questions.html?lang=' + key +'">');
		$(lang_div).append(lang_anchor);
		var lang_img = $('<img src="media/images/' + value[1] + '" height="113" width="200" alt="' + value[0] + '" />');
		lang_anchor.append(lang_img);
	});
}	
	
/*
 *	refreshQuestions
 */
function refreshQuestions() 
{
	$(".question-div").remove();
	printQuestions();
}

/*
 *	collapseQuestions
 *
 *	Closes all of the question groups
 */
function collapseQuestions(){
	for (h=0; h<question_group_list.length; h++) //For each group...
	{
		question_group_list[h][0][2].css("display","none");
	}
}

/*
 * printMissed
 */
function printMissed()
{
	var print_div = $('<div id="print_div" />');
	
	for (h=0; h<question_group_list.length;h++)
	{
		for (i=1; i<question_group_list[h].length; i++)
		{
			if (question_group_list[h][i][1][0])
			{
				$(print_div).append("<i>" + (question_group_list[h][i][0].getElementsByTagName(provider_lang))[0].childNodes[0].nodeValue.replace(/^\s+|\s+$/g, '') + "</i><br />");
				$(print_div).append((question_group_list[h][i][0].getElementsByTagName(patient_lang))[0].childNodes[0].nodeValue.replace(/^\s+|\s+$/g, '') + "<br />");
				
			}
		}
	}
	$('body').append(print_div);
	window.print();
	$(print_div).remove();
}

/*
 * assignButtons
 *
 * @param question
 *
 * Def: Creates response buttons and the event handler thereof
 */
function assignButtons(question)
{
	question[1].click( function(){
		
        question[0] = !question[0];
        
		if( question[0] ) {
            $(this).attr('class','button flagged'); 
		    console.log('>'+question[0]);
        }
		else{
            $(this).attr('class','button neutral');
		    console.log('>'+question[0]);
        }
	});
}
