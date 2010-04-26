/** Some constants: **/
var EMPTY = 'empty';
var MODEL = 'model';
var ALGORITHM = 'algorithm';
var TOOL = 'tool';
var MEMORY = 'memory';
var RUNTIME ='runtime';
var STATES ='states';
var TRANSITIONS ='transitions';
var DATE ='date';
var OPTIONS = 'options';
var FINISHED = 'finished';

/** global constant array LISTFILTERS which keeps the names of all the listfilters in it **/
var LISTFILTERS = new Array(MODEL,ALGORITHM,TOOL);
/** global constant array VALUEFILTERS which keeps the names of all the valuefilters in it **/
var VALUEFILTERS = new Array(MEMORY,RUNTIME,STATES,TRANSITIONS);

/** global constant which contains the filterStyle of the DATE filter **/
var DATEFILTERSTYLE = '<option value="on">On</option><option value="before">Before</option><option value="after">After</option>';
/** global constant which contains the filterStyle of the VALUE filters **/
var VALUEFILTERSTYLE = '<option value="equal">Equal to</option><option value="greaterthan">Greater than</option><option value="lessthan">Less than</option>';
/** global constant which contains the filterStyle of the OPTIONS filters **/
var OPTIONSFILTERSTYLE = '<option value="0">Options (hover)</option>';
/** global constant which contains the filterStyle of the EMPTY filter **/
var EMPTYFILTERSTYLE = '<option value="empty">&lt;empty&gt;</option>';
/** global constant which contains the filterStyle of the FINISHED filter **/
var FINISHEDFILTERSTYLE = '<option value="true">True</option><option value="false">False</option>';

/** global constant array which contains the filterStyles of the LIST filters **/
var LISTFILTERSTYLES = new Array(
	'<option value="0">Model (hover)</option>',
	'<option value="0">Algorithm (hover)</option>',
	'<option value="0">Tool (hover)</option>');

/** global constant which contains the class of the EMPTY filter **/
var EMPTYFILTER = '({"type" : "","row" : -1,"value" : ""})';
/** global constant which contains the class of the LIST filters **/
var LISTFILTER = '({"type" : "","row" : -1,"list" : []})';
/** global constant which contains the class of the VALUE filters **/
var VALUEFILTER = '({"type" : "","row" : -1,"style" : "","value": -1})';
/** global constant which contains the class of the DATE filter **/
var DATEFILTER = '({"type" : "","row" : -1,"style" : "","value": -1})';
/** global constant which contains the class of the OPTIONS filters **/
var OPTIONSFILTER = '({"type" : "","row" : -1,"options" : [],"values": []})';
/** global constant which contains the class of the FINISHED filter **/
var FINISHEDFILTER = '({"type" : "","row" : -1,"value" : []})';

/** global array ORDERS which keeps all the possible orders in it **/
var ORDERS = new Array('id','model','states','runtime','memory','finished');


/** global array filters which keeps all the stored filters in it **/
var filters = new Array();
/** global array possible_options which keeps all possible options in it **/
var possible_options = new Array();
/** global array possible_lists which keeps all the possible models, algorithms and tools in it (in that order) **/
var possible_lists = new Array(new Array(), new Array(), new Array());

/** global variable current_order which keeps the current order in it **/
var current_order = 'id';

/**
 * Function that adds a filterrow after the filter with filter.row=row
 * @require		row>=0
 * @ensure		A new EMPTY filter is added to filters after the filter with row = row
 * @ensure		The filter-objects in filters are ordered by rownumber
 */
function addFilterRow(row){
	storeValues();
	row = parseInt(row);
	
	$(filters).each(function(i,filter){
		if (filter.row > row){
			filter.row = filter.row+1;
		}
	});
	
	var newf = eval(EMPTYFILTER);
	newf.type = EMPTY;
	newf.row = (row+1);
	filters.push(newf);
	
	sortFilters();
	renewFilters();
}

/**
 * Function that removes the filterrow with rownumber row
 * @require		row>=0 /\ filters.length>1
 * @ensure		The filterrow with rownumber row is removed from filters
 * @ensure		The filter-objects in filters are ordered by rownumber
 */
function removeFilterRow(row){
	if (filters.length==1){
		alert('cannot remove last filter');
		return;
	}
	
	storeValues();
	var f = new Array();
	row = parseInt(row);
	
	$(filters).each(function(i,filter){
		if (filter.row!=row){
			if (filter.row>row){
				filter.row--;
			}
			f[filter.row] = filter;
		}
	});
	
	filters = f;
	sortFilters();
	renewFilters();
}

