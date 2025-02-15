import { type Schema, Zero, type ZeroOptions } from "@rocicorp/zero";

// This is the state of the Zero instance
// You can reset it on login or logout
export class Z<TSchema extends Schema> {
	// biome-ignore lint/style/noNonNullAssertion: Zero instance will always be defined
	current: Zero<TSchema> = $state(null!);

	constructor(z_options: ZeroOptions<TSchema>) {
		this.build(z_options);
	}

	build(z_options: ZeroOptions<TSchema>) {
		// Create new Zero instance
		this.current = new Zero(z_options);
	}

	close() {
		this.current?.close();
	}
}
