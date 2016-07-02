/*

Author: Zhaoyang Li, lizy14@yeah.net
Date: 2016-07-02

*/

function diff(a, b){
	var map = {}; //whether or not a name is in a
	var result = [];
	a.forEach(function(student){
		map[student.name] = true;
	});
	b.forEach(function(student){
		if(!map[student.name]){
			result.push(student);
		}
	});
	return result;
}

function test(){
	var a = [];
	["Alice", "Bob", "Carol"].forEach(function(name){
		a.push({"name": name});
	});

	var b = [];
	["Alice", "Dave", "Bob", "Eve"].forEach(function(name){
		b.push({"name": name});
	});

	console.log(a);
	console.log(b);
	console.log(diff(a,b));
}

test();
