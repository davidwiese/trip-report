export type Report = {
	_id: string;
	owner: string;
	title: string;
	activityType: string;
	description: string;
	location: string;
	distance: number;
	elevationGain: number;
	elevationLoss: number;
	duration: number;
	startDate: string;
	endDate: string;
	images: string[];
	isFeatured: boolean;
	createdAt: string;
	updatedAt: string;
};

export type Message = {
	_id: string;
	sender: {
		_id: string;
		username: string;
	};
	recipient: string;
	report: {
		_id: string;
		name: string;
	};
	name: string;
	email: string;
	phone: string;
	body: string;
	read: boolean;
	createdAt: string;
	updatedAt: string;
};

export type User = {
	_id: string;
	email: string;
	username: string;
	image?: string;
	bookmarks: Report[];
	createdAt: string;
	updatedAt: string;
};
