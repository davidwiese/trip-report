export { default } from "next-auth/middleware";
export const config = {
	matcher: ["/reports/add", "/profile", "/reports/saved", "/messages"],
};
