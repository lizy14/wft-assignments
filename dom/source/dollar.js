/*

Author: Zhaoyang Li
Date: 2016-07-04

*/

function _attr(name, value){
	try{
		if(!this instanceof Object){
			return;
		}
		if(typeof name !== 'string'){
			return;
		}
		if(typeof value === 'undefined'){
			return this[name];
		}else{
			if(typeof value === 'string'){
				this[name] = value;
			}
			return;
		}
	}catch(err){
		console.error(err);
		return;
	}
}


try{
	if($){
		console.warn("`$` has been defined.");
		console.log($);
		$ = null;
	}
}catch(e){}


$ = function(selector){

	try{
		if(typeof selector !== 'string')
			return [];
		if(selector === '')
			return [];

		var elements;
		if(selector[0] === '#'){
			return document.getElementById(selector.slice(1));
		}else if(selector[0] === '.'){
			//IE8 does not support getElementsByClassName
			elements = document.querySelectorAll(selector);
		}else{
			elements = document.getElementsByTagName(selector);
		}

		//conversion from HTMLCollection or NodeList to Array
		//add add the `attr` method
		var result = [];
		for(var i=0; i<elements.length; i++){
			// setting `Object.prototype.attr` does not work for IE8
			elements[i].attr = _attr;
			result.push(elements[i]);
		}

		if(result.length === 1){
			return result[0];
		}
		return result;
		
	}catch(err){
		console.error(err);
		return [];
	}
}