/**
 * Function that gets a filter-object from filters
 * @require		row>=0
 * @ensure		result.row = row
 */
function getFilter(row){
	if (row>=filters.length)	return -1;
	
	return filters[row];
}

/**
 * Function that changes the type of a filter-object
 * @require		elem!='undefined' /\row>=0
 * @ensure		getFilter(row).type = $(elem).attr('value')
 */
function changeFilterType(elem,row){
	
	var f = eval(EMPTYFILTER);
	
	type = $(elem).attr('value');
	
	$('#filterValue'+row).attr('value','');
	
	if (type==EMPTY){
		f = changeToEmpty(elem,row);
	}else if (LISTFILTERS.indexOf(type)!=-1){
		f = changeToList(elem,row);
	}else if (VALUEFILTERS.indexOf(type)!=-1){
		f= changeToValue(elem,row);
	}else if (type==DATE){
		f= changeToDate(elem,row);
	}else if (type==OPTIONS){
		f = changeToOptions(elem,row);
	}else if (type==FINISHED){
		f = changeToFinished(elem,row);
	}
	
	filters[row] = f;
	storeValues();
	
}

function changeToEmpty(elem,row){
	var f = eval(EMPTYFILTER);
	f.type = EMPTY;
	f.row = row;
	
	//alter filtertable:
	$(elem).siblings('ul.mega').children('li.mega').children('div').remove();
	$(elem).siblings('input.filterValue').show();
	$("#filterStyle"+f.row).html(EMPTYFILTERSTYLE);
	
	return f;
}

function changeToList(elem,row){
	var f = eval(LISTFILTER);
	f.type = $(elem).attr('value');
	f.row = row;
	f.list = new Array();
	
	//alter filtertable:
	var index = LISTFILTERS.indexOf(f.type);
	var hover = '<div><select multiple size="7" class="list">';
	$(possible_lists[index]).each(function(i,opt){
		hover+='<option value="'+opt.id+'">'+opt.name+'</option>';
	});
	hover+='</select></div>';
	
	$(elem).siblings('ul.mega').children('li.mega').children('div').remove();
	$(elem).siblings('input.filterValue').hide();
	
	$(elem).siblings('ul.mega').children('li.mega').children('select.filterStyle').html(LISTFILTERSTYLES[index]);
	$(elem).siblings('ul.mega').children('li.mega').children('select').after(hover);
	configureHover();
	
	return f;
}

function changeToValue(elem,row){
	var f = eval(VALUEFILTER);
	f.type = $(elem).attr('value');
	f.row = row;
	
	//alter filtertable:
	$(elem).siblings('ul.mega').children('li.mega').children('div').remove();
	$(elem).siblings('input.filterValue').show();
	$("#filterStyle"+f.row).html(VALUEFILTERSTYLE);
	
	return f;
}

function changeToDate(elem,row){
	var f = eval(DATEFILTER);
	f.type = DATE;
	f.row = row;
	
	//alter filtertable:
	$(elem).siblings('ul.mega').children('li.mega').children('div').remove();
	$(elem).siblings('input.filterValue').show();
	$("#filterStyle"+f.row).html(DATEFILTERSTYLE);
	
	return f;
}

function changeToOptions(elem,row){
	var f = eval(OPTIONSFILTER);
	f.type = OPTIONS;
	f.row = row;
	f.options = new Array();
	f.values = new Array();
	
	//alter filtertable:
	var hover = '<div>';
	$(possible_options).each(
		function(i,option){
			hover+='<input type="checkbox" value="'+option.id+'" class="optionID">'+option.name;
			if (option.takes_argument)	hover+=' <input type="text" class="optionValue">';
			else						hover+=' <input type="hidden" value="True" class="optionValue">';
			hover+='<br>';
		}
	);
	hover+='</div>';
	
	$(elem).siblings('ul.mega').children('li.mega').children('div').remove();
	$(elem).siblings('input.filterValue').hide();
	$(elem).siblings('ul.mega').children('li.mega').children('select.filterStyle').html(OPTIONSFILTERSTYLE);
	$(elem).siblings('ul.mega').children('li.mega').children('select').after(hover);
	configureHover();
	
	return f;
}

