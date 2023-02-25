setTimeout(() => {
})

process.nextTick(() => console.log('next tick1'));

queueMicrotask(() => console.log('mt1'));

process.nextTick(() => console.log('next tick2'));

queueMicrotask(() => console.log('mt2'));

setTimeout(() => {
	console.log('set timeout-1')
	queueMicrotask(() => console.log('mt3'));
	process.nextTick(() => console.log('next tick3'));

},0)

setTimeout(() => console.log('set timeout-2'),0);

setImmediate(() => {
	console.log('set immediate1')
	queueMicrotask(() => console.log('mt4'));
	process.nextTick(() => console.log('next tick4'));
});

setImmediate(() => {
	console.log('set immediate2')
});

process.nextTick(() => console.log('next tick5'));

// mt1 mt2
// 1 2 5
// setImmediate 1
// 4
// mt4
// set immediate 2
// set timeout 1
// 3
// mt3
// settimeout 2
