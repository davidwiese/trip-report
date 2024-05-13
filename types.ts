export type Rating = {
	user: string;
	rating: number;
	report: string;
};

export type Location = {
	country: string;
	region: string;
	localArea: string;
	objective: string;
};

export type Report = {
	_id: string;
	owner: string;
	title: string;
	activityType: string[];
	description: string;
	body: string;
	location: Location;
	distance: number;
	elevationGain: number;
	elevationLoss: number;
	duration: number;
	startDate: string;
	endDate: string;
	images?: string[];
	caltopoUrl?: string;
	gpxKmlFile?: string;
	isFeatured: boolean;
	ratings: Rating[];
	createdAt: string;
	updatedAt: string;
};

export type User = {
	_id: string;
	email: string;
	username: string;
	password?: string;
	provider?: string;
	providerId?: string;
	bio?: string;
	totalReports: number;
	totalDistance: number;
	totalElevationGain: number;
	totalElevationLoss: number;
	reports: Report[];
	image?: string;
	bookmarks: Report[];
	createdAt: string;
	updatedAt: string;
};

export type Message = {
	_id: string;
	sender: {
		_id: string;
		username?: string;
	};
	recipient: {
		_id: string;
		username?: string;
	};
	subject: string;
	body: string;
	read: boolean;
	createdAt: string;
	updatedAt: string;
};
