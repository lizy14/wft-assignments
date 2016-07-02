# javascript fundamentals

## basis
### Ex. 1

	var func = {
		getNum: function(){return this.num;},
		num: 1
	};
	console.log((function(){
		return typeof arguments[0]();
	})(func.getNum));

Output is `'undefined'`.

Inside the call to `arguments[0]`, `this` points to some mysterious object (discussed below), where there is nothing in the name of `num`.


#### Variant 1:  

	(function(){
		return typeof arguments[0].call(func);
	})(func.getNum);

Since `getNum`'s `this` is set to `func`, undoubtedly the output is `'number'`.

#### Variant 2:

	(function(){
		arguments.num = 'hello, world';
		return typeof arguments[0]();
	})(func.getNum);

Output becomes `'string'`. Now we know that the "mysterious object" mentioned above is `arguments` of the anonymous function. It can be learned that the value of a function's `this` is strongly dependent on how it's called.

### Ex. 2

	var x = 0;
	function foo(){
		x++;
		this.x = x;
		return foo;
	}
	var bar = new new foo;
	console.log(bar.x);

Output is `undefined`. Again this is all about `this`. Line 4 `foo` assigns to an dynamic property `x` of the instance itself, but has no effect on the newly referred `foo` on line 5.

The following variant is introduced to illustrate this.

#### Variant

	function foo(){
		x++;
		var new_foo = foo;
		new_foo.x = x;
		return new_foo;
	}

Output becomes `2` as expected.

### Ex. 3

	function bar(){
		return foo;
		foo = 10;
		function foo(){}
		var foo = '11';
	}
	console.log(typeof bar());

Output is `'function'`. The interpreter sees the function declaration `function foo(){}`, while the other assignment statements are ignored until they are actually executed.

### Ex. 4

	var x = 3;
	var foo = {
		x: 2,
		baz: {
			x: 1,
			bar: function(){
				debugger;
				return this.x;
			}
		}
	}
	var go = foo.baz.bar;
	console.log(go());
	console.log(foo.baz.bar());

Outputs are `3` and `1`.

On the call to `go()`, `this` inside the function `bar` points to the global object `window`, who is the caller. The assignment made to `window.x` is made on the first line, making the value of which a `3`. On the call to `foo.baz.bar()`, the caller is `foo.baz`, within whose scope the value of `x` is `1`.

However, I got different results when I copy and paste the codes into an `foo.js` file and then execute it with `node foo.js`. Outputs become `undefined` and `1`.

Even more confusingly, when I execute `node` to start the interpreter in an interactive mode, and key-in the codes line by line, I got `3` and `1`. I know nothing about the V8 engine, and I have absolutely no idea how to explain this.

### Ex. 5

	function aaa(){
		return {
			test: 1
		};
	}
	console.log(typeof aaa());

Output is `'object'`.

`aaa()` returns `{test: 1}`, which with no doubt is an object.

## advanced

### tournament result prediction

The tournament can be considered as a binary tree, where node `i` represents the winner of its children. Each node of the tree is a set of key-value pairs, where the key is the name of a team, and the value is a probability. To be more specific, `tree[i][t]` represents the probability of team `t` being present at node `i`.

Initially all the 16 teams are located at leaves. The algorithm calculates round by round, bottom-up the value of `tree[i][t]`: for all the pair of teams `l` from `tree[2*i+1]` and `r` from `tree[2*i+2]`, calculate the probability of `l` winning against `r` in a single match, and then multiply it with the probability of the match between them to happen (which should be `tree[2*i+1][l] * tree[2*i+2][r]`), result of which is added to `tree[i][l]`.

Now `tree[0]` is all we want.

Tests are written, located in `test()`, hereinafter the same.

### overloaded search

A function with the name of `check` is defined to check if an element satisfies the query. Its implementation is dependent on type of the query.

After choosing the proper version of `check`, a sequential search is performed, calling `check` on each element to decide whether or not it should be in the result set.

## bonus

// TODO
