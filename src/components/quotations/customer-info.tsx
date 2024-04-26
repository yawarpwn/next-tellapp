'use client'

import { CustomersPicker } from '@/components/customers-picker'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	useQuotationContext,
	useQuotationStore,
} from '@/hooks/use-quotation-store'
import { toast } from '@/hooks/use-toast'
import { insertQuotation, setQuotation } from '@/lib/actions/quoatations'
import { shootCoffeti } from '@/lib/confetti'
import { getRuc } from '@/lib/sunat'
import { QuotationCreateType, QuotationUpdateType } from '@/types'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { DatePicker } from '../ui/date-picker'
import { QuotationAddItems } from './add-items'

export function QuotationCustomerInfo() {
	const [loading, setLoading] = React.useState(false)
	const quo = useQuotationContext(state => state.quo)
	const setQuo = useQuotationContext(state => state.setQuo)
	const items = useQuotationContext(state => state.items)
	const isUpdate = useQuotationContext(state => state.isUpdate)
	const [pending, startTransition] = React.useTransition()
	const store = useQuotationStore()
	const router = useRouter()

	const handleSubmit = () => {
		startTransition(async () => {
			if ('id' in quo) {
				// update quotation
				const quoToUpdate = {
					...quo,
					id: quo.id,
					items,
				}
				const [error, data] = await setQuotation(
					quoToUpdate as QuotationUpdateType,
				)

				if (error) {
					toast({
						title: 'Error',
						description: 'No se pudo actualizar la cotización',
						variant: 'destructive',
					})
				}

				if (data) {
					store?.persist.clearStorage()
					router.push(`/new-quos/${data.number}`)
				}
			} else {
				// crate quotation
				const quoToInsert = {
					...quo,
					items,
				}
				const [error, data] = await insertQuotation(
					quoToInsert as QuotationCreateType,
					items,
				)

				// handle error
				if (error) {
					toast({
						title: 'Error',
						description: 'No se pudo crear la cotización',
						variant: 'destructive',
					})
				}

				if (data) {
					// success
					store?.persist.clearStorage()
					shootCoffeti()
					router.push(`/new-quos/${data.number}`)
				}
			}
		})
	}

	const canContinue = quo.deadline === 0

	// Manjedor para buscar cliente por Ruc
	const handleRucBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
		const value = event.target.value
		if (value.length === 11) {
			try {
				setLoading(true)
				const { company, ruc, address } = await getRuc(value)
				setQuo({
					ruc,
					company,
					address,
				})
			} catch (error) {
				toast({
					title: 'Error',
					description: 'Ruc no encontrado',
					variant: 'destructive',
				})
			} finally {
				setLoading(false)
			}
		}
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value, name } = e.target
		setQuo({
			...quo,
			[name]: value,
		})
	}

	return (
		<>
			<header className='flex justify-between'>
				<div>
				</div>
				<div className='flex justify-end'>
					<CustomersPicker />
				</div>
			</header>
			<article className='flex flex-col gap-4'>
				<div className='grid gap-2'>
					<Label htmlFor='ruc'>Ruc</Label>
					<Input
						id='ruc'
						value={quo.ruc ?? ''}
						type='text'
						name='ruc'
						onBlur={handleRucBlur}
						disabled={loading}
						onChange={handleInputChange}
					/>
				</div>
				<div>
					<p className='text-green-300 text-sm'>{quo.company}</p>
				</div>
				<div>
					<p className='text-xs text-muted-foreground'>{quo.address}</p>
				</div>

				{/* <div className='grid gap-2'> */}
				{/* 	<Label htmlFor='company'>Cliente</Label> */}
				{/* 	<Input */}
				{/* 		id='company' */}
				{/* 		name='company' */}
				{/* 		type='text' */}
				{/* 		value={quo.company ?? ''} */}
				{/* 		disabled={true} */}
				{/* 	/> */}
				{/* </div> */}

				{/* <div className='grid gap-2'> */}
				{/* 	<Label htmlFor='ruc'>Dirección</Label> */}
				{/* 	<Input */}
				{/* 		id='address' */}
				{/* 		name='address' */}
				{/* 		type='text' */}
				{/* 		value={quo.address ?? ''} */}
				{/* 		disabled={true} */}
				{/* 	/> */}
				{/* </div> */}
				<div className='grid gap-2'>
					<Label htmlFor='deadline'>
						Tiempo de entrega
					</Label>
					<Input
						required
						type='number'
						id='deadline'
						value={quo.deadline}
						disabled={loading}
						onChange={e => setQuo({ ...quo, deadline: Number(e.target.value) })}
					/>
				</div>
				<div className='flex gap-4'>
					<div className='flex space-x-2 items-start '>
						<Checkbox
							id='include_igv'
							onCheckedChange={e => setQuo({ ...quo, include_igv: Boolean(e) })}
							checked={quo.include_igv}
						/>
						<Label htmlFor='include_igv'>
							Incluir IGV
						</Label>
					</div>
					<div className='flex space-x-2 items-start '>
						<Checkbox
							id='is_regular_customer'
							checked={quo.is_regular_customer}
							onCheckedChange={e =>
								setQuo({ ...quo, is_regular_customer: Boolean(e) })}
						/>
						<Label htmlFor='is_regular_customer'>
							Cliente frecuente
						</Label>
					</div>
				</div>
				<QuotationAddItems />
				<footer className='flex items-center justify-between'>
					<Button disabled={pending} type='button' className='px-14' asChild>
						<Link href='/new-quos'>
							Anterior
						</Link>
					</Button>
					<Button
						onClick={handleSubmit}
						variant='primary'
						className='px-14'
						disabled={pending}
						type='submit'
					>
						{pending && <Loader2 className='mr-2 w-4 h-4 animate-spin' />}
						{isUpdate ? 'Actualizar' : 'Crear'}
					</Button>
				</footer>
			</article>
		</>
	)
}
