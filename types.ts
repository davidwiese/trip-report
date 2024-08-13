import { Types } from "mongoose";

export type Location = {
	country: string;
	region: string;
	localArea: string;
	objective: string;
};

export type ImageObject = {
	url: string;
	originalFilename: string;
};

export type GpxFileObject = {
	url: string;
	originalFilename: string;
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
	images?: ImageObject[];
	caltopoUrl?: string;
	gpxFile?: GpxFileObject;
	isFeatured: boolean;
	createdAt: string;
	updatedAt: string;
};

export type User = {
	_id: Types.ObjectId;
	clerkId: string;
	email: string;
	username: string;
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
	name: string;
	email: string;
	body: string;
	read: boolean;
	createdAt: string;
	updatedAt: string;
};