function changeToFinished(elem,row){
	var f = eval(FINISHEDFILTER);
	f.type = FINISHED;
	f.row = row;
	
	//alter filtertable:
	$(elem).siblings('ul.mega').children('li.mega').children('div').remove();
	$(elem).siblings('input.filterValue').hide();
	$("#filterStyle"+f.row).html(FINISHEDFILTERSTYLE);
	
	return f;
}

/**
 * Function that sorts the stored filters on their rownumber
 * @ensure The filter-objects in filters are sorted by rownumber
 */
function sortFilters(){
	var f = new Array();
	$(filters).each(function(i,filter){
		f[filter.row] = filter;
	});
	filters = f;
}

/**
 * Function that stores the values of each filterrow
 * @ensure All necessary data needed to recreate the filtertable is stored
 */
function storeValues(){
	$(filters).each(function(i,filter){
		if (filter.type==EMPTY)							storeEmptyFilter(filter);
		else if (LISTFILTERS.indexOf(filter.type)!=-1)	storeListFilter(filter);
		else if (VALUEFILTERS.indexOf(filter.type)!=-1)	storeValueFilter(filter);
		else if (filter.type==DATE)						storeDateFilter(filter);
		else if (filter.type==OPTIONS)					storeOptionsFilter(filter);
		else if (filter.type==FINISHED)					storeFinishedFilter(filter);
	});
}

/**
 * Function that stores the values of a filterrow of type EMPTY
 * This filter only needs to store its value
 */
function storeEmptyFilter(filter){
	filter.value = $("#filterValue"+filter.row).attr('value');
}

/**
 * Function that stores the values of a filterrow which has a type specified in LISTFILTERS
 * This filter needs to store which id's are selected
 */
function storeListFilter(filter){
	var selected = $("#filterrow"+filter.row+" select.list option");
	var ids = new Array();
	$(selected).each(function(j,opt){
		if (opt.selected){
			ids.push(opt.value);
		}
	});
	filter.list = ids;
}

/**
 * Function that stores the values of a filterrow which has a type specified in VALUEFILTERS
 */
function storeValueFilter(filter){
	filter.style = $("#filterStyle"+filter.row).attr('value');
	filter.value = $("#filterValue"+filter.row).attr('value');
}

/**
 * Function that stores the values of a filterrow of type DATE
 */
function storeDateFilter(filter){
	filter.style = $("#filterStyle"+filter.row).attr('value');
	filter.value = $("#filterValue"+filter.row).attr('value');
}

/**
 * Function that stores the values of a filterrow of type OPTIONS
 */
function storeOptionsFilter(filter){
	var checkboxes = $("#filterrow"+filter.row+" .optionID");
	var values = $("#filterrow"+filter.row+" .optionValue");
	
	var optionids = new Array();
	var optionvalues = new Array();
	
	for (var j=0;j<checkboxes.length;j++){
		if (checkboxes[j].checked==true){
			optionids.push(checkboxes[j].value)
			optionvalues.push(values[j].value);
		}
	}
	filter.options = optionids;
	filter.values = optionvalues;
}

function storeFinishedFilter(filter){
	filter.value = $("#filterStyle"+filter.row).attr('value');
}

/**
 * Function used to give the contents of the filter in an alert-popup
 */
function printFilters(){
	var print = "";
	for (var i=0;i<filters.length;i++){
		var filter = filters[i];
		
		if (filter.type==EMPTY)						print+=filter.type+":("+filter.row+","+filter.value+")\n";
		if (LISTFILTERS.indexOf(filter.type)!=-1)	print+=filter.type+":("+filter.row+",("+filter.list.toString()+'))\n';
		if (VALUEFILTERS.indexOf(filter.type)!=-1)	print+=filter.type+":("+filter.row+","+filter.style+','+filter.value+")\n";
		if (filter.type==DATE)						print+=filter.type+":("+filter.row+","+filter.style+','+filter.value+")\n";
		if (filter.type==OPTIONS)					print+=filter.type+":("+filter.row+",("+filter.options.toString()+'),('+filter.values.toString()+'))\n';
		if (filter.type==FINISHED)					print+=filter.type+":("+filter.row+","+filter.value+")\n";
	}
	alert(print);
}

/**
 * Function that renews the filtertable according to the contents of filters
 */
