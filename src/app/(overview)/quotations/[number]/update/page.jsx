import { updateQuotation } from '@/lib/actions/quoatations'
import { fetchQuotationById } from '@/lib/data/quotations'
import Breadcrumbs from '@/ui/breadcrumbs'
import EditForm from '@/ui/quotations/edit-form'
import { CreateUpdateQuotationSkeleton } from '@/ui/skeletons/quotations'
import { Suspense } from 'react'

async function EditFormWrapper({ number }) {
	const quotation = await fetchQuotationById({ number })
	return (
		<EditForm
			action={updateQuotation}
			quotationToUpdate={quotation}
		/>
	)
}

async function UpdatePage({ params }) {
	const { number } = params
	return (
		<>
			<Breadcrumbs
				breadcrumbs={[
					{
						label: 'Cotizaciones',
						href: '/quotations',
					},
					{
						label: `#${number}`,
						href: `/quotations/${number}`,
					},
					{
						label: 'Editar',
						href: `/quotations/${number}/update`,
						active: true,
					},
				]}
			/>
			<Suspense fallback={<CreateUpdateQuotationSkeleton isEdit />}>
				<EditFormWrapper number={number} />
			</Suspense>
		</>
	)
}

export default UpdatePage
