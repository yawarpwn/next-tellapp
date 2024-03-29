'use server'

import { createServerClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import z from 'zod'

const TABLE = 'customers'

const CustomerSchema = z.object({
	name: z.string().min(10, {
		message: 'El nombre debe tener al menos 10 caracteres',
	}),
	ruc: z.coerce.string().length(11, {
		message: 'El ruc debe tener al menos 11 caracteres',
	}),
	address: z.string().min(10, {
		message: 'La dirección debe tener al menos 10 caracteres',
	}).nullable(),
	phone: z.coerce
		.string()
		.length(9, {
			message: 'El telefono debe tener 9 caracteres',
		})
		.nullable(),
	email: z
		.string()
		.email({
			message: 'El correo no es valido',
		})
		.nullable(),
})

const UpdateCustomerSchema = CustomerSchema
const CreateCustomerSchema = CustomerSchema.omit({ id: true })

export async function createCustomer(_, formData) {
	// create supabase client
	const cookieStore = cookies()
	const supabase = createServerClient(cookieStore)

	const rawData = {
		name: formData.get('name'),
		ruc: formData.get('ruc'),
		address: formData.get('address') || null,
		phone: formData.get('phone') || null,
		email: formData.get('email') || null,
	}

	const validatedFields = CreateCustomerSchema.safeParse(rawData)

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Missing Fields. Failed to Create Invoice.',
		}
	}

	const { error } = await supabase.from(TABLE).insert(validatedFields.data)
	if (error) {
		return {
			message: 'Database Error: Failed to create customer',
		}
	}

	revalidatePath('/customers')
}

export async function updateCustomer(formData) {
	const cookieStore = cookies()
	const supabase = createServerClient(cookieStore)
	const rawCustomer = {
		name: formData.get('name'),
		ruc: formData.get('ruc'),
		address: formData.get('address'),
		id: formData.get('id'),
		phone: formData.get('phone'),
		email: formData.get('email'),
	}

	const validatedFields = UpdateCustomerSchema.safeParse(rawCustomer)

	if (validatedFields.error) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		}
	}

	const { error } = await supabase.from(TABLE).update(validatedFields.data)
		.eq('id', validatedFields.data.id)
	if (error) {
		return {
			messge: 'Database Error: Failed to update customer',
		}
	}
	revalidatePath('/')
}

export async function deleteCustomer(_, formData) {
	const id = formData.get('id')

	const cookieStore = cookies()
	const supabase = createServerClient(cookieStore)

	const { error } = await supabase.from(TABLE).delete().eq('id', id)
	if (error) {
		return {
			message: 'Database Error: Failed to delete customer',
		}
	}
	revalidatePath('/customers')
}
