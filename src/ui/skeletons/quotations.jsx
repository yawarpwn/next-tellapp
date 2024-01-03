const shimmer =
	'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent'

export function InvoiceSkeleton() {
	return (
		<div className='flex flex-row items-center justify-between border-b border-gray-800 py-4'>
			<div className='flex items-center'>
				<div className='mr-2 h-8 w-8 rounded-full bg-base-200' />
				<div className='min-w-0'>
					<div className='h-5 w-40 rounded-md bg-base-200' />
					<div className='mt-2 h-4 w-12 rounded-md bg-base-200' />
				</div>
			</div>
			<div className='mt-2 h-4 w-12 rounded-md bg-base-200' />
		</div>
	)
}

export function LatestInvoicesSkeleton() {
	return (
		<div
			className={`${shimmer} relative flex w-full flex-col overflow-hidden md:col-span-4 lg:col-span-4`}
		>
			<div className='mb-4 h-8 w-36 rounded-md bg-base-100' />
			<div className='flex grow flex-col justify-between rounded-xl bg-base-100 p-4'>
				<div className='bg-white px-6'>
					<InvoiceSkeleton />
					<InvoiceSkeleton />
					<InvoiceSkeleton />
					<InvoiceSkeleton />
					<InvoiceSkeleton />
					<div className='flex items-center pb-2 pt-6'>
						<div className='h-5 w-5 rounded-full bg-base-200' />
						<div className='ml-2 h-4 w-20 rounded-md bg-base-200' />
					</div>
				</div>
			</div>
		</div>
	)
}

export function TableRowSkeleton() {
	return (
		<tr className='w-full border-b border-neutral-800 last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg'>
			{/* Nro */}
			<td className='whitespace-nowrap px-3 py-3'>
				<div className='h-6 w-10 rounded bg-base-100'></div>
			</td>
			{/* Cliente */}
			<td className='whitespace-nowrap px-3 py-3'>
				<div className='h-6 w-[300px] rounded bg-base-100'></div>
			</td>
			{/* Fecha */}
			<td className='whitespace-nowrap px-3 py-3'>
				<div className='h-6 w-16 rounded bg-base-100'></div>
			</td>
			{/* Total */}
			<td className='whitespace-nowrap px-3 py-3'>
				<div className='h-6 w-16 rounded bg-base-100'></div>
			</td>
			{/* Acciones */}
			<td className='whitespace-nowrap py-3 pl-6 pr-3'>
				<div className='flex justify-end gap-3'>
					<div className='h-[38px] w-[38px] rounded bg-base-100'></div>
					<div className='h-[38px] w-[38px] rounded bg-base-100'></div>
				</div>
			</td>
		</tr>
	)
}

export function InvoicesMobileSkeleton() {
	return (
		<div className='mb-2 w-full rounded-md bg-base-300 p-4'>
			<div className='flex items-center justify-between border-b border-gray-100 pb-8'>
				<div className='flex items-center'>
					<div className='mr-2 h-8 w-8 rounded-full bg-base-100'></div>
					<div className='h-6 w-16 rounded bg-base-100'></div>
				</div>
				<div className='h-6 w-16 rounded bg-base-100'></div>
			</div>
			<div className='flex w-full items-center justify-between pt-4'>
				<div>
					<div className='h-6 w-16 rounded bg-base-100'></div>
					<div className='mt-2 h-6 w-24 rounded bg-base-100'></div>
				</div>
				<div className='flex justify-end gap-2'>
					<div className='h-10 w-10 rounded bg-base-100'></div>
					<div className='h-10 w-10 rounded bg-base-100'></div>
				</div>
			</div>
		</div>
	)
}

export function QuotationsTableSkeleton() {
	return (
		<div className='mt-6 flow-root'>
			<div className='inline-block min-w-full align-middle'>
				<div className='rounded-lg bg-black p-2 md:pt-0'>
					<div className='md:hidden'>
						<InvoicesMobileSkeleton />
						<InvoicesMobileSkeleton />
						<InvoicesMobileSkeleton />
						<InvoicesMobileSkeleton />
						<InvoicesMobileSkeleton />
					</div>
					<table className='hidden min-w-full text-gray-900 md:table'>
						<thead className='rounded-lg text-left text-sm font-normal'>
							<tr>
								<th scope='col' className='px-4 py-5 font-medium sm:pl-6'>
									Nro
								</th>
								<th scope='col' className='px-3 py-5 font-medium'>
									Cliente
								</th>
								<th scope='col' className='px-3 py-5 font-medium'>
									Fecha
								</th>
								<th scope='col' className='px-3 py-5 font-medium'>
									Total
								</th>
								<th scope='col' className='px-3 py-5 font-medium'>
									Acciones
								</th>
							</tr>
						</thead>
						<tbody>
							<TableRowSkeleton />
							<TableRowSkeleton />
							<TableRowSkeleton />
							<TableRowSkeleton />
							<TableRowSkeleton />
							<TableRowSkeleton />
							<TableRowSkeleton />
							<TableRowSkeleton />
							<TableRowSkeleton />
							<TableRowSkeleton />
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}
