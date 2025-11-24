import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { purchaseOrdersApi } from '../services/api';
import POForm from '../components/POForm';
import { PurchaseOrder } from '../types/index';

const EditPO: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [po, setPO] = useState<PurchaseOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [orderNumberError, setOrderNumberError] = useState<string | undefined>();

  useEffect(() => {
    if (id) {
      loadPO(id);
    }
  }, [id]);

  const loadPO = async (poId: string) => {
    try {
      setIsLoading(true);
      const res = await purchaseOrdersApi.get(poId);
      if (res.data.success) {
        setPO(res.data.data || null);
      }
    } catch (err) {
      console.error('Error loading PO:', err);
      toast.error('Failed to load purchase order');
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: Omit<PurchaseOrder, 'id' | 'created_at' | 'updated_at'>) => {
    if (!id) return;

    try {
      setIsSaving(true);
      setOrderNumberError(undefined);

      const res = await purchaseOrdersApi.update(id, data);

      if (res.data.success) {
        toast.success('Purchase order updated successfully');
        navigate('/');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error;

      if (errorMessage === 'Order number already exists') {
        setOrderNumberError(errorMessage);
        toast.error(errorMessage);
      } else {
        toast.error(errorMessage || 'Failed to update purchase order');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-300 border-t-primary-700"></div>
      </div>
    );
  }

  if (!po) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        Purchase order not found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => navigate('/')}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          ← Back to Dashboard
        </button>
        <h1 className="mt-4 text-3xl font-bold text-primary-900">Edit Purchase Order</h1>
        <p className="mt-1 text-neutral-600">Update the purchase order details</p>
      </div>

      <div className="rounded-lg bg-white p-8 shadow-sm">
        <POForm
          initialData={po}
          onSubmit={handleSubmit}
          isLoading={isSaving}
          orderNumberError={orderNumberError}
        />
      </div>
    </div>
  );
};

export default EditPO;