function renewFilters(){
	sortFilters();
	rows = "";
	for (var i=0;i<filters.length;i++){
		var filter = filters[i];
		if (filter.type==EMPTY)							rows+= EmptyFilterRow(filter);
		else if (LISTFILTERS.indexOf(filter.type)!=-1)	rows+= ListFilterRow(filter);
		else if (VALUEFILTERS.indexOf(filter.type)!=-1)	rows+= ValueFilterRow(filter);
		else if (filter.type==DATE)						rows+= DateFilterRow(filter);
		else if (filter.type==OPTIONS)					rows+= OptionsFilterRow(filter);
		else if (filter.type==FINISHED)					rows+= FinishedFilterRow(filter);
	}
	$('#filters').html(rows);
	configureHover();
}

function EmptyFilterRow(filter){
	return '<tr id="filterrow'+filter.row+'">\n\
				<td width="320" align="left">\n\
					<select size="1" class="filterType" id="filterType'+filter.row+'" onchange="changeFilterType(this,'+filter.row+');">\n\
						<option value="empty" selected>&lt;empty&gt;</option>\n\
						<option value="model">Model</option>\n\
						<option value="algorithm">Algorithm</option>\n\
						<option value="tool">Tool</option>\n\
						<option value="date">Date</option>\n\
						<option value="memory">Memory</option>\n\
						<option value="runtime">Runtime</option>\n\
						<option value="states">states</option>\n\
						<option value="transitions">transitions</option>\n\
						<option value="options">Options</option>\n\
						<option value="finished">Finished</option>\n\
					</select>\n\
					<ul class="mega">\n\
						<li class="mega">\n\
							<select size="1" class="filterStyle" id="filterStyle'+filter.row+'">\n\
								'+EMPTYFILTERSTYLE+'\n\
							</select>\n\
						</li>\n\
					</ul>\n\
					<input type="text" class="filterValue" id="filterValue'+filter.row+'" value="'+filter.value+'">\n\
				</td>\n\
				<td align="right" style="width:160px">\n\
					<a class="remove" onclick="removeFilterRow('+filter.row+');"><img src="/site_media/img/remove_filter.png" alt="remove"></a>\n\
					<a class="add" onclick="addFilterRow('+filter.row+');"><img src="/site_media/img/add_filter.png" alt="add"></a>\n\
				</td>\n\
			</tr>';
}

function DateFilterRow(filter){
	return '<tr id="filterrow'+filter.row+'">\n\
				<td width="320" align="left">\n\
					<select size="1" class="filterType" id="filterType'+filter.row+'" onchange="changeFilterType(this,'+filter.row+');">\n\
						<option value="empty">&lt;empty&gt;</option>\n\
						<option value="model">Model</option>\n\
						<option value="algorithm">Algorithm</option>\n\
						<option value="tool">Tool</option>\n\
						<option value="date" selected>Date</option>\n\
						<option value="memory">Memory</option>\n\
						<option value="runtime">Runtime</option>\n\
						<option value="states">states</option>\n\
						<option value="transitions">transitions</option>\n\
						<option value="options">Options</option>\n\
						<option value="finished">Finished</option>\n\
					</select>\n\
					<ul class="mega">\n\
						<li class="mega">\n\
							<select size="1" class="filterStyle" id="filterStyle'+filter.row+'">\n\
								<option value="on"'+(filter.style=='on' ? ' selected' : '')+'>On</option>\n\
								<option value="before"'+(filter.style=='before' ? ' selected' : '')+'>Before</option>\n\
								<option value="after"'+(filter.style=='after' ? ' selected' : '')+'>After</option>\n\
							</select>\n\
						</li>\n\
					</ul>\n\
					<input type="text" class="filterValue" id="filterValue'+filter.row+'" value="'+filter.value+'">\n\
				</td>\n\
				<td align="right" style="width:160px">\n\
					<a class="remove" onclick="removeFilterRow('+filter.row+');"><img src="/site_media/img/remove_filter.png" alt="remove"></a>\n\
					<a class="add" onclick="addFilterRow('+filter.row+');"><img src="/site_media/img/add_filter.png" alt="add"></a>\n\
				</td>\n\
			</tr>';
}

