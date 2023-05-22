window.addEventListener("DOMContentLoaded",() => {
	const fr = new RangeSlidingValue("score");
});

class RangeSlidingValue {
	constructor(id) {
		this.input = document.getElementById(id);
		this.output = document.querySelector('[data-tipp]');
		this.values = this.output?.querySelector("[data-values]");
		this.init();
	}
	init() {
		this.input?.addEventListener("input",this.update.bind(this));
		this.populateValues();
		this.update();
	}
	populateValues() {
		const digitSpan = document.createElement("span");
		digitSpan.className = "sk_range__output-value";

		const { min, max } = this.input;

		for (let v = min; v <= max; ++v) {
			const newSpan = digitSpan.cloneNode();
			newSpan.innerText = v;
			this.values?.appendChild(newSpan);
		}
	}
	update(e) {
		let value = this.input.defaultValue;
		// when manually set
		if (e) value = e.target?.value;
		// when initiated
		else this.input.value = value;

		const min = this.input.min || 0;
		const max = this.input.max || 100;
		const possibleValues = max - min;
		const relativeValue = (value - min) / possibleValues;
		const percentRaw = relativeValue * 100;
		const percent = +percentRaw.toFixed(2);
		const tipWidth = 2.5;
		const transXRaw = -tipWidth * relativeValue * possibleValues;
		const transX = +transXRaw.toFixed(2);
		const prop1 = "--percent";
		const prop2 = "--transX";

		this.input?.style.setProperty(prop1,`${percent}%`);
		this.output?.style.setProperty(prop1,`${percent}%`);
		this.values?.style.setProperty(prop2,`${transX}em`);
	}
}
