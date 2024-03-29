'use client'
import { Input }Search from '@/components/ui/input-search'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
function SearchCustomers() {
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const { replace } = useRouter()

	const handleSearch = useDebouncedCallback(term => {
		const params = new URLSearchParams(searchParams)
		if (term) {
			params.set('page', '1')
			params.set('query', term)
		} else {
			params.delete('query')
			params.delete('page')
		}
		replace(`${pathname}?${params.toString()}`)
	}, 300)

	return (
		<div>
			<InputSearch
				onSearchChange={event => handleSearch(event.target.value)}
				placeholder={'Buscar Cliente...'}
			/>
		</div>
	)
}

export default SearchCustomers
