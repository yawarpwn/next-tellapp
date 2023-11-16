'use server'

import z from 'zod'
// import { createClient } from '@supabase/supabase-js'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { deleteRow, insertRow, updateRow } from '@/services/supabase'

const LabelSchema = z.object({
  id: z.string(),
  recipient: z.string(),
  destination: z.string(),
  dni_ruc: z.coerce.string(),
  address: z.string().nullable(),
  suggested_agency: z.string().nullable(),
  phone: z.coerce
    .string()
    .length(9, { message: 'El telefono debe tener 9 caracteres' })
    .nullable(),
})

const CreateLabel = LabelSchema.omit({ id: true })
export async function createLabel(_, formData) {
  const coookiesStore = cookies()
  const supabase = createServerActionClient({ cookies: () => coookiesStore })
  const rawData = {
    recipient: formData.get('recipient'),
    destination: formData.get('destination'),
    dni_ruc: formData.get('dni_ruc'),
    address: formData.get('address') || null,
    phone: formData.get('phone') || null,
    suggested_agency: formData.get('suggested_agency') || null,
  }

  console.log({ rawData })

  const validatedFields = CreateLabel.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    }
  }

  try {
    await insertRow({
      table: 'labels',
      row: validatedFields.data,
      client: supabase,
    })
  } catch (error) {
    console.log('Error inserting Row', error)
    return {
      message: 'Database Error: Failed to create customer',
    }
  }

  revalidatePath('/labels')
  redirect('/labels')
}

// Update Product
const UpdateLabel = LabelSchema
export async function updateLabel(_, formData) {
  const coookiesStore = cookies()
  const supabase = createServerActionClient({ cookies: () => coookiesStore })
  const rawData = {
    id: formData.get('id'),
    recipient: formData.get('recipient'),
    destination: formData.get('destination'),
    dni_ruc: formData.get('dni_ruc'),
    address: formData.get('address') || null,
    phone: formData.get('phone') || null,
    suggested_agency: formData.get('suggested_agency') || null,
  }

  console.log({ rawData })

  const validatedFields = UpdateLabel.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to UPdate Product.',
    }
  }

  try {
    await updateRow({
      table: 'labels',
      row: validatedFields.data,
      client: supabase,
    })
  } catch (error) {
    console.log('Error inserting Row', error)
    return {
      message: 'Database Error: Failed to update product',
    }
  }

  revalidatePath('/labels')
  redirect('/labels')
}

export async function deleteLabel(_, formData) {
  const coookiesStore = cookies()
  const supabase = createServerActionClient({ cookies: () => coookiesStore })
  const id = formData.get('id')
  try {
    await deleteRow({ table: 'labels', client: supabase, id })
    revalidatePath('/labels')
    return {
      message: 'Cliente eliminado',
    }
  } catch (error) {
    return {
      message: 'Error eliminando cliente',
    }
  }
}
