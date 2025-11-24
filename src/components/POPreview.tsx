import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import html2pdf from 'html2pdf.js';
import { PurchaseOrder, CompanyProfile } from '../types/index';
import { companyApi } from '../services/api';
import { formatDate, formatCurrency, formatWeight } from '../utils/format';

interface POPreviewProps {
  po: PurchaseOrder;
}

export interface POPreviewHandle {
  downloadPDF: () => void;
}

const POPreview = forwardRef<POPreviewHandle, POPreviewProps>(({ po }, ref) => {
  const total = (po.weight || 0) * (po.rate || 0);
  const [company, setCompany] = useState<CompanyProfile | null>(null);

  useEffect(() => {
    const loadCompany = async () => {
      try {
        // Try to load from API first
        const response = await companyApi.get();
        if (response.data.success && response.data.data) {
          setCompany(response.data.data);
          // Also save to localStorage
          localStorage.setItem('companyProfile', JSON.stringify(response.data.data));
          return;
        }
      } catch (err) {
        console.error('Error loading company from API:', err);
      }

      // Fallback to localStorage
      const saved = localStorage.getItem('companyProfile');
      if (saved) {
        try {
          setCompany(JSON.parse(saved));
        } catch (e) {
          console.error('Error parsing localStorage:', e);
        }
      }
    };

    loadCompany();
  }, []);

  const downloadPDF = () => {
    const element = document.getElementById('po-preview-content');
    if (!element) return;

    const opt = {
      margin: 5,
      filename: `PO-${po.order_number}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait' as const, unit: 'mm' as const, format: 'a4' }
    };

    html2pdf().set(opt).from(element).save();
  };

  // Expose downloadPDF to parent component
  useImperativeHandle(ref, () => ({
    downloadPDF
  }), [po.order_number]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-200 p-2">
      {/* A4 Half Page Preview */}
      <div
        id="po-preview-content"
        className="w-full max-w-[210mm] bg-white text-neutral-900 shadow-2xl"
        style={{ 
            fontFamily: 'Arial, sans-serif',
            padding: '12px',
          margin: '0 auto',
          pageBreakAfter: 'always'
        }}
      >
      {/* Header with Logo and Company Info */}
      <div className="mb-2 border-b border-neutral-800 pb-2">
        <div className="flex items-start gap-3">
          {/* Company Logo */}
          {company?.companyLogo && (
            <img
              src={company.companyLogo}
              alt="Company Logo"
              className="h-10 w-10 object-contain flex-shrink-0"
            />
          )}

          {/* Company Name and Details */}
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-neutral-900">{company?.companyName || 'Your Company'}</h1>
            <p className="text-xs text-neutral-600 leading-tight">
              {company?.address && (
                <>
                  {company.address}
                <br />
                  {company.phone && ` MOB:${company.phone}`}
                  {company.email && `, EMAIL ID: ${company.email}`}
                </>
              )}
            </p>
            {company?.gstNumber && (
              <p className="text-xs text-neutral-600 leading-tight">G.S.T. NO. : {company.gstNumber}</p>
            )}
          </div>

          {/* PO Number and Date - Right aligned */}
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-bold">Order number: {po.order_number}</p>
            <p className="text-sm font-bold">Date: {formatDate(po.date)}</p>
          </div>
        </div>
      </div>

      {/* Party and Product Details Table */}
      <div className="mb-2 overflow-hidden border border-neutral-300">
        <table className="w-full text-xs">
          <tbody>
            {/* Party Name */}
            <tr className="border-b border-neutral-300">
              <td className="bg-neutral-100 px-2 py-1 font-bold text-neutral-800 w-1/3">PARTY NAME:</td>
              <td className="px-2 py-1 text-neutral-900">{po.party_name}</td>
            </tr>

            {/* Broker */}
            <tr className="border-b border-neutral-300">
              <td className="bg-neutral-100 px-2 py-1 font-bold text-neutral-800">BROKER:</td>
              <td className="px-2 py-1 text-neutral-900">{po.broker || '-'}</td>
            </tr>

            {/* Mill */}
            <tr className="border-b border-neutral-300">
              <td className="bg-neutral-100 px-2 py-1 font-bold text-neutral-800">MILL:</td>
              <td className="px-2 py-1 text-neutral-900">{po.mill || '-'}</td>
            </tr>

            {/* Quality/Product */}
            <tr className="border-b border-neutral-300">
              <td className="bg-neutral-100 px-2 py-1 font-bold text-neutral-800">QUALITY:</td>
              <td className="px-2 py-1 text-neutral-900">{po.product || '-'}</td>
            </tr>

            {/* Rate */}
            <tr className="border-b border-neutral-300">
              <td className="bg-neutral-100 px-2 py-1 font-bold text-neutral-800">RATE:</td>
              <td className="px-2 py-1 text-neutral-900">{formatCurrency(po.rate)}</td>
            </tr>

            {/* Weight */}
            <tr className="border-b border-neutral-300">
              <td className="bg-neutral-100 px-2 py-1 font-bold text-neutral-800">WEIGHT:</td>
              <td className="px-2 py-1 text-neutral-900">{formatWeight(po.weight)}</td>
            </tr>

            {/* Bags */}
            <tr className="border-b border-neutral-300">
              <td className="bg-neutral-100 px-2 py-1 font-bold text-neutral-800">BAGS:</td>
              <td className="px-2 py-1 text-neutral-900">{po.bags || '-'}</td>
            </tr>

            {/* Terms & Conditions */}
            <tr>
              <td className="bg-neutral-100 px-2 py-1 font-bold text-neutral-800 align-top">TERMS & CONDITION:</td>
              <td className="px-2 py-1 text-neutral-900">{po.terms_and_conditions || '-'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bank Details Section */}
      {company && (company.bankName || company.bankAccountNumber) && (
        <div className="mt-2">
          <p className="mb-1 text-xs font-bold text-neutral-900">BANK DETAILS</p>
          <p className="text-xs text-neutral-800 leading-tight">
            {company.bankName && `${company.bankName}`}
            {company.bankAccountNumber && `, ACCOUNT NO ${company.bankAccountNumber}`}
            {company.ifscCode && `, IFSC: ${company.ifscCode}`}
            {company.branchName && `, BRANCH: ${company.branchName}`}
          </p>
        </div>
      )}
  


      {/* Footer 
      <div className="border-t border-neutral-300 pt-4 text-center text-xs text-neutral-600">
        <p>Generated on {new Date().toLocaleString()}</p>
        <p>This is an electronically generated document</p>
      </div>
      */}
      </div>
    </div>
  );
});

POPreview.displayName = 'POPreview';
export default POPreview;
