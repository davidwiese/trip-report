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

	// If there are no items, don't render pagination
	if (totalItems === 0) {
		return null;
	}

	// Check if page or pageSize is invalid
	if (isNaN(page) || isNaN(pageSize) || pageSize <= 0) {
		return <div>Invalid search parameters</div>;
	}

	return (
		<section className="container mx-auto flex justify-center items-center my-8">
			{page > 1 ? (
				<Link
					className="mr-2 px-2 py-1 border border-gray-300 rounded dark:text-white dark:bg-black hover:bg-[#f1f5f9] dark:hover:bg-[#252525]"
					href={`${basePath}?page=${page - 1}&pageSize=${pageSize}`}
					scroll={false}
				>
					Previous
				</Link>
			) : null}
			<span className="mx-2 dark:text-white">
				Page {page} of {totalPages}
			</span>
			{page < totalPages ? (
				<Link
					className="ml-2 px-2 py-1 border border-gray-300 rounded dark:text-white dark:bg-black hover:bg-[#f1f5f9] dark:hover:bg-[#252525]"
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
