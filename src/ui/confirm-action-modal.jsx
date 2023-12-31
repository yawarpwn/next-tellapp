'use client'

import clsx from 'clsx'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import SubmitActionButton from './submit-action-button'

function ConfirmModalAction(
	{
		isOpen,
		onClose,
		onAction,
		title = '¿ Estás seguro ?',
		children,
		size = 'sm',
	},
) {
	const modalRef = useRef(null)

	useEffect(() => {
		if (isOpen) {
			modalRef.current?.showModal()
		} else {
			modalRef.current?.close()
		}
	}, [isOpen])

	useEffect(() => {
		const handleKeyEscape = event => {
			if (event.key === 'Escape') {
				onClose()
			}
		}

		window.addEventListener('keydown', handleKeyEscape)
		return () => window.removeEventListener('keydown', handleKeyEscape)
	}, [onClose])

	const modalBoxClass = clsx('modal-box', `max-w-${size}`)

	const handleAction = async formData => {
		await onAction(formData)
		// onClose()
	}

	return (
		isOpen
		&& createPortal(
			<dialog
				className='modal'
				ref={modalRef}
				onMouseDown={event => {
					if (event.target === event.currentTarget) {
						onClose()
					}
				}}
			>
				<form className={modalBoxClass} action={handleAction}>
					<header className='py-2'>
						<p className='text-center mb-2'>{title}</p>
					</header>
					{children}
					<footer className='flex items-center justify-between'>
						<SubmitActionButton />
						<button onClick={onClose} type='button' className='btn btn-error'>
							Cancelar
						</button>
					</footer>
				</form>
			</dialog>,
			window.document.body,
		)
	)
}

export default ConfirmModalAction
