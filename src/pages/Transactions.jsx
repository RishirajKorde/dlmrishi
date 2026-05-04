import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Search, CheckCircle2, AlertTriangle, Clock, Book as BookIcon, Plus } from 'lucide-react';
import { Button, Input, Select } from '../components/FormComponents';
import { toast } from 'react-toastify';
import api from '../api/axios';
import TableSkeleton from '../components/TableSkeleton';
import Modal from '../components/Modal';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState([]);
  const [members, setMembers] = useState([]);
  const [availableBooks, setAvailableBooks] = useState([]);

  // Issue Form State
  const [issueForm, setIssueForm] = useState({
    memberId: '',
    branchId: '',
    bookIds: [] // Array of IDs
  });

  // Member Search / Issued Books
  const [memberSearchId, setMemberSearchId] = useState('');
  const [memberBooks, setMemberBooks] = useState([]);
  const [isMemberLoading, setIsMemberLoading] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  // Return Form State
  const [returnId, setReturnId] = useState('');

  // Get current user ID for transactions
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = currentUser.id || currentUser.userId || currentUser.librarianId || 4;


  useEffect(() => {
    fetchTransactions();
    fetchBranches();
    fetchMembers();
    fetchAvailableBooks();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/v1/admin/books/transactions');
      setTransactions(res.data.data?.content || res.data.data || []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      toast.error("Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await api.get('/api/v1/admin/branches');
      setBranches(res.data.data || []);
    } catch (err) {
      console.error("Branch error", err);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await api.get('/api/v1/branch-admin/librarians/members');
      let list = res.data.data;
      if (list?.content) list = list.content;
      setMembers(list || []);
    } catch (err) {
      console.error("Members error:", err);
    }
  };

  const fetchAvailableBooks = async () => {
    try {
      const res = await api.get('/api/v1/admin/books');
      const list = res.data.data?.content || res.data.data || [];
      // Filter only available books
      setAvailableBooks(list.filter(b => b.availableCopies > 0));
    } catch (err) {
      console.error("Books fetch error:", err);
    }
  };

  const fetchMemberBooks = async (id) => {
    if (!id) return;
    setIsMemberLoading(true);
    try {
      const res = await api.get(`/api/v1/admin/books/member/${id}`);
      setMemberBooks(res.data.data || []);

      // Auto-populate memberId and find their branch
      const selectedMember = members.find(m => String(m.memberId || m.id) === String(id));
      setIssueForm(prev => ({
        ...prev,
        memberId: id,
        branchId: selectedMember?.branchId || prev.branchId
      }));
    } catch (err) {
      console.error("Member books error:", err);
      toast.error("Member not found or no books issued.");
      setMemberBooks([]);
    } finally {
      setIsMemberLoading(false);
    }
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    if (issueForm.bookIds.length === 0) {
      toast.warning("Please select at least one book.");
      return;
    }
    try {
      const payload = {
        memberId: Number(issueForm.memberId),
        branchId: Number(issueForm.branchId),
        bookIds: issueForm.bookIds.map(id => Number(id))
      };
      const res = await api.post('/api/v1/admin/books/issue', payload);

      // Check for partial failures in bulk response
      const results = res.data.data || [];
      const failures = results.filter(r => r.status === 'FAILED');
      const successes = results.filter(r => r.status !== 'FAILED');

      if (failures.length > 0) {
        failures.forEach(f => {
          toast.error(`Book ID ${f.bookId}: ${f.message}`);
        });
        if (successes.length > 0) {
          toast.info(`${successes.length} books issued successfully, but ${failures.length} failed.`);
        }
      } else {
        toast.success("All books issued successfully!");
      }

      setIssueForm(prev => ({ ...prev, bookIds: [] }));
      fetchTransactions();
      fetchMemberBooks(issueForm.memberId); // Refresh member's list
      fetchAvailableBooks(); // Refresh stock
    } catch (err) {
      console.error("Issue error:", err);
      toast.error(err.response?.data?.message || "Failed to process book issuance.");
    }
  };

  const toggleBookSelection = (bookId) => {
    if (!bookId) return;
    setIssueForm(prev => {
      const isSelected = prev.bookIds.includes(bookId);
      if (isSelected) {
        return { ...prev, bookIds: prev.bookIds.filter(id => id !== bookId) };
      } else {
        return { ...prev, bookIds: [...prev.bookIds, bookId] };
      }
    });
  };

  const handleReturn = async (id) => {
    try {
      await api.post(`/api/v1/admin/books/return/${id}/${userId}`, {});
      toast.success("Book Returned Successfully!");
      fetchTransactions();
      fetchMemberBooks(memberSearchId || issueForm.memberId); // Refresh member's list
    } catch (err) {
      console.error("Return error:", err);
      toast.error(err.response?.data?.message || "Failed to return book.");
    }
  };

  const handleBulkReturn = async (e) => {
    e.preventDefault();
    if (!returnId) return;

    const ids = returnId.split(',').map(id => id.trim());
    let successCount = 0;
    let failCount = 0;

    for (const id of ids) {
      try {
        await api.post(`/api/v1/admin/books/return/${id}/${userId}`, {});
        successCount++;
      } catch (err) {
        console.error(`Error returning ID ${id}:`, err);
        failCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount} book(s) returned successfully!`);
      setReturnId('');
      fetchTransactions();
      if (memberSearchId) fetchMemberBooks(memberSearchId);
    }

    if (failCount > 0) {
      toast.error(`${failCount} book(s) failed to return.`);
    }
  };


  return (
    <div className="space-y-8">
      {/* Member Selection / Global Search */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 w-full">
          <Select
            label="Select Member"
            value={memberSearchId}
            onChange={e => {
              const id = e.target.value;
              setMemberSearchId(id);
              fetchMemberBooks(id);
            }}
            options={[
              { label: "Choose a member to view issued books...", value: "" },
              ...members.map(m => ({ label: `${m.name} (${m.membershipId})`, value: m.memberId || m.id }))
            ]}
          />
        </div>

        {memberBooks.length > 0 && (
          <div className="flex items-center gap-4 bg-blue-50 px-6 py-4 rounded-xl border border-blue-100">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              {memberBooks.length}
            </div>
            <div>
              <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Currently Issued</p>
              <p className="text-sm font-bold text-slate-800">Member has {memberBooks.length} books</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Issue Book Section */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <ArrowLeftRight size={20} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Issue Book</h3>
          </div>

          <form onSubmit={handleIssue} className="space-y-4">
            <Select
              label="Member"
              value={issueForm.memberId}
              onChange={e => {
                const id = e.target.value;
                setIssueForm({ ...issueForm, memberId: id });
                setMemberSearchId(id); // Sync with search
                fetchMemberBooks(id);
              }}
              options={[
                { label: "Select Member", value: "" },
                ...members.map(m => ({ label: m.name, value: m.memberId || m.id }))
              ]}
              required
            />

            <Select
              label="Branch"
              value={issueForm.branchId}
              onChange={e => setIssueForm({ ...issueForm, branchId: e.target.value })}
              options={[
                { label: "Select Branch", value: "" },
                ...branches.map(b => ({ label: b.branchName, value: b.branchId }))
              ]}
              required
            />

            <div className="space-y-3">
              <label className="text-[13px] font-bold text-slate-700 ml-1">Select Books</label>
              <button
                type="button"
                onClick={() => setIsBookModalOpen(true)}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-500 transition-all text-[13px] text-slate-600"
              >
                <span>{issueForm.bookIds.length > 0 ? `${issueForm.bookIds.length} books selected` : "Select books to issue..."}</span>
                <Plus size={18} className="text-blue-600" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <p className="text-sm text-slate-500 text-center">
                {issueForm.bookIds.length > 0
                  ? `${issueForm.bookIds.length} book(s) selected for issuance`
                  : "No books selected yet"}
              </p>
            </div>

            <Button type="submit" className="w-full py-4" disabled={isMemberLoading}>
              Confirm Issuance
            </Button>
          </form>
        </div>

        {/* Return Book Section */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 size={20} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Return Book</h3>
          </div>

          {memberBooks.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm font-semibold text-slate-500">Books issued to Member ID: {memberSearchId || issueForm.memberId}</p>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {memberBooks.map((book) => (
                  <div key={book.transactionId} className="group flex items-center justify-between p-4 bg-slate-50 hover:bg-white border border-slate-100 hover:border-emerald-200 rounded-xl transition-all shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white text-slate-400 group-hover:text-emerald-600 rounded border border-slate-100 transition-colors">
                        <BookIcon size={16} />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-slate-800">{book.bookTitle}</p>
                        <p className="text-[11px] text-slate-500">Due: {book.dueDate} • ID: #{book.transactionId}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleReturn(book.transactionId)}
                      className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg transition-all"
                      title="Return this book"
                    >
                      <CheckCircle2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleBulkReturn} className="space-y-4">
              <Input
                label="Transaction ID(s)"
                placeholder="Enter ID (e.g. 3 or 3,4 for multiple)"
                value={returnId}
                onChange={e => setReturnId(e.target.value)}
                required={!memberSearchId}
              />

              <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center space-y-2">
                <Search className="mx-auto text-slate-300" size={24} />
                <p className="text-sm text-slate-500">Search for a member at the top to see their specific issued books for easy return.</p>
              </div>

              <Button type="submit" className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200" disabled={!returnId}>
                Bulk Return by IDs
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-900">Recent Transactions</h3>
          <button onClick={fetchTransactions} className="p-2 hover:bg-slate-50 rounded-lg text-blue-600 transition">
            <Clock size={18} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] uppercase font-bold">ID</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold">Book Info</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold">Member</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold">Dates (Issue/Due/Return)</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold">Fine</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <TableSkeleton rows={5} columns={6} />
              ) : transactions.length > 0 ? (
                transactions.map((tx, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-[13px] text-slate-500">#{tx.transactionId}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded border border-blue-100">
                          <BookIcon size={14} />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-slate-900 leading-tight">{tx.bookTitle}</p>
                          <p className="text-[11px] text-slate-500">Branch: {tx.branchName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[13px] font-semibold text-slate-700">{tx.memberName}</p>
                      <p className="text-[11px] text-slate-400">ID: {tx.memberId}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-[11px]"><span className="font-semibold">I:</span> {tx.issueDate}</p>
                        <p className="text-[11px] text-rose-500"><span className="font-semibold">D:</span> {tx.dueDate}</p>
                        {tx.returnDate && <p className="text-[11px] text-emerald-600"><span className="font-semibold">R:</span> {tx.returnDate}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[13px] font-bold ${tx.fineAmount > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                        ₹{tx.fineAmount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${tx.isLost ? 'bg-rose-50 text-rose-600 border-rose-100' :
                        tx.isReturned ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                        {tx.isLost ? 'LOST' : tx.isReturned ? 'RETURNED' : 'ISSUED'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">No transactions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Book Selection Modal */}
      <Modal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        title="Select Books to Issue"
      >
        <div className="space-y-4">
          <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
            {availableBooks.length > 0 ? (
              availableBooks
                .filter(b => !issueForm.branchId || String(b.branchId) === String(issueForm.branchId))
                .map((b) => (
                  <label
                    key={b.bookId}
                    className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border ${issueForm.bookIds.includes(String(b.bookId))
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-[1.01]'
                      : 'bg-slate-50 border-slate-100 hover:border-blue-200 text-slate-700'
                      }`}
                  >
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      checked={issueForm.bookIds.includes(String(b.bookId))}
                      onChange={() => toggleBookSelection(String(b.bookId))}
                    />
                    <div className="flex-1">
                      <p className="text-[14px] font-bold">{b.title}</p>
                      <p className={`text-[12px] ${issueForm.bookIds.includes(String(b.bookId)) ? 'text-blue-100' : 'text-slate-500'}`}>
                        ISBN: {b.isbn} • {b.availableCopies} available
                      </p>
                    </div>
                  </label>
                ))
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-400">No available books found.</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => setIsBookModalOpen(false)}
            >
              Done ({issueForm.bookIds.length} selected)
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Transactions;
