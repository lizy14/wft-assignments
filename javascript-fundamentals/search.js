/*

Author: Zhaoyang Li, lizy14@yeah.net
Date: 2016-07-02

*/

function search(students, query){
	var check=({
		'number': function(student, query){
			return student.age === query;
		},
		'string': function(student, query){
			return student.name === query;
		},
		'object': function(student, query){
			for (var property in query) {
				if (query.hasOwnProperty(property)){
					if(student[property] !== query[property]){
						return false;
					}
				}
			}
			return true;
		}
	})[typeof query];
	
	if(!check)
		throw "Error: unknown type of query";


	var result = [];
	students.forEach(function(student){
		if(check(student, query)){
			result.push(student);
		}
	});


	if(result.length === 0){
		return false;
	}
	if(typeof query === "string"){
		return result[0];
	}
	return result;
}



function test(){
	var students = [{
			name: 'Alice',
			age: 21,
			hometown: 'Beijing'
		},{
			name: 'Bob',
			age: 22,
			hometown: 'Shanghai'
		},{
			name: '22',
			age: 22,
			hometown: 'Tianjin'
		},{
			name: '22',
			age: 23,
			hometown: 'Chengdu'
		}
	];
	console.log(search(students, 22));
	console.log(search(students, '22'));
	console.log(search(students, {
		name: '22',
		hometown: 'Chengdu'
	}));
}

test();
