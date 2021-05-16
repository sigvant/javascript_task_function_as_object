// Set and decrease for counter
// importance: 5
// Modify the code of makeCounter() so that the counter can also decrease and set the number:

// counter() should return the next number (as before).
// counter.set(value) should set the counter to value.
// counter.decrease() should decrease the counter by 1.
// See the sandbox code for the complete usage example.

// P.S. You can use either a closure or the function property to keep the current count. Or write both variants.

// attempt at solution

// The solution uses 'count' in the local variable, but addition methods are written right into the counter.
// They share the same outer lexical environment and also can access the current count

function makeCounter() {
	let count = 0;

	function counter() {
		return count++;
	}

	counter.set = value => count = value;
	counter.decrease = () => count--;

	return counter();
}

// Sum with an arbitrary amount of brackets
// importance: 2
// Write function sum that would work like this:

sum(1)(2) == 3; // 1 + 2
sum(1)(2)(3) == 6; // 1 + 2 + 3
sum(5)(-1)(2) == 6
sum(6)(-1)(-2)(-3) == 0
sum(0)(1)(2)(3)(4)(5) == 15

// P.S. Hint: you may need to setup custom object to primitive conversion for your function.

// ## Attempt at Solution

// 1. For the whole thing to work anyhow, the result of 'sum' must be function.
// 2. that function must keep in memory the current value between calls.
// 3. According to the task, the function must become the number when used in == Functions are objects,
// so the conversion happens as described in the chapter Object to primitive conversion, and we can provide
// our own method that returns the number.

// now the code:

function sum(a) {

	let currentSum = a;

	function f(b) {
		currentSum += b;
		return f;
	}

	f.toString = function() {
		return currentSum;
	};

	return f;
}

// please note that the sum function actually works only once. Ir returns function f. Then, on each subsequent call,
// f adds its parameter to the sum currentSum, and returns itself. THERE IS NO RECURSION IN THE LAST LINE OF f.
// recursion requires the function to call itself, not return itself.

function f(b) {
	currentSum += b;
	return f(); // <-- recursive call
}

function f(b) {
	currentSum += b;
	return f;
}

// the f will be used in the next call, again returning itself as many tmies as needed. Then, when used as a
// number or a string - the toString returns the currentSum. we could also use Symbol.toPrimitive or valueOf here
// for the conversion

// ################################################################################################################

// Output every second
// importance: 5
// Write a function printNumbers(from, to) that outputs a number every second, starting from from and 
// ending with to.

// Make two variants of the solution.

// 1. Using setInterval.
// 2. Using nested setTimeout.


// ## using setInterval:

#
function printNumbers(from, to) {
	let current = from;

	let timerId = setInterval(function() {
		alert(current);
		if(current == to) { // stops the counter when current = end number
			clearInterval(timerId);
		}
		current++;
	}, 1000);
}

// usage:
printNumbers(5, 10);
#

using nested setTimeout:

function printNumbers(from, to) {
	let current = from;

	setTimeout(function go() {
		alert(current);
		if(current < to) {
			setTimeout(go, 1000);
		}
		current++;
	}, 1000);
}

// usage:
printNumbers(5, 10);

// note that in both solutions, there is an initial delay before the first output. The function is called after
// 1000ms the first time.

// if we also want the function to run immediately, then we can add an additional call on a separate line, 
// like this:

function printNumbers(from, to) {
	let current = from;

	function go() {
		alert(current);
		if (current == to) {
			clearInterval(timerId);
		}
		current++;
	}

	go();
	let timerId = setInterval(go, 1000);
}

printNumbers(5, 10);

// ############################################################################################################

// What will setTimeout show?

// importance: 5
// In the code below there’s a setTimeout call scheduled, then a heavy calculation is run, that takes 
// more than 100ms to finish.

// When will the scheduled function run?

// After the loop.
// Before the loop.
// In the beginning of the loop.
// What is alert going to show?

let i = 0;

setTimeout(() => alert(i), 100); // ?

// assume that the time to execute this function is >100ms
for(let j = 0; j < 100000000; j++) {
  i++;
}

Any setTimeout will run only after the current code has finished.
The i will be the last one: 1000000000

// it will wait until the code has finished and execute setTimeout after it.

// ############################################################################################################

// Spy decorator
// importance: 5
// Create a decorator spy(func) that should return a wrapper that saves all calls to 
// function in its calls property.

// Every call is saved as an array of arguments.

// For instance:

function work(a, b) {
  alert( a + b ); // work is an arbitrary function or method
}

work = spy(work);

work(1, 2); // 3
work(4, 5); // 9

for (let args of work.calls) {
  alert( 'call:' + args.join() ); // "call:1,2", "call:4,5"
}

// P.S. That decorator is sometimes useful for unit-testing. Its advanced form is sinon.spy in Sinon.JS library.

// ## solution

// The wrapper returned by spy(f) should store all arguments and then use f.apply to forward the call.

function spy(func) {

	function wrapper(...args) {
		// using ...args instead of arguments to store 'real' array in wrapper.
		wrapper.calls.push(args);
		return func.apply(this, args);
	}

	wrapper.calls = [];

	return wrapper;
}

// ############################################################################################################

// Delaying decorator
// importance: 5
// Create a decorator delay(f, ms) that delays each call of f by ms milliseconds.

// For instance:

function f(x) {
  alert(x);
}

// create wrappers
let f1000 = delay(f, 1000);
let f1500 = delay(f, 1500);

f1000("test"); // shows "test" after 1000ms
f1500("test"); // shows "test" after 1500ms

// In other words, delay(f, ms) returns a "delayed by ms" variant of f.

// In the code above, f is a function of a single argument, but your solution should pass 
// all arguments and the context this.

// The solution:

function delay(f, ms) {

  return function() {
    setTimeout(() => f.apply(this, arguments), ms);
  };

}

let f1000 = delay(alert, 1000);

f1000("test"); // shows "test" after 1000ms

// Please note how an arrow function is used here. As we know, arrow functions do not have own this and 
// rguments, so f.apply(this, arguments) takes this and arguments from the wrapper.

// If we pass a regular function, setTimeout would call it without arguments and this=window (assuming we’re 
// 	in the browser).

// We still can pass the right this by using an intermediate variable, but that’s a little bit more cumbersome:

function delay(f, ms) {

  return function(...args) {
    let savedThis = this; // store this into an intermediate variable
    setTimeout(function() {
      f.apply(savedThis, args); // use it here
    }, ms);
  };

}

// ############################################################################################################
