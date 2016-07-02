function search(students, query){
	var isValid;
	if(typeof query === 'number'){
		isValid = function(student, query){
			return student.age === query;
		}
	}else if(typeof query === 'string'){
		isValid = function(student, query){
			return student.name === query;
		}
	}else if(typeof query === 'object'){
		isValid = function(student, query){
			for (var property in query) {
				if (query.hasOwnProperty(property)){
					if(student[property] !== query[property]){
						return false;
					}
				}
			}
			return true;
		}
	}
	var result = [];
	students.forEach(function(student){
		if(isValid(student, query)){
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