function ValueFilterRow(filter){
	return '<tr id="filterrow'+filter.row+'">\n\
				<td width="320" align="left">\n\
					<select size="1" class="filterType" id="filterType'+filter.row+'" onchange="changeFilterType(this,'+filter.row+');">\n\
						<option value="empty">&lt;empty&gt;</option>\n\
						<option value="model">Model</option>\n\
						<option value="algorithm">Algorithm</option>\n\
						<option value="tool">Tool</option>\n\
						<option value="date">Date</option>\n\
						<option value="memory"'+(filter.type==MEMORY ? ' selected' : '')+'>Memory</option>\n\
						<option value="runtime"'+(filter.type==RUNTIME ? ' selected' : '')+'>Runtime</option>\n\
						<option value="states"'+(filter.type==STATES ? ' selected' : '')+'>states</option>\n\
						<option value="transitions"'+(filter.type==TRANSITIONS ? ' selected' : '')+'>transitions</option>\n\
						<option value="options">Options</option>\n\
						<option value="finished">Finished</option>\n\
					</select>\n\
					<ul class="mega">\n\
						<li class="mega">\n\
							<select size="1" class="filterStyle" id="filterStyle'+filter.row+'">\n\
								<option value="equal"'+(filter.style=='equal' ? ' selected' : '')+'>Equal to</option>\n\
								<option value="greaterthan"'+(filter.style=='greaterthan' ? ' selected' : '')+'>Greater than</option>\n\
								<option value="lessthan"'+(filter.style=='lessthan' ? ' selected' : '')+'>Less than</option>\n\
							</select>\n\
						</li>\n\
					</ul>\n\
					<input type="text" class="filterValue" id="filterValue'+filter.row+'" value="'+filter.value+'">\n\
				</td>\n\
				<td align="right" style="width:160px">\n\
					<a class="remove" onclick="removeFilterRow('+filter.row+');"><img src="/site_media/img/remove_filter.png" alt="remove"></a>\n\
					<a class="add" onclick="addFilterRow('+filter.row+');"><img src="/site_media/img/add_filter.png" alt="add"></a>\n\
				</td>\n\
			</tr>';
}

function FinishedFilterRow(filter){
	return '<tr id="filterrow'+filter.row+'">\n\
				<td width="320" align="left">\n\
					<select size="1" class="filterType" id="filterType'+filter.row+'" onchange="changeFilterType(this,'+filter.row+');">\n\
						<option value="empty">&lt;empty&gt;</option>\n\
						<option value="model">Model</option>\n\
						<option value="algorithm">Algorithm</option>\n\
						<option value="tool">Tool</option>\n\
						<option value="date">Date</option>\n\
						<option value="memory">Memory</option>\n\
						<option value="runtime">Runtime</option>\n\
						<option value="states">states</option>\n\
						<option value="transitions">transitions</option>\n\
						<option value="options">Options</option>\n\
						<option value="finished" selected>Finished</option>\n\
					</select>\n\
					<ul class="mega">\n\
						<li class="mega">\n\
							<select size="1" class="filterStyle" id="filterStyle'+filter.row+'">\n\
								<option value="true"'+(filter.value=='true' ? ' selected' : '')+'>True</option>\n\
								<option value="false"'+(filter.value=='false' ? ' selected' : '')+'>False</option>\n\
							</select>\n\
						</li>\n\
					</ul>\n\
				</td>\n\
				<td align="right" style="width:160px">\n\
					<a class="remove" onclick="removeFilterRow('+filter.row+');"><img src="/site_media/img/remove_filter.png" alt="remove"></a>\n\
					<a class="add" onclick="addFilterRow('+filter.row+');"><img src="/site_media/img/add_filter.png" alt="add"></a>\n\
				</td>\n\
			</tr>';
}

