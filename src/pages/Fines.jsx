import React, { useState, useEffect } from 'react';
import { Search, IndianRupee, CreditCard, Calendar, User, Book, Building2 } from 'lucide-react';
import Modal from '../components/Modal';
import { Input, Select, Button } from '../components/FormComponents';
import TableSkeleton from '../components/TableSkeleton';
import api from '../api/axios';
import { toast } from 'react-toastify';

const Fines = () => {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedFine, setSelectedFine] = useState(null);
  const [payFormData, setPayFormData] = useState({
    amount: '',
    paymentMode: 'CASH'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const collectedBy = currentUser.id || currentUser.userId || currentUser.librarianId || 4;

  useEffect(() => {
    fetchFines();
  }, []);

  const fetchFines = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/v1/admin/books/fines');
      if (res.data?.status === 200) {
        setFines(res.data.data?.content || []);
      }
    } catch (error) {
      console.error('Error fetching fines:', error);
      toast.error('Failed to load fines');
    } finally {
      setLoading(false);
    }
  };

  const handlePayClick = (fine) => {
    setSelectedFine(fine);
    setPayFormData({
      amount: fine.remainingAmount,
      paymentMode: 'CASH'
    });
    setIsPayModalOpen(true);
  };

  const handlePaySubmit = async (e) => {
    e.preventDefault();
    if (!payFormData.amount || payFormData.amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (payFormData.amount > selectedFine.remainingAmount) {
      toast.error('Amount exceeds remaining fine');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        fineId: selectedFine.fineId,
        amount: Number(payFormData.amount),
        collectedBy: collectedBy,
        paymentMode: payFormData.paymentMode
      };

      const res = await api.post('/api/v1/admin/books/pay_fines', payload);
      if (res.data?.status === 200 || res.status === 200) {
        toast.success('Fine paid successfully!');
        setIsPayModalOpen(false);
        fetchFines();
      }
    } catch (error) {
      console.error('Error paying fine:', error);
      toast.error(error.response?.data?.message || 'Failed to process payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredFines = fines.filter(f => 
    f.memberName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.bookTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by member or book..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[13px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2 text-slate-500 text-[13px] font-medium">
          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
          {fines.length} Total Fines
        </div>
      </div>

      {/* Fines Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-500">Sr No</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-500">Member</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-500">Book & Branch</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-500">Amount Details</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-500">Return Date</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-500">Status</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-center text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <TableSkeleton rows={5} columns={7} />
              ) : filteredFines.length > 0 ? (
                filteredFines.map((fine, index) => (
                  <tr key={fine.fineId} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-[13px] text-slate-500 font-medium">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                          <User size={14} />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-slate-900">{fine.memberName}</p>
                          <p className="text-[11px] text-slate-400">ID: {fine.memberId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[13px] font-medium text-slate-700">
                          <Book size={12} className="text-slate-400" />
                          <span>{fine.bookTitle}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <Building2 size={12} />
                          <span>{fine.branchName}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-[11px] text-slate-400">Total:</span>
                          <span className="text-[13px] font-bold text-slate-700">₹{fine.totalAmount}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-[11px] text-slate-400">Paid:</span>
                          <span className="text-[11px] font-bold text-emerald-600">₹{fine.paidAmount}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-50">
                          <span className="text-[11px] font-bold text-slate-500">Remaining:</span>
                          <span className="text-[13px] font-black text-rose-600">₹{fine.remainingAmount}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-[12px] text-slate-600">
                        <Calendar size={14} className="text-slate-400" />
                        {fine.returnDate}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {fine.remainingAmount === 0 ? (
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          Fully Paid
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {fine.remainingAmount > 0 && (
                        <button
                          onClick={() => handlePayClick(fine)}
                          className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-blue-200 group-hover:scale-110 active:scale-95"
                          title="Pay Fine"
                        >
                          <IndianRupee size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-2">
                        <IndianRupee size={32} />
                      </div>
                      <p className="font-bold">No fines found</p>
                      <p className="text-xs">Search with different terms or check back later</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pay Fine Modal */}
      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title="Collect Fine Payment"
      >
        {selectedFine && (
          <form onSubmit={handlePaySubmit} className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-slate-500">Member:</span>
                <span className="text-[13px] font-bold text-slate-900">{selectedFine.memberName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-slate-500">Book:</span>
                <span className="text-[13px] font-bold text-slate-900 text-right max-w-[200px] truncate">{selectedFine.bookTitle}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="text-[12px] font-bold text-slate-600">Remaining Fine:</span>
                <span className="text-lg font-black text-rose-600">₹{selectedFine.remainingAmount}</span>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                label="Payment Amount (₹)"
                type="number"
                value={payFormData.amount}
                onChange={(e) => setPayFormData({ ...payFormData, amount: e.target.value })}
                placeholder="Enter amount to pay"
                required
                min="1"
                max={selectedFine.remainingAmount}
              />

              <Select
                label="Payment Mode"
                value={payFormData.paymentMode}
                onChange={(e) => setPayFormData({ ...payFormData, paymentMode: e.target.value })}
                options={[
                  { label: 'Cash', value: 'CASH' },
                  { label: 'Online Payment', value: 'ONLINE' },
                  { label: 'Check / DD', value: 'CHECK' },
                  { label: 'UPI', value: 'UPI' }
                ]}
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="secondary"
                className="flex-1 py-3 h-auto"
                onClick={() => setIsPayModalOpen(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button
                className="flex-1 py-3 h-auto shadow-lg shadow-blue-100"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CreditCard size={18} />
                    <span>Pay Now</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Fines;
