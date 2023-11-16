import { fetchAgencyById } from '@/lib/agencies-data'
import CreateEditAgencyForm from '@/ui/agencies/create-edit-form'
import Breadcrumbs from '@/ui/breadcrumbs'
async function UpdatePage({ params }) {
  const { id } = params
  const agency = await fetchAgencyById({ id })
  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: 'Agencias',
            href: '/agencies',
          },
          {
            label: id,
            href: `/agencies/${id}`,
          },
          {
            label: 'Actualizar',
            href: `/agencies/${id}/update`,
            active: true,
          },
        ]}
      />
      <CreateEditAgencyForm agency={agency} />
    </>
  )
}

export default UpdatePage
