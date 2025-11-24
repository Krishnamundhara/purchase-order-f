import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { purchaseOrdersApi } from '../services/api';
import POForm from '../components/POForm';
import { PurchaseOrder } from '../types/index';

const CreatePO: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [orderNumberError, setOrderNumberError] = useState<string | undefined>();

  const handleSubmit = async (data: Omit<PurchaseOrder, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsLoading(true);
      setOrderNumberError(undefined);

      const res = await purchaseOrdersApi.create(data);

      if (res.data.success) {
        toast.success('Purchase order created successfully');
        navigate('/');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error;

      if (errorMessage === 'Order number already exists') {
        setOrderNumberError(errorMessage);
        toast.error(errorMessage);
      } else {
        toast.error(errorMessage || 'Failed to create purchase order');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => navigate('/')}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          ← Back to Dashboard
        </button>
        <h1 className="mt-4 text-3xl font-bold text-primary-900">Create Purchase Order</h1>
        <p className="mt-1 text-neutral-600">Fill in the details to create a new purchase order</p>
      </div>

      <div className="rounded-lg bg-white p-8 shadow-sm">
        <POForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          orderNumberError={orderNumberError}
        />
      </div>
    </div>
  );
};

export default CreatePO;
