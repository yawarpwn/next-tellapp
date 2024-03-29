import { EditCustomerForm } from '@/components/customers'
import { NoResultRow } from '@/components/ui/no-result-row'
import { fetchFilteredCustomers } from '@/lib/data/customers'
import DeleteForm from './delete-form'

interface Props {
	query: string
	currentPage: number
}
export default async function CustomersTable({ query, currentPage }: Props) {
	const customers = await fetchFilteredCustomers({ query, currentPage })
	const hasCustomers = customers.length > 0
	return (
		<div className='overflow-x-auto'>
			<table className='table'>
				{/* head */}
				<thead>
					<tr>
						<th>Nombre</th>
						<th>Ruc</th>
						<th>Dirección</th>
						<th>Telefono</th>
						<th>Acciones</th>
					</tr>
				</thead>
				<tbody>
					{hasCustomers
						? customers.map(customer => {
							const { id, phone, email, ruc, name, address } = customer
							return (
								<tr key={id}>
									<td>
										<div>
											<p className='min-w-[250px] '>{name}</p>
										</div>
									</td>
									<td>{ruc}</td>
									<td>
										<p className='min-w-[250px] text-[10px]'>
											{address}
										</p>
									</td>
									<td>{phone}</td>
									<td>
										<div className='flex gap-2'>
											<EditCustomerForm customer={customer} />
											<DeleteForm id={id} />
										</div>
									</td>
								</tr>
							)
						})
						: <NoResultRow query={query} colSpan={5} />}
				</tbody>
			</table>
		</div>
	)
}
