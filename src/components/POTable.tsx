import React from 'react';
import { PurchaseOrder } from '../types/index';
import { formatDate, formatCurrency, formatWeight } from '../utils/format';

type SortField = 'date' | 'order_number' | 'party_name' | 'product' | 'weight' | 'bags' | 'rate';
type SortOrder = 'asc' | 'desc';

interface POTableProps {
  pos: PurchaseOrder[];
  isLoading?: boolean;
  onPreview: (po: PurchaseOrder) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDownload: (id: string) => void;
  sortField?: SortField;
  sortOrder?: SortOrder;
  onSort?: (field: SortField) => void;
}

const POTable: React.FC<POTableProps> = ({
  pos,
  isLoading = false,
  onPreview,
  onEdit,
  onDelete,
  onDownload,
  sortField = 'date',
  sortOrder = 'desc',
  onSort,
}) => {
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <span className="ml-1 text-neutral-400">↕</span>;
    }
    return <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>;
  };

  const HeaderCell = ({ field, label }: { field: SortField; label: string }) => (
    <th
      onClick={() => onSort?.(field)}
      className="cursor-pointer px-6 py-3 text-left text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
    >
      <div className="flex items-center">
        {label}
        <SortIcon field={field} />
      </div>
    </th>
  );
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-300 border-t-primary-700"></div>
      </div>
    );
  }

  if (pos.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-8 text-center">
        <p className="text-neutral-600">No purchase orders found. Create one to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200">
      <table className="w-full">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50">
            <HeaderCell field="date" label="Date" />
            <HeaderCell field="order_number" label="Order #" />
            <HeaderCell field="party_name" label="Party Name" />
            <HeaderCell field="product" label="Product" />
            <HeaderCell field="weight" label="Weight" />
            <HeaderCell field="bags" label="Bags" />
            <HeaderCell field="rate" label="Rate" />
            <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pos.map((po) => (
            <tr key={po.id} className="border-b border-neutral-200 hover:bg-neutral-50">
              <td className="px-6 py-4 text-sm text-neutral-700">{formatDate(po.date)}</td>
              <td className="px-6 py-4 text-sm font-semibold text-primary-700">
                {po.order_number}
              </td>
              <td className="px-6 py-4 text-sm text-neutral-700">{po.party_name}</td>
              <td className="px-6 py-4 text-sm text-neutral-700">{po.product || '-'}</td>
              <td className="px-6 py-4 text-sm text-neutral-700">
                {formatWeight(po.weight)}
              </td>
              <td className="px-6 py-4 text-sm text-neutral-700">{po.bags || '-'}</td>
              <td className="px-6 py-4 text-sm text-secondary-600 font-medium">
                {formatCurrency(po.rate)}
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onPreview(po)}
                    className="rounded bg-secondary-100 px-3 py-1 text-xs font-medium text-secondary-700 hover:bg-secondary-200"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => onEdit(po.id)}
                    className="rounded bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700 hover:bg-primary-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDownload(po.id)}
                    className="rounded bg-accent-100 px-3 py-1 text-xs font-medium text-accent-700 hover:bg-accent-200"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => onDelete(po.id)}
                    className="rounded bg-red-100 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default POTable;
