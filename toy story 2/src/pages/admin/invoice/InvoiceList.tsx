import React from 'react'
import { ViewInvoiceDto } from '@/types/OrderDTO'
import InvoiceCard from './InvoiceCard'

interface InvoiceListProps {
  invoices: ViewInvoiceDto[]
}

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {invoices.map(invoice => (
        <InvoiceCard key={invoice.invoiceId} invoice={invoice} />
      ))}
    </div>
  )
}

export default InvoiceList
