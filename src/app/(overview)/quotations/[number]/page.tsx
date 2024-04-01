import Breadcrumbs from '@/components/breadcrumbs'
import { QuotationPageByNumber } from '@/components/quotations/quotation'
import { QuotationSkeleton } from '@/components/skeletons/quotations'
import { Suspense } from 'react'

async function QuotationPage({ params }: { params: { number: string } }) {
	const number = Number(params.number)
	return (
		<>
			<Breadcrumbs
				breadcrumbs={[
					{
						label: 'Cotizaciones',
						href: '/quotations',
					},
					{
						label: ` #${number}`,
						href: `/quotations/${number}`,
						active: true,
					},
				]}
			/>
			<Suspense fallback={<QuotationSkeleton />}>
				<QuotationPageByNumber number={number} />
			</Suspense>
		</>
	)
}

export default QuotationPage
