/// <reference types="@sveltejs/kit" />

declare namespace App {
	// interface Platform {}
	// interface Locals {}
	// interface Error {}
	// interface Session {}
	// interface Stuff {}
}

type Light = {
	id: string;
	name: string;
	on: boolean;
	brightness: number;
	color: [[number, number, number]];
	reachable: boolean;
	type: string;
	model: string;
	manufacturer: string;
	uniqueid: string;
	swversion: string;
	productid: string;
};

type Plug = {
	id: string;
	name: string;
	on: boolean;
	reachable: boolean;
	type: string;
	model: string;
	manufacturer: string;
	uniqueid: string;
	swversion: string;
	productid: string;
};

type LightInput = {
	on?: boolean;
	brightness?: number;
	color?: [[number, number, number]];
};

type PlugInput = {
	on?: boolean;
};

type User = {
	username: string;
	email: string;
	profilePicture?: string;
};

type HueBridge = {
	id: string;
	ip: string;
	user: string;
};

type ElementColor =
	| 'red'
	| 'yellow'
	| 'green'
	| 'purple'
	| 'blue'
	| 'light'
	| 'dark'
	| 'primary'
	| 'none'
	| 'alternative'
	| undefined;