function ListFilterRow(filter){
	var index = LISTFILTERS.indexOf(filter.type);
	var hover = '<div><select multiple size="7" class="list">';
	$(possible_lists[index]).each(function(i,opt){
		hover+='<option value="'+opt.id+'"'+(filter.list.indexOf(opt.id)!=-1 ? ' selected' : '')+'>'+opt.name+'</option>';
	});
	hover+='</select></div>';
	
	var res ='<tr id="filterrow'+filter.row+'">\n\
				<td width="320" align="left">\n\
					<select size="1" class="filterType" id="filterType'+filter.row+'" onchange="changeFilterType(this,'+filter.row+');">\n\
						<option value="empty">&lt;empty&gt;</option>\n\
						<option value="model"'+(filter.type==MODEL ? ' selected' : '')+'>Model</option>\n\
						<option value="algorithm"'+(filter.type==ALGORITHM ? ' selected' : '')+'>Algorithm</option>\n\
						<option value="tool"'+(filter.type==TOOL ? ' selected' : '')+'>Tool</option>\n\
						<option value="date">Date</option>\n\
						<option value="memory">Memory</option>\n\
						<option value="runtime">Runtime</option>\n\
						<option value="states">states</option>\n\
						<option value="transitions">transitions</option>\n\
						<option value="options">Options</option>\n\
						<option value="finished">Finished</option>\n\
					</select>\n\
					<ul class="mega">\n\
						<li class="mega">\n\
							<select size="1" class="filterStyle" id="filterStyle'+filter.row+'">\n\
								'+LISTFILTERSTYLES[index]+'\n\
							</select>\n\
							'+hover+'\n\
							\n\
						</li>\n\
					</ul>\n\
				</td>\n\
				<td align="right" style="width:160px">\n\
					<a class="remove" onclick="removeFilterRow('+filter.row+');"><img src="/site_media/img/remove_filter.png" alt="remove"></a>\n\
					<a class="add" onclick="addFilterRow('+filter.row+');"><img src="/site_media/img/add_filter.png" alt="add"></a>\n\
				</td>\n\
			</tr>';
			return res;
}

function OptionsFilterRow(filter){
	var hover = '<div>';
	$(possible_options).each(
		function(i,option){
			var index = filter.options.indexOf(option.id);
			hover+='<input type="checkbox" value="'+option.id+'" class="optionID"'+(index!=-1 ? ' checked' : '')+'>'+option.name;
			if (option.takes_argument)	hover+=' <input type="text" class="optionValue"'+(index!=-1 ? ' value="'+filter.values[index]+'"' : '')+'>';
			else						hover+=' <input type="hidden" value="True" class="optionValue">';
			hover+='<br>';
		}
	);
	hover+='</div>';
	
	var res ='<tr id="filterrow'+filter.row+'">\n\
				<td width="320" align="left">\n\
					<select size="1" class="filterType" id="filterType'+filter.row+'" onchange="changeFilterType(this,'+filter.row+');">\n\
						<option value="empty">&lt;empty&gt;</option>\n\
						<option value="model">Model</option>\n\
						<option value="algorithm">Algorithm</option>\n\
						<option value="tool">Tool</option>\n\
						<option value="date">Date</option>\n\
						<option value="memory">Memory</option>\n\
						<option value="runtime">Runtime</option>\n\
						<option value="states">states</option>\n\
						<option value="transitions">transitions</option>\n\
						<option value="options" selected>Options</option>\n\
						<option value="finished">Finished</option>\n\
					</select>\n\
					<ul class="mega">\n\
						<li class="mega">\n\
							<select size="1" class="filterStyle" id="filterStyle'+filter.row+'">\n\
								'+OPTIONSFILTERSTYLE+'\n\
							</select>\n\
							'+hover+'\n\
							\n\
						</li>\n\
					</ul>\n\
				</td>\n\
				<td align="right" style="width:160px">\n\
					<a class="remove" onclick="removeFilterRow('+filter.row+');"><img src="/site_media/img/remove_filter.png" alt="remove"></a>\n\
					<a class="add" onclick="addFilterRow('+filter.row+');"><img src="/site_media/img/add_filter.png" alt="add"></a>\n\
				</td>\n\
			</tr>';
			return res;
}

/**
 * Function called when a mega drop-down menu must be shown
 * @ensure	$(elem).hassClass("hovering")==True
 */
function addMega(elem){
	$(elem).addClass("hovering");
}

/**
 * Function called when a mega drop-down menu must be hidden
 * @ensure	$(elem).hassClass("hovering")==False
 */
function removeMega(elem){
	$(elem).removeClass("hovering");
}

/**
 * Function that adds hoverIntent to all <li>-elements with class="mega"
 * @ensure	Every <li>-element with the class "mega" has the hoverIntent configured with addMega as mouseover function and removeMega as mouseoutfunction
 */
function configureHover(){
	$("li.mega").each(function(i,elem){
		var config = {
			sensitivity: 1,
			interval: 100,
			over: function(){addMega(elem)},
			timeout: 500,
			out: function(){removeMega(elem)}
		};
		console.log(config);
		$(elem).hoverIntent(config);
	});
}

