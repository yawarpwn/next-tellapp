import { unstable_noStore as noStore } from 'next/cache'
import { ITEMS_PER_PAGE } from '@/constants'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// export async function fetchCustomers() {
//   const cookieStore = cookies()
//   const supabase = createServerComponentClient({ cookies: () => cookieStore })
//   await new Promise(resolve => setTimeout(resolve, 1000))
//   try {
//     const { data } = await supabase.from('customers').select().limit(10)
//     return data
//   } catch (error) {
//     console.log('Error Database', error)
//     throw new Error('Error fetching customers')
//   }
// }
export async function fetchFilteredProducts({ query = '', currentPage = 1 }) {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })
  try {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE
    const { data } = await supabase
      .from('products')
      .select('*')
      .ilike('description', `%${query}%`)
      .limit(ITEMS_PER_PAGE)
      .range(offset, offset + ITEMS_PER_PAGE)
    return data
  } catch (error) {
    console.log('Error Database', error)
    throw new Error('Error fetching customers')
  }
}

export async function fetchProductsPages(query = '') {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })
  noStore()
  try {
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact' })
      .ilike('description', `%${query}%`)
    const totalPages = Math.ceil(count / ITEMS_PER_PAGE)
    return totalPages
  } catch (error) {
    console.log('Database Error: ', error)
    throw new Error('Failed to fetch total number of customers')
  }
}
