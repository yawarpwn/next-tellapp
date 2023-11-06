'use client'

import { useFormState } from 'react-dom'
import CreateEditInputs from './create-edit-inputs'
import ItemModal from './item-modal'
import confetti from 'canvas-confetti'
import CustomersModal from '@/ui/quotations/customers-modal'
import useQuotations from '@/hooks/use-quotations'
import useAutoSave from '@/hooks/use-autosave'
import { useEffect, useState } from 'react'
import _ from 'lodash'
import SavedQuotationModal from './saved-quotation-modal'

const initialState = {
  message: null,
  errors: {},
}

const initialQuotationState = {
  company: '',
  ruc: '',
  address: '',
  deadline: '',
  items: [],
};

function AddForm({ action, serverCustomers }) {
  const [state, dispatch] = useFormState(action, initialState)
  const [savedQuotation, setSavedQuotation] = useState(null)

  const closeSavedQuotationModal = () => {
    setSavedQuotation(null)
  }
  const {
    addItem,
    deleteItem,
    updateItem,
    updateQuotation,
    openCustomersModal,
    closeCustomersModal,
    handleInputChange,
    openEditItemModal,
    openItemModal,
    closeEditItemModal,
    quotation,
    isItemModalOpen,
    isCustomersModalOpen,
    editingItem,
  } = useQuotations({ initialData: initialQuotationState })

  console.log({quotation})

  useEffect(() => {
    const quotationFromLocalStorage = JSON.parse(localStorage.getItem('__QUOTATION__'))
      console.log({quotationFromLocalStorage})

      if(quotationFromLocalStorage) {
        setSavedQuotation(quotationFromLocalStorage)
      }

  }, [])

  const saveInLocalStoreage = () => {
   const isEmpety = _.isEqual(quotation, initialQuotationState)
    console.log('isEmpety: ', isEmpety)
    console.log('save in localStorage')
    if(!isEmpety) {
      localStorage.setItem('__QUOTATION__', JSON.stringify(quotation))
    }
  }

  useAutoSave({callback: saveInLocalStoreage, delay: 3000 })

  console.log(savedQuotation)


  return (
    <>
      <SavedQuotationModal 
      isOpen={savedQuotation}
      onClose={closeSavedQuotationModal}
      onConfirm={() => {
        updateQuotation({
          ...quotation,
          ...savedQuotation
          })
        closeSavedQuotationModal()
      }}
    />
      <ItemModal
        isOpenModal={isItemModalOpen}
        onCloseModal={closeEditItemModal}
        editingItem={editingItem}
        addItem={addItem}
        updateItem={updateItem}
      />
      <CustomersModal
        isOpenModal={isCustomersModalOpen}
        onCloseModal={closeCustomersModal}
        serverCustomers={serverCustomers}
        onCustomerPick={updateQuotation}
      />
      <div className="flex justify-between">
        <div />
        <button onClick={openCustomersModal} className="btn">
          Cliente frecuentes
        </button>
      </div>
      <form
        action={async formData => {
          await dispatch(formData)
          localStorage.removeItem('__QUOTATION__')
          confetti()
        }}
      >
        <CreateEditInputs
          onChange={handleInputChange}
          quotation={quotation}
          state={state}
          onDeleteItem={deleteItem}
          onAddItem={addItem}
          updateQuotation={updateQuotation}
          openEditItemModal={openEditItemModal}
          openItemModal={openItemModal}
          deleteItem={deleteItem}
        />
      </form>
    </>
  )
}

export default AddForm