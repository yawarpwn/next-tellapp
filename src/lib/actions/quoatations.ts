'use server'

import { TABLES } from '@/constants'
import { createClient } from '@/lib/supabase/server'
import { CreateQuotation, UpdateQuotation } from '@/schemas/quotations'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// Create Product
export async function createQuotation(_: undefined, formData: FormData) {
	const rawData = {
		number: formData.get('number'),
		ruc: formData.get('ruc') || null,
		company: formData.get('company') || 'SIN RUC PROPORCIONADO',
		address: formData.get('address'),
		deadline: formData.get('deadline'),
		items: JSON.parse(formData.get('items') as string),
		include_igv: formData.get('include_igv'),
		is_regular_customer: formData.get('is_regular_customer'),
	}

	// validated fields with zod
	const validatedFields = CreateQuotation.safeParse(rawData)

	// if error
	if (!validatedFields.success) {
		console.log('error', validatedFields.error.flatten().fieldErrors)
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Missing Fields. Failed to Create Invoice.',
		}
	}

	console.log('', validatedFields.data)

	// create supabase client
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const {
		number,
		company,
		ruc,
		address,
		deadline,
		items,
		include_igv,
		is_regular_customer,
	} = validatedFields.data

	// Si esta marco como cliente regular agregamos a la DB
	if (is_regular_customer) {
		// buscar si existe el ruc en customers
		const { data: customers, error: customersError } = await supabase.from(
			TABLES.Quotations,
		).select().eq(
			'ruc',
			ruc,
		)

		if (customersError) {
			console.log({ customersError })
			return {
				message: 'Database Error: Creando quotation',
			}
		}

		// si no existe el ruc en customers agregamos
		if (customers?.length === 0) {
			const { error } = await supabase.from(TABLES.Customers)
				.insert({
					ruc,
					name: company,
					address,
				})

			if (error) {
				console.log(error)
				return {
					message: 'Database Error: Creando quotation',
				}
			}
		}
	}

	// prepare data to insert
	//
	const quotationToInsert = {
		number,
		company,
		ruc,
		address,
		deadline,
		items,
		include_igv,
	}

	const { error } = await supabase.from(TABLES.Quotations).insert(
		quotationToInsert,
	)

	// handle error
	if (error) {
		if (error?.code === '23505') {
			return {
				errors: {
					number: ['Ya existe es cotización '],
				},
			}
		}

		return {
			message: 'Database Error: Creando quotation',
		}
	}

	revalidatePath('/quotations')
	redirect('/quotations')
}

// Update Product
export async function updateQuotation(_: undefined, formData: FormData) {
	const rawData = {
		id: formData.get('id'),
		ruc: formData.get('ruc') || null,
		company: formData.get('company') || 'Sin Ruc Proporcionado',
		address: formData.get('address'),
		deadline: formData.get('deadline'),
		number: formData.get('number'),
		items: JSON.parse(formData.get('items') as string),
		include_igv: formData.get('include_igv'),
		is_regular_customer: formData.get('is_regular_customer'),
	}

	// validated fields
	const validatedFields = UpdateQuotation.safeParse(rawData)

	// if have error
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Missing Fields. Failed to UPdate Product.',
		}
	}

	const {
		number,
		id,
		company,
		ruc,
		address,
		deadline,
		items,
		include_igv,
	} = validatedFields.data

	const quotationToUpdate = {
		number,
		company,
		ruc,
		address,
		deadline,
		items,
		include_igv,
	}

	// create supabase client
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	const { error } = await supabase.from(TABLES.Quotations).update(
		quotationToUpdate,
	)
		.eq(
			'id',
			id,
		)

	// handle error
	if (error) {
		return {
			message: 'Error actualizando cotización',
			error: true,
		}
	}

	revalidatePath('/quotations')
	redirect(`/quotations/${number}`)
}

export async function deleteQuotation(_: undefined, formData: FormData) {
	const id = formData.get('id')

	// create supabase client
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	await supabase.from(TABLES.Quotations).delete().eq('id', id)
	revalidatePath('/quotations')
}
