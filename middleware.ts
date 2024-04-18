export { default } from "next-auth/middleware";
export const config = {
	matcher: [
		"/reports/add",
		// NOTE: editing a report should be a private route
		"/reports/:id/edit",
		"/profile",
		"/reports/saved",
		"/messages",
	],
};
