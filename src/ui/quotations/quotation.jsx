import { EditIcon } from '@/icons'
import { fetchQuotationById } from '@/lib/data/quotations'
import DownloadPDF from '@/ui/pdf/download-pdf'
import { getIgv } from '@/utils'
import Link from 'next/link'

export async function Quotation({ number }) {
	const quotation = await fetchQuotationById({ number })
	const { create_at, items, include_igv } = quotation
	const formatedDate = new Intl.DateTimeFormat('es').format(create_at)
	const { total, subTotal, igv } = getIgv(quotation.items)
	return (
		<>
			<header className='flex justify-end gap-x-2'>
				<div className='flex gap-2'>
					<Link
						href={`/quotations/${number}/update`}
						className='btn btn-primary'
					>
						<EditIcon />
						<span className='hidden lg:block'>Editar</span>
					</Link>
					<DownloadPDF quotation={quotation} />
				</div>
			</header>

			{/* Contenido */}
			<div className='rounded-lg shadow overflow-hidden flex flex-col gap-4 mt-4'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<h2 className='text-2xl font-bold'>#{number}</h2>
						{!include_igv && (
							<span className='badge inline-block badge-sm  badge-warning'>
								Sin IGV
							</span>
						)}
					</div>
					<div>
						<p className='text-sm'>Fecha: {formatedDate}</p>
					</div>
				</div>
				<div>
					<h3>{quotation.company}</h3>
					<p className='text-xs'>{quotation?.address ?? 'Sin dirección'}</p>
				</div>
				<p>
					Tiempo de entrega:{' '}
					<strong className='text-warning'>{quotation.deadline} días</strong>
					{' '}
					hábiles
				</p>
				<div className='overflow-x-auto'>
					<table className='table'>
						<thead>
							<tr>
								<th>Descripción</th>
								<th>U/M</th>
								<th>Cant</th>
								<th>Si IGv</th>
								<th>P.Unit</th>
								<th>Total</th>
							</tr>
						</thead>
						<tbody>
							{items.map(item => {
								const total = (item.price * item.qty).toFixed(2)
								return (
									<tr key={item.id}>
										<td>
											<p className='w-[300px]'></p>
											{item.description}
										</td>
										<td>{item.unit_size}</td>
										<td>{item.qty}</td>
										<td>{(item.price / 1.18).toFixed(4)}</td>
										<td>{item.price.toFixed(2)}</td>
										<td>{total}</td>
									</tr>
								)
							})}
							<tr>
								<td
									colSpan={4}
									className='text-right py-3 px-4 uppercase font-semibold text-sm text-primary'
								>
									Subtotal:
								</td>
								<td colSpan='' className='text-left py-3 px-4'>
									{subTotal}
								</td>
							</tr>
							<tr>
								<td
									colSpan={4}
									className='text-right py-3 px-4 uppercase font-semibold text-sm text-primary'
								>
									IGV:
								</td>
								<td colSpan='' className='text-left py-3 px-4'>
									{igv}
								</td>
							</tr>
							<tr>
								<td
									colSpan={4}
									className='text-right py-3 px-4 uppercase font-semibold text-sm text-primary'
								>
									Total :
								</td>
								<td colSpan='' className='text-left py-3 px-4'>
									{total}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</>
	)
}