function f(i){
	console.log("#" + i);
}
f(1);
(function(){
	var func = {
		getNum: function(){return this.num;},
		num: 1
	};
	console.log((function(){
		return typeof arguments[0]();
	})(func.getNum));
})();

f(2);
(function(){
	var x = 0;
	function foo(){
		x++;
		this.x = x;
		return foo;
	}
	var bar = new new foo;
	console.log(bar.x);
})();

f(3);
(function(){
	function bar(){
		return foo;
		foo = 10;
		function foo(){}
		var foo = '11';
	}
	console.log(typeof bar());
})();

f(4);
(function(){
	var x = 3;
	var foo = {
		x: 2,
		baz: {
			x: 1,
			bar: function(){
				return this.x;
			}
		}
	}
	var go = foo.baz.bar;
	console.log(go());
	console.log(foo.baz.bar());
})();

f(5);
(function(){
	function aaa(){
		return {
			test: 1
		};
	}
	console.log(typeof aaa());
})();
