/* global d3 */
const $section = d3.select('#pump');
const $target = $section.select('.target');
const $money = $section.select('.money');
const $result = $section.select('.result');
const $level = $section.select('.level');

let pumping = false;
let timePrev = null;
let timeElapsed = 0;
let moneyPumped = 0;
// const levelData = [
// 	{ ratio: 150, target: '00.50' },
// 	{ ratio: 150, target: '01.00' },
// 	{ ratio: 120, target: '02.00' },
// 	{ ratio: 120, target: '04.00' },
// 	{ ratio: 90, target: '02.50' },
// 	{ ratio: 90, target: '06.00' },
// 	{ ratio: 60, target: '05.00' },
// 	{ ratio: 60, target: '9.98' },
// 	{ ratio: 30, target: '10.00' },
// 	{ ratio: 30, target: '42.07' }
// ];

const levelData = [
	{ ratio: 150, target: '00.25' },
	// { ratio: 150, target: '01.00' },
	{ ratio: 120, target: '00.50' },
	// { ratio: 120, target: '04.00' },
	{ ratio: 90, target: '00.50' },
	// { ratio: 90, target: '06.00' },
	{ ratio: 60, target: '01.00' },
	// { ratio: 60, target: '9.98' },
	{ ratio: 30, target: '01.00' }
	// { ratio: 30, target: '42.07' }
];

let level = -1;
let attempts = 0;

function resize() {}

function formatPrecision(val) {
	return d3.format('.2f')(val);
}

function formatMoney(val) {
	return d3.format('05.2f')(val);
}

function next() {
	attempts = 0;
	level += 1;
	timeElapsed = 0;
	moneyPumped = 0;
	const formatted = formatMoney(levelData[level].target);
	$target.text(`Pump exactly $${formatted} of gas.`);
	$level.text(`Level ${level}`)
}

function tick() {
	const timeCur = Date.now();
	const timeDiff = timeCur - timePrev;
	timeElapsed += timeDiff;
	moneyPumped = formatMoney((timeElapsed / levelData[level].ratio) * 0.01);
	timePrev = timeCur;
	if (pumping) {
		$money.text(`$${moneyPumped}`);
		requestAnimationFrame(tick);
	}
}

function handleStart() {
	pumping = true;
	timePrev = Date.now();
	timeElapsed = 0;
	attempts += 1;
	$result.text('');
	requestAnimationFrame(tick);
}

function handleStop() {
	pumping = false;
	console.log(+moneyPumped, +levelData[level].target);
	const delta = Math.abs(+moneyPumped - +levelData[level].target);
	if (delta === 0) {
		$result.text(`You passed level ${level + 1} in ${attempts} attempts.`);
		next();
	} else {
		const formatted = formatMoney(delta);
		$result.text(`Off by $${formatted}. Try again.`);
	}
}

function init() {
	d3.select('button').on('mousedown touchstart', handleStart);
	window.addEventListener('mouseup', handleStop);
	window.addEventListener('touchend', handleStop);
	next();
}

export default { init, resize };
