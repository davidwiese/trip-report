import Link from "next/link";

type PaginationProps = {
	page: number;
	pageSize: number;
	totalItems: number;
	basePath: string;
};

const Pagination: React.FC<PaginationProps> = ({
	page,
	pageSize,
	totalItems,
	basePath,
}) => {
	const totalPages = Math.ceil(totalItems / pageSize);

	// Check if page or pageSize is invalid
	if (isNaN(page) || isNaN(pageSize) || pageSize <= 0) {
		return <div>Invalid search parameters</div>;
	}

	return (
		<section className="container mx-auto flex justify-center items-center my-8">
			{page > 1 ? (
				<Link
					className="mr-2 px-2 py-1 border border-gray-300 rounded"
					href={`${basePath}?page=${page - 1}&pageSize=${pageSize}`}
					scroll={false}
				>
					Previous
				</Link>
			) : null}
			<span className="mx-2">
				Page {page} of {totalPages}
			</span>
			{page < totalPages ? (
				<Link
					className="ml-2 px-2 py-1 border border-gray-300 rounded"
					href={`${basePath}?page=${page + 1}&pageSize=${pageSize}`}
					scroll={false}
				>
					Next
				</Link>
			) : null}
		</section>
	);
};
export default Pagination;
