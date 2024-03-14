'use client'

import { SIGNALS_CATEGORIES } from '@/constants'
import { createSignal, deleteSignal, updateSignal } from '@/lib/actions/signals'
import { type Signal } from '@/types'
import { CreateUpdateImageButton } from '../components/modal-image-form'
import DeleteActionForm from '../delete-action-form'

interface Props {
	item: Signal
}

export function SignalEditFormButton({ item }: Props) {
	return (
		<>
			<CreateUpdateImageButton
				item={item}
				action={updateSignal}
				categories={Object.values(SIGNALS_CATEGORIES)}
			/>
		</>
	)
}

export function SignalAddFormButton() {
	return (
		<>
			<CreateUpdateImageButton
				action={createSignal}
				categories={Object.values(SIGNALS_CATEGORIES)}
			/>
		</>
	)
}

export function SignalDeleteFormButton({ id }: { id: string }) {
	return (
		<DeleteActionForm
			id={id}
			deleteAction={deleteSignal}
		/>
	)
}