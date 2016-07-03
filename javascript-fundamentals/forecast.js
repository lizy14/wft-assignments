/*

Author: Zhaoyang Li, lizy14@yeah.net
Date: 2016-07-02

*/

// game schedule as a binary tree
/*
                       0
           1                      2
      3           4          5           6
   7     8     9    10    11    12    13    14
15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30
*/

// tree nodes 15 - 30
var teams = [
	"Switzerland",
	"Poland",
	"Croatia",
	"Portugal",
	"Wales",
	"Northern Ireland",
	"Hungary",
	"Belgium",
	"Germany",
	"Slovakia",
	"Italy",
	"Spain",
	"France",
	"Republic of Ireland",
	"England",
	"Iceland"
];

function forecast(strength, team){
	function range(n){ //[0, n)
		var i;
		var arr=[];
		for(i=0; i<n; i++){
			arr.push(i);
		}
		return arr;
	}
	function forTeams(object, found){
		for (var property in object) {
			if (object.hasOwnProperty(property)) {
				found(property);
			}
		}
	}
	function singleMatch(a, b){
		//probability of a winning against b
		return (
			strength[a] + strength[b] === 0 ?
			0.5: strength[a] / (strength[a] + strength[b])
		);
	}


	if(teams.indexOf(team) === -1){
		throw "team not found. spelling mistake?"
	}

	var tree = [];
	/*
	tree[i][t] is the probability
	of team t being present at tree node i
	*/

	//first round
	range(8).forEach(function(_){
		var i = 7 + _;
		tree[i] = {};
		var left    = teams[2*i + 1 - 15];
		var right   = teams[2*i + 2 - 15];
		var leftWin = singleMatch(left, right);
		tree[i][left]  = leftWin;
		tree[i][right] = 1 - leftWin;
	});

	//second, third, forth round
	[4,2,1].forEach(function(roundID){
		range(roundID).forEach(function(_){
			var i = roundID-1 + _;
			tree[i] = {};
			var leftNode  = tree[2*i + 1];
			var rightNode = tree[2*i + 2];

			forTeams(leftNode, function(l){
				forTeams(rightNode, function(r){
					// team names l vs r
					var meet = leftNode[l] * rightNode[r];
					var leftWin = singleMatch(l, r);
					if(!(tree[i][l]))
						tree[i][l] = 0;
					if(!(tree[i][r]))
						tree[i][r] = 0;
					tree[i][l] += meet * leftWin;
					tree[i][r] += meet * (1-leftWin);
				});
			});
		});
	});
	return tree[0][team];
}

function test(){
	var strength = 	(function(){
		var v = {};
		teams.forEach(function(e){
			v[e] = 1;
		});
		v[teams[0]] = 2;
		return v;
	})();
	function padding(str, length){
		return (str+Array(length).join(' ')).substring(0, length);
	}
	function maxInArray(arr, func){
		if(!func)
			func = function(x){return x;}
		var max = -Infinity;
		arr.forEach(function(e){
			var _ = func(e);
			if(_ > max)
				max = _;
		})
		return max;
	}
	var maxLength = maxInArray(teams, function(s){
		return s.length;
	})
	var total = 0;
	teams.forEach(function(e){
		var	win = forecast(strength, e);
		total += win;
		console.log(padding(e, maxLength) + '\t' + strength[e] + '\t' + win.toFixed(4));
	});
	console.log(padding("total", maxLength) + '\t\t' + total.toFixed(4));
}

test(); //expecting the first team to be 0.1975
