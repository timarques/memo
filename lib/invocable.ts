abstract class Invocable<T extends unknown[]> extends Function {

	private readonly bound: Invocable<T>

	constructor() {
		super("...args", "return this.bound.invoke(...args)");
		this.bound = this.bind(this);
		return this.bound;
	}

	protected abstract invoke(...args: T): unknown;

}

export default Invocable;
