import * as React from "react";

interface EmailTemplateProps {
	firstName: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
	firstName,
}) => (
	<div>
		<h1>Welcome, {firstName}!</h1>
	</div>
);

export const getPlainText = (firstName: string) => `Welcome, ${firstName}!`;
