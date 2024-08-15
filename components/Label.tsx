interface LabelProps {
	htmlFor: string;
	required?: boolean;
	children: React.ReactNode;
}

const Label: React.FC<LabelProps> = ({
	htmlFor,
	required = false,
	children,
}) => (
	<label
		htmlFor={htmlFor}
		className={`block text-gray-700 font-bold mb-2 ${
			required ? "required" : ""
		}`}
	>
		{children}
		{required && <span className="text-red-500 ml-1">*</span>}
	</label>
);

export default Label;
