const ITEMS_PER_PAGE = 9
import { type Signal } from '@/types'

import { TABLES } from '@/constants'
import { cookies } from 'next/headers'
import { createClient } from '../supabase/server'

export async function fetchSignals() {
	const cookiesStore = cookies()
	const supabase = createClient(cookiesStore)

	const { data: signals, error } = await supabase.from(TABLES.Signals).select()

	if (error) {
		throw error
	}

	return signals
}

export async function fetchSignalsPages(query = '') {
	// create supabase client
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const { count, error } = await supabase
		.from(TABLES.Signals)
		.select('*', { count: 'exact' })
		.or(`title.ilike.%${query}%, code.ilike.%${query}%`)

	if (error) {
		console.log(error)
	}

	if (!count) return 0

	return Math.ceil(count / ITEMS_PER_PAGE)
}

export async function fetchFilteredSignals(
	query: string,
	currentPage: number,
) {
	// create supabase client
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const offset = (currentPage - 1) * ITEMS_PER_PAGE

	const { data: signals, error } = await supabase
		.from(TABLES.Signals)
		.select()
		.or(`title.ilike.%${query}%, code.ilike.%${query}%`)
		.range(offset, offset + ITEMS_PER_PAGE)
		.order('updated_at', { ascending: false })
		.returns<Signal[]>()

	if (error) {
		console.log(error)
	}

	return signals
}

export async function fetchSignalById(id: string) {
	// create supabase client
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const { data: signals, error } = await supabase
		.from(TABLES.Signals)
		.select('*')
		.eq('id', id)

	if (error) {
		console.log(error)
	}

	return signals[0]
}
