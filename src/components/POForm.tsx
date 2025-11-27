import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PurchaseOrder } from '../types/index';

const formSchema = z.object({
  date: z.string().date('Invalid date'),
  order_number: z.string().min(1, 'Order number is required'),
  party_name: z.string().min(1, 'Party name is required'),
  broker: z.string().optional(),
  mill: z.string().optional(),
  weight: z.string().optional().transform(val => {
    if (!val || val === '') return undefined;
    const num = Number(val);
    if (isNaN(num) || num <= 0) return null;
    return num;
  }).refine(val => val === undefined || val !== null, 'Weight must be positive'),
  bags: z.string().optional().transform(val => {
    if (!val || val === '') return undefined;
    const num = Number(val);
    if (isNaN(num) || num <= 0 || !Number.isInteger(num)) return null;
    return num;
  }).refine(val => val === undefined || val !== null, 'Bags must be a positive integer'),
  product: z.string().optional(),
  rate: z.string().optional().transform(val => {
    if (!val || val === '') return undefined;
    const num = Number(val);
    if (isNaN(num) || num <= 0) return null;
    return num;
  }).refine(val => val === undefined || val !== null, 'Rate must be positive'),
  terms_and_conditions: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface POFormProps {
  initialData?: Partial<PurchaseOrder>;
  onSubmit: (data: Omit<PurchaseOrder, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  isLoading?: boolean;
  orderNumberError?: string;
}

const POForm: React.FC<POFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  orderNumberError,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      date: initialData.date || new Date().toISOString().split('T')[0],
      order_number: initialData.order_number || '',
      party_name: initialData.party_name || '',
      broker: initialData.broker || '',
      mill: initialData.mill || '',
      weight: initialData.weight || undefined,
      bags: initialData.bags || undefined,
      product: initialData.product || '',
      rate: initialData.rate || undefined,
      terms_and_conditions: initialData.terms_and_conditions || '',
    } : {
      date: new Date().toISOString().split('T')[0],
    },
  });

  React.useEffect(() => {
    if (orderNumberError) {
      setError('order_number', { message: orderNumberError });
    }
  }, [orderNumberError, setError]);

  const handleFormSubmit = async (data: FormData) => {
    try {
      await onSubmit({
        ...data,
        weight: data.weight,
        bags: data.bags,
        rate: data.rate,
      } as Omit<PurchaseOrder, 'id' | 'created_at' | 'updated_at'>);
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-neutral-700">
          Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          {...register('date')}
          className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
        />
        {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Order Number */}
        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Order Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., PO-001"
            {...register('order_number')}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
          />
          {errors.order_number && (
            <p className="mt-1 text-sm text-red-500">{errors.order_number.message}</p>
          )}
        </div>

        {/* Party Name */}
        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Party Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., ABC Traders"
            {...register('party_name')}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
          />
          {errors.party_name && (
            <p className="mt-1 text-sm text-red-500">{errors.party_name.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Broker */}
        <div>
          <label className="block text-sm font-medium text-neutral-700">Broker</label>
          <input
            type="text"
            placeholder="e.g., Ramesh"
            {...register('broker')}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        {/* Mill */}
        <div>
          <label className="block text-sm font-medium text-neutral-700">Mill</label>
          <input
            type="text"
            placeholder="e.g., MillName"
            {...register('mill')}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Product */}
        <div>
          <label className="block text-sm font-medium text-neutral-700">Product</label>
          <input
            type="text"
            placeholder="e.g., Wheat"
            {...register('product')}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-medium text-neutral-700">Weight (kg)</label>
          <input
            type="number"
            step="0.01"
            placeholder="e.g., 1200.5"
            {...register('weight')}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
          />
          {errors.weight && (
            <p className="mt-1 text-sm text-red-500">{errors.weight.message}</p>
          )}
        </div>

        {/* Bags */}
        <div>
          <label className="block text-sm font-medium text-neutral-700">Bags</label>
          <input
            type="number"
            step="1"
            placeholder="e.g., 50"
            {...register('bags')}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
          />
          {errors.bags && (
            <p className="mt-1 text-sm text-red-500">{errors.bags.message}</p>
          )}
        </div>
      </div>

      {/* Rate */}
      <div>
        <label className="block text-sm font-medium text-neutral-700">Rate (Rs.)</label>
        <input
          type="number"
          step="0.01"
          placeholder="e.g., 2500.00"
          {...register('rate')}
          className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
        />
        {errors.rate && (
          <p className="mt-1 text-sm text-red-500">{errors.rate.message}</p>
        )}
      </div>

      {/* Terms & Conditions */}
      <div>
        <label className="block text-sm font-medium text-neutral-700">
          Terms & Conditions
        </label>
        <textarea
          placeholder="e.g., Payment within 30 days"
          rows={4}
          {...register('terms_and_conditions')}
          className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-primary-700 py-2 font-bold text-white hover:bg-primary-800 disabled:opacity-50"
      >
        {isLoading ? 'Saving...' : initialData?.id ? 'Update Purchase Order' : 'Create Purchase Order'}
      </button>
    </form>
  );
};

export default POForm;