function filter(){
	storeValues();
	d = getFilter();
	alert(d);
	if (d.substr(0,5).toLowerCase()=='error'){
		alert(d);
	}else{
		//getBenchmarks(d);
	}
}

function getBenchmarks(d){
	$.ajax({
		url: 'ajax/benchmarks/',
		type: 'POST',
		data: d,
		beforeSend: function(){
						$("#ajaxload").append('<img src="/site_media/img/ajaxload.gif" />');
					},
		success: function(json){
					handleBenchmarks(json);
				},
		error: function(XMLHttpRequest,textStatus,errorThrown){
					alert("Error with getting results: "+textStatus);
				},
		complete: function(){
					$("#ajaxload").empty();
				},
		dataType: 'json'
	});
}

function handleBenchmarks(json){
	possible_options = json.options;
	possible_lists = new Array(json.models,json.tools,json.algorithms);
	
	var table = '';
	
	$(json.benchmarks).each(function(i,benchmark){
		table+='<tr>\n\
			<td><input type="checkbox" name="benchmarks" value="' + benchmark.id + '" /></td>\n\
			<td><label for="{{ ' + benchmark.id + ' }}">' + benchmark.model + '</label></td>\n\
			<td>' + benchmark.states + '</td>\n\
			<td>' + (Math.round(benchmark.runtime*100)/100) + '</td>\n\
			<td>' + benchmark.memory + '</td>\n\
			<td>' + benchmark.finished + '</td></tr>';
	});
	$("table.benchmarks").empty();
	$("table.benchmarks").append(TABLEHEADERS+table);
}

function getFilter(){
	var res = "";
	
	for (var i=0;i<filters.length;i++){
		var filter = filters[i];
		if (filter.type!=EMPTY){
			res+="filter"+filter.row+"="+filter.type+"&";
			
			if (LISTFILTERS.indexOf(filter.type)!=-1){
				$(filter.list).each(function(j,value){
					res+="filter"+filter.row+"="+value+"&";
				});
			}else if(filter.type==OPTIONS){
				for (var j=0;j<filter.options.length;j++){
					res+="filter"+filter.row+"="+filter.options[j]+","+filter.values[j]+"&";
				}
			}else if(VALUEFILTERS.indexOf(type)!=-1){
				res+="filter"+filter.row+"="+filter.style+"&";
				res+="filter"+filter.row+"="+filter.value+"&";
			}else if(filter.type==DATE){
				res+="filter"+filter.row+"="+filter.style+"&";
				res+="filter"+filter.row+"="+filter.value+"&";
			}else if(filter.type==FINISHED){
				res+="filter"+filter.row+"="+filter.value+"&";
			}
		}else{
			return "Error: empty row detected";
		}
	}
	/*
	for (var i=0;i<filters.length;i++){
		var filter = filters[i];
		alert(filter.toJSONString());
	}*/
	return res;
}

/**
 * Function that is called when the document has finished loading.
 * @ensure	The Array.indexOf function is made /\
 *			The first filter f is added to filters with f.type=EMPTY and f.row=0 /\
 *			configureHover is called
 */
$(document).ready(function(){
	Array.prototype.indexOf = function (element,offset) {
		if (typeof offset=='undefined'){
			offset=0;
		}
		for (var i = offset; i < this.length; i++) {
			if (this[i] == element) {
				return i;
			}
		}
		return -1;
	}
	
	var f = eval(EMPTYFILTER);
	f.row = 0;
	f.type = EMPTY;
	filters = new Array();
	filters.push(f);
	configureHover();
	getBenchmarks();
	//THIS IS MOCKUP DATA:
	//possible_options.push({'id':0,'name':'option0','takes_argument':true},{'id':1,'name':'option1','takes_argument':false},{'id':2,'name':'option2','takes_argument':true},{'id':3,'name':'option3','takes_argument':false});
	//possible_lists[0].push({'id':0,'name':'model0'},{'id':1,'name':'model1'},{'id':2,'name':'model2'},{'id':3,'name':'model3'});
	//possible_lists[1].push({'id':0,'name':'alg0'},{'id':1,'name':'alg1'},{'id':2,'name':'alg2'},{'id':3,'name':'alg3'});
	//possible_lists[2].push({'id':0,'name':'tool0'},{'id':1,'name':'tool1'},{'id':2,'name':'tool2'},{'id':3,'name':'tool3'});
});