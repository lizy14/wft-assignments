/*

Author: Zhaoyang Li, lizy14@yeah.net
Date: 2016-07-02

*/
function range(m){ //[0, m)
	var j;
	var a=[];
	for(j=0; j<m; j++){
			a.push(j);
	}
	return a;
}

//wrapper function for sorting algorithms
function sort(arr, method, less){
	if(!(arr instanceof Array))
		throw "not an array";

	if(!less){
		less = function(a, b){
			return a < b;
		};
	}else{
		if(typeof less !== 'function')
			throw "second argument not a function";
	}

	var func = {
		'bubble': bubble_sort,
		'insertion': insertion_sort,
		'selection': selection_sort
	}[method];

	if(!func)
		throw "unknown sorting algorithm";

	return func(arr, less);
}


function bubble_sort(a, less){

	var n = a.length;

	// codes without 'for' is elegant but expensive
	range(n-1).forEach(function(i){
		range(n-i).forEach(function(_){
			var j = n - _ - 1;
			if(less(a[j], a[j-1])){
				var tmp;
				tmp = a[j-1];
				a[j-1] = a[j];
				a[j] = tmp;
			}
		});
	});
	return a;
}


function insertion_sort(a, less){
	var n = a.length;

	range(n-1).forEach(function(j){
		var key = a[j];
		var i = j - 1;
		while(i>=0 && less(key, a[i])){
			a[i+1] = a[i];
			i--;
		}
		a[i+1] = key;
	});
	return a;
}


function selection_sort(a, less){
	var n = a.length;
	range(n).forEach(function(i){
		var min = Infinity;
		var min_index;
		var j;
		for(j=i; j<n; j++){
			if(less(a[j], min)){
				min = a[j];
				min_index = j;
			}
		}
		var tmp;
		tmp = a[min_index];
		a[min_index] = a[i];
		a[i] = tmp;
	});
	return a;
}


function test(){
	var arr = [-2.33, 23.3, -233, 2.33, 233.3, -2333, 2.333];
	var lesses = [
		undefined,
		function(a, b){
			return Math.abs(a) < Math.abs(b);
		}
	]
	var algorithms = ['bubble', 'insertion', 'selection'];

	lesses.forEach(function(le){
		algorithms.forEach(function(al){
			console.log(sort(arr, al, le));
		})
	});


	//test on random arrays
	function check_result(a, less){
		if(!less){
			less = function(a, b){
				return a < b;
			};
		}
		var i;
		var n = a.length;
		for(i=0; i<n-1; i++){
			if(!less(a[i],a[i+1])){
				return false;
			}
		}
		return true;
	}

	arr = [];
	range(1000).forEach(function(){
		arr.push(Math.random());
	})

	lesses.forEach(function(le){
		algorithms.forEach(function(al){
			console.log(check_result(sort(arr, al, le), le));
		})
	});
}

test();
