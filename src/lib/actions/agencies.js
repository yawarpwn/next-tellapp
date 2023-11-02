'use server'

import z from 'zod'
// import { createClient } from '@supabase/supabase-js'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { deleteRow, insertRow, updateRow } from '@/services/supabase'

const AgencieSchema = z.object({
  id: z.string(),
  company: z.string(),
  ruc: z.coerce.number(),
  address: z.string().nullable(),
  phone: z.coerce.number().nullable(),
  destinations: z.array()
})

// Create Product 
const CreateAgency = AgencieSchema.omit({id: true}) 
export async function createAgency(_, formData) {
  const coookiesStore = cookies()
  const supabase = createServerActionClient({ cookies: () => coookiesStore })
  const rawData = {
    company: formData.get('company'),
    ruc: formData.get('ruc'),
    address: formData.get('address') || null,
    phone: formData.get('phone') || null,
    destinations: []
  }

  console.log({ rawData })

  const validatedFields = CreateAgency.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    }
  }

  try {
    await insertRow({
      table: 'agencies',
      row: validatedFields.data,
      client: supabase,
    })
  } catch (error) {
    console.log('Error inserting Row', error)
    return {
      message: 'Database Error: Failed to create customer',
    }
  }

  revalidatePath('/agencies')
  redirect('/agencies')
}

// Update Product 
const UpdateAgency = AgencieSchema
export async function updateAgency(_, formData) {
  const coookiesStore = cookies()
  const supabase = createServerActionClient({ cookies: () => coookiesStore })
  const rawData = {
    id : formData.get('id'),
    company: formData.get('company'),
    ruc: formData.get('ruc'),
    address: formData.get('address') || null,
    phone: formData.get('phone') || null,
    destinations: []
  }

  console.log({ rawData })

  const validatedFields = UpdateAgency.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to UPdate Product.',
    }
  }

  try {
    await updateRow({
      table: 'agencies',
      row: validatedFields.data,
      client: supabase,
    })
  } catch (error) {
    console.log('Error inserting Row', error)
    return {
      message: 'Database Error: Failed to update product',
    }
  }

  revalidatePath('/agencies')
  redirect('/agencies')
}

export async function deleteAgency(_, formData) {
  const coookiesStore = cookies()
  const supabase = createServerActionClient({ cookies: () => coookiesStore })
  const id = formData.get('id')
  try {
    await deleteRow({ table: 'agencies', client: supabase, id })
    revalidatePath('/agencies')
    return {
      message: 'Cliente eliminado',
    }
  } catch (error) {
    return {
      message: 'Error eliminando cliente',
    }
  }
}

