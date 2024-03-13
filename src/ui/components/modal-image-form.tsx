import type { GalleryImage, Signal } from '@/types'
import { CreateUpdateImageModal } from '@/ui/components/create-update-image-modal'
import { EditIcon, PlusIcon } from 'lucide-react'
import { useState } from 'react'

interface Props {
	item?: Signal | GalleryImage
	action: (formData: FormData) => Promise<void>
	categories: string[]
	// type?: 'add' | 'edit'
}

export function CreateUpdateImageButton(
	{ item, action, categories }: Props,
) {
	const [isOpenModal, setIsOpenModal] = useState(false)

	const openModal = () => setIsOpenModal(true)
	const closeModal = () => setIsOpenModal(false)

	const isEditMode = item != null

	return (
		<>
			{isEditMode
				? (
					<button onClick={openModal}>
						<EditIcon />
					</button>
				)
				: (
					<button onClick={openModal} className='btn btn-primary btn-sm'>
						<span>
							Agregar
						</span>
						<PlusIcon />
					</button>
				)}
			{isOpenModal && (
				<CreateUpdateImageModal
					item={item}
					isEditMode={isEditMode}
					action={action}
					categories={categories}
					onCloseModal={closeModal}
					isOpenModal={isOpenModal}
				/>
			)}
		</>
	)
}
