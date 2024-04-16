import Link from "next/link";

type PaginationProps = {
	page: number;
	pageSize: number;
	totalItems: number;
};

const Pagination: React.FC<PaginationProps> = ({
	page,
	pageSize,
	totalItems,
}) => {
	const totalPages = Math.ceil(totalItems / pageSize);

	return (
		<section className="container mx-auto flex justify-center items-center my-8">
			{page > 1 ? (
				<Link
					className="mr-2 px-2 py-1 border border-gray-300 rounded"
					href={`/reports?page=${page - 1}&pageSize=${pageSize}`}
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
					href={`/reports?page=${page + 1}&pageSize=${pageSize}`}
				>
					Next
				</Link>
			) : null}
		</section>
	);
};
export default Pagination;
