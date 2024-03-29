'use client'
import { generatePagination } from '@/lib/utils'
import clsx from 'clsx'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

export function Pagination({ totalPages }: { totalPages: number }) {
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const currentPage = Number(searchParams.get('page') || 1)
	const allPages = generatePagination(currentPage, totalPages)

	const createPageURL = (pageNumber: number | string) => {
		const params = new URLSearchParams(searchParams)
		params.set('page', pageNumber.toString())
		return `${pathname}?${params.toString()}`
	}

	return (
		<div className='flex items-center justify-center mt-4'>
			<PaginationArrow
				href={createPageURL(currentPage - 1)}
				direction='left'
				isDisabled={currentPage <= 1}
			/>
			<div className='join'>
				{allPages.map((page, index) => {
					let position

					if (index === 0) position = 'first'
					if (index === allPages.length - 1) position = 'last'
					if (allPages.length === 1) position = 'single'
					if (page === '...') position = 'middle'

					return (
						<PaginationNumber
							key={page}
							href={createPageURL(page)}
							page={page}
							position={position}
							isActive={page === currentPage}
						/>
					)
				})}
			</div>
			<PaginationArrow
				direction='right'
				href={createPageURL(currentPage + 1)}
				isDisabled={currentPage >= totalPages}
			/>
		</div>
	)
}

function PaginationArrow({ href, direction, isDisabled }: {
	href: string
	direction: 'left' | 'right'
	isDisabled: boolean
}) {
	const icon = direction === 'left' ? <ArrowLeftIcon /> : <ArrowRightIcon />

	return isDisabled
		? <div className='btn btn-sm btn-disabled'>{icon}</div>
		: (
			<Link href={href} className='btn btn-sm'>
				{icon}
			</Link>
		)
}

function PaginationNumber({ isActive, href, position, page }: {
	isActive: boolean
	href: string
	position?: 'first' | 'last' | 'middle' | 'single'
	page: number | string
}) {
	const className = clsx('join-item btn btn-sm', {
		'btn-active': isActive,
	})
	return isActive || position === 'middle'
		? <div className={className}>{page}</div>
		: (
			<Link className={className} href={href}>
				{page}
			</Link>
		)
}

export default Pagination
