import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { purchaseOrdersApi, companyApi } from '../services/api';
import POTable from '../components/POTable';
import POPreview, { POPreviewHandle } from '../components/POPreview';
import ConfirmDialog from '../components/ConfirmDialog';
import { PurchaseOrder, CompanyProfile } from '../types/index';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const previewRef = useRef<POPreviewHandle>(null);
  const [pos, setPos] = useState<PurchaseOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [previewPO, setPreviewPO] = useState<PurchaseOrder | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [sortField, setSortField] = useState<'date' | 'order_number' | 'party_name' | 'product' | 'weight' | 'bags' | 'rate'>('order_number');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Load company profile from database on mount
  useEffect(() => {
    const loadCompanyProfile = async () => {
      try {
        const response = await companyApi.get();
        if (response.data.success && response.data.data) {
          setCompany(response.data.data);
          // Also save to localStorage as fallback
          localStorage.setItem('companyProfile', JSON.stringify(response.data.data));
        }
      } catch (err) {
        console.error('Error loading company profile from database:', err);
        // Fallback to localStorage if API fails
        const saved = localStorage.getItem('companyProfile');
        if (saved) {
          try {
            setCompany(JSON.parse(saved));
          } catch (e) {
            console.error('Error parsing localStorage:', e);
          }
        }
      }
    };

    loadCompanyProfile();
  }, []);

  const loadPOs = async (searchTerm: string = '', pageNum: number = 1) => {
    try {
      setIsLoading(true);
      const res = await purchaseOrdersApi.list(searchTerm, pageNum, 10);
      if (res.data.success) {
        setPos(res.data.data || []);
        setTotalPages(res.data.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error('Error loading POs:', err);
      toast.error('Failed to load purchase orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPOs(searchQuery, page);
  }, [page]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
    loadPOs(query, 1);
  };

  const handleSort = (field: 'date' | 'order_number' | 'party_name' | 'product' | 'weight' | 'bags' | 'rate') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedPOs = [...pos].sort((a, b) => {
    let aVal: any = a[sortField as keyof PurchaseOrder];
    let bVal: any = b[sortField as keyof PurchaseOrder];

    // Convert to comparable types
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();

    // Handle null/undefined
    if (aVal == null) aVal = '';
    if (bVal == null) bVal = '';

    // Compare
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      setIsDeleting(true);
      await purchaseOrdersApi.delete(deleteConfirmId);
      toast.success('Purchase order deleted successfully');
      setDeleteConfirmId(null);
      loadPOs(searchQuery, page);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete purchase order');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = async (id: string) => {
    try {
      // Find the PO
      const po = pos.find((p) => p.id === id);
      if (!po) {
        toast.error('Purchase order not found');
        return;
      }

      // Open the preview modal
      setPreviewPO(po);

      // Wait a bit for the DOM to render, then trigger download
      setTimeout(() => {
        if (previewRef.current) {
          previewRef.current.downloadPDF();
          // Close the preview modal after download
          setTimeout(() => {
            setPreviewPO(null);
            toast.success('PDF downloaded successfully');
          }, 150);
        }
      }, 500);
    } catch (err: any) {
      console.error('Error:', err);
      toast.error('Error downloading PDF');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary-900">Purchase Orders</h1>
          <p className="mt-1 text-neutral-600">Manage and track all your purchase orders</p>
        </div>
        <button
          onClick={() => navigate('/create')}
          className="rounded-lg bg-secondary-600 px-6 py-2 font-semibold text-white hover:bg-secondary-700"
        >
          + New Order
        </button>
      </div>

      {/* Search Bar */}
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <input
          type="text"
          placeholder="Search by order number or party name..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg bg-white shadow-sm">
        <POTable
          pos={sortedPOs}
          isLoading={isLoading}
          onPreview={setPreviewPO}
          onEdit={(id) => navigate(`/edit/${id}`)}
          onDelete={setDeleteConfirmId}
          onDownload={handleDownload}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="rounded bg-neutral-200 px-4 py-2 disabled:opacity-50"
          >
            Previous
          </button>
          <div className="flex items-center gap-2">
            <span className="text-neutral-600">
              Page {page} of {totalPages}
            </span>
          </div>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="rounded bg-neutral-200 px-4 py-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Preview Modal */}
      {previewPO && (
        <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black bg-opacity-50">
          <div className="w-full max-w-2xl">
            <div className="m-4 rounded-lg bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-neutral-200 p-4">
                <h2 className="text-xl font-bold text-neutral-900">
                  Purchase Order Preview
                </h2>
                <button
                  onClick={() => setPreviewPO(null)}
                  className="text-2xl font-bold text-neutral-500 hover:text-neutral-700"
                >
                  ×
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto p-4">
                <POPreview ref={previewRef} po={previewPO} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        title="Delete Purchase Order"
        message="Are you sure you want to delete this purchase order? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
};

export default Dashboard;
