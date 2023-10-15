'use client'

import Link from 'next/link'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { DeleteIcon, EyeIcon } from '@/icons'
import { getIgv } from '@/utils'
import InputSearch from '@/components/input-search'
import { useRealTime } from '@/hooks/use-realtime'
import Pagination from './pagination'
import { ROW_PER_PAGE } from '@/constants'
import ConfirmModal from './confirm-modal'

function RealtimeQuotations({ serverQuotations }) {
  const [page, setPage] = useState(1)
  const { data: quotations, deleteData: deleteQuotation } = useRealTime({
    initialData: serverQuotations,
  })

  const [searchValue, setSearchValue] = useState('')

  const handleSearchChange = event => {
    const { value } = event.target
    setSearchValue(value)
    setPage(1)
  }

  const quotationsFiltered = useMemo(() => {
    if (!searchValue) {
      return quotations
    }
    return quotations.filter(quotation =>
      String(quotation.number).includes(searchValue),
    )
  }, [quotations, searchValue])

  const totalPages = useMemo(() => {
    return Math.ceil(quotationsFiltered.length / ROW_PER_PAGE)
  }, [quotationsFiltered])

  const nextPage = () => {
    if (page === totalPages) return
    setPage(page + 1)
  }

  const quotationsToRender = useMemo(() => {
    const start = (page - 1) * ROW_PER_PAGE
    const end = start + ROW_PER_PAGE
    return quotationsFiltered.slice(start, end)
  }, [page, quotationsFiltered])

  // useEffect(() => {
  //   setQuotations(serverQuotations)
  // }, [serverQuotations])

  return (
    <>
      <header className="flex justify-between items-center">
        <InputSearch
          onSearchChange={handleSearchChange}
          searchValue={searchValue}
          placeholder="4023"
        />
        <Link href="/quotations/create" className="btn btn-primary">
          Crear
        </Link>
      </header>

      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>No</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {quotationsToRender.map(quotation => {
              const { total } = getIgv(quotation.items)
              return (
                <tr key={quotation.id}>
                  <td>
                    <span className="text-primary font-bold">#</span>
                    {quotation.number}
                  </td>
                  <td>
                    <div>
                      <p className="w-[300px]">{quotation.company}</p>
                      <p>{quotation.ruc}</p>
                    </div>
                  </td>
                  <td>{total}</td>
                  <td className="flex gap-x-2">
                    <button
                      className="btn "
                      onClick={() => deleteQuotation(quotation.id)}
                    >
                      <DeleteIcon />
                    </button>
                    <Link
                      href={`/quotations/${quotation.number}`}
                      className="btn "
                    >
                      <EyeIcon />
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={page}
        onNextPage={nextPage}
        updatePage={page => setPage(page)}
        totalPages={totalPages}
      />
    </>
  )
}

export default RealtimeQuotations
