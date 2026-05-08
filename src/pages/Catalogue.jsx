import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, MoreVertical, Book as BookIcon, Edit2, Trash2Icon, Eye, Users } from 'lucide-react';
import Modal from '../components/Modal';
import { Input, Select, Button } from '../components/FormComponents';
import TableSkeleton from '../components/TableSkeleton';
import api from '../api/axios';
import { toast } from 'react-toastify';

const Catalogue = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ BOOKS 
  const [books, setBooks] = useState([]);

  // ✅ API states
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [branches, setBranches] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [viewData, setViewData] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [bookMembers, setBookMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [selectedBookTitle, setSelectedBookTitle] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const userRole = localStorage.getItem('role')?.toUpperCase();
  const userBranchId = localStorage.getItem('branchId');

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    cat: '',
    categoryId: '',
    subjectId: '',
    stockCount: '1',
    publisher: '',
    edition: '',
    subject: '',
    language: '',
    branch_id: (userRole !== 'SUPERADMIN' && userRole !== 'SUPER_ADMIN') ? userBranchId : ''
  });

  // ✅ Initial Load
  useEffect(() => {
    fetchCategories();
    fetchBranches();
    fetchLanguages();
    fetchBooks(); // 🔥 important
  }, []);

  // ================= API =================

  // const fetchBooks = async () => {
  //   try {
  //     const res = await api.get('/api/v1/admin/books');

  //     console.log("Books API:", res.data);

  //     const formatted = res.data.data.map((b) => ({
  //       book_id: b.bookId,
  //       title: b.title,
  //       author: b.author,
  //       isbn: b.isbn,
  //       category: b.categoryName,
  //       total_copies: b.totalCopies,
  //       available_copies: b.availableCopies,
  //       branch_id: b.branchId,
  //       status: b.availableCopies > 0 ? "Available" : "Out of Stock",
  //       created_at: b.createdAt,

  //       // UI fields (same as your UI)
  //       cat: b.categoryName,
  //       color:
  //         b.availableCopies > 0
  //           ? "text-emerald-600 bg-emerald-50"
  //           : "text-rose-600 bg-rose-50",
  //       stock: `${b.availableCopies}/${b.totalCopies}`,
  //     }));

  //     setBooks(formatted);

  //   } catch (err) {
  //     console.error("Books fetch error", err);
  //   }
  // };


  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/v1/admin/books');

      console.log("Books FULL response:", res.data);

      const booksData = res.data.data?.content || res.data.data || [];

      const formatted = booksData.map((b) => ({
        book_id: b.bookId,
        title: b.title,
        author: b.author,
        isbn: b.isbn,
        categoryName: b.categoryName,
        subjectName: b.subjectName,
        branchName: b.branchName,
        issuedCopies: b.issuedCopies,
        availableCopies: b.availableCopies,
        totalCopies: b.totalCopies,
        status: b.status,
        isActive: b.isActive,
        categoryId: b.categoryId || b.category?.id,
        subjectId: b.subjectId || b.subject?.id || b.subject?.subjectId,
        branchId: b.branchId || b.branch?.id || b.branch?.branchId,

        statusColor:
          b.status === "AVAILABLE" ? "text-emerald-600 bg-emerald-50" :
            b.status === "ISSUED" ? "text-amber-600 bg-amber-50" :
              "text-rose-600 bg-rose-50",
        publisher: b.publisher,
        edition: b.edition,
        languageId: b.languageId || b.language?.id,
        languageName: b.languageName || b.language?.name || b.language
      }));

      setBooks(formatted);

    } catch (err) {
      console.error("Books fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/v1/admin/categories?onlyActive=true');
      setCategories(res.data.data);
    } catch (err) {
      console.error("Category error", err);
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await api.get('/api/v1/admin/branches?onlyActive=true');
      setBranches(res.data.data);
    } catch (err) {
      console.error("Branch error", err);
    }
  };

  const fetchLanguages = async () => {
    try {
      const res = await api.get('/api/v1/admin/languages?onlyActive=true');
      setLanguages(res.data.data || []);
    } catch (err) {
      console.error("Language error", err);
    }
  };

  const fetchSubjects = async (categoryId) => {
    try {
      const res = await api.get(
        `/api/v1/admin/categories/by-category?categoryId=${categoryId}&onlyActive=true`
      );
      console.log("fetchsubjectRK", res)
      setSubjects(res.data.data);
    } catch (err) {
      console.error("Subject error", err);
    }
  };

  // ================= ADD BOOK =================

  // const handleAddBook = async (e) => {
  //   e.preventDefault();

  //   const payload = {
  //     isbn: formData.isbn,
  //     title: formData.title,
  //     author: formData.author,
  //     publisher: formData.publisher,
  //     edition: formData.edition,
  //     categoryId: Number(formData.categoryId),
  //     subjectId: Number(formData.subjectId),
  //     branchId: Number(formData.branch_id),
  //     totalCopies: Number(formData.stockCount),
  //   };

  //   try {
  //     await api.post('/api/v1/admin/books', payload);

  //     // 🔥 refresh from backend
  //     fetchBooks();

  //     setIsModalOpen(false);

  //     // reset form
  //     setFormData({
  //       title: '',
  //       author: '',
  //       isbn: '',
  //       cat: '',
  //       categoryId: '',
  //       subjectId: '',
  //       stockCount: '1',
  //       publisher: '',
  //       edition: '',
  //       subject: '',
  //       language: '',
  //       branch_id: ''
  //     });

  //   } catch (err) {
  //     console.error("Book add error", err.response?.data || err);
  //   }
  // };
  const handleAddBook = async (e) => {
    e.preventDefault();

    const payload = {
      isbn: formData.isbn,
      title: formData.title,
      author: formData.author,
      publisher: formData.publisher,
      edition: formData.edition,
      categoryId: formData.categoryId ? Number(formData.categoryId) : null,
      subjectId: formData.subjectId ? Number(formData.subjectId) : null,
      branchId: formData.branch_id ? Number(formData.branch_id) : null,
      totalCopies: Number(formData.stockCount),
      languageId: formData.language ? Number(formData.language) : null
    };

    try {
      if (isEditMode) {
        await api.put(`/api/v1/admin/books/${viewData.book_id}`, payload);
        toast.success('Book updated successfully!');
      } else {
        await api.post('/api/v1/admin/books', payload);
        toast.success('Book added successfully!');
      }

      fetchBooks();
      setIsModalOpen(false);
      setIsEditMode(false);

    } catch (err) {
      toast.error(isEditMode ? 'Failed to update book.' : 'Failed to add book.');
      console.error("Save error", err.response?.data || err);
    }
  };

  // view Modal function
  const handleView = (book) => {
    setViewData(book);
    setIsViewOpen(true);
  };

  const handleEdit = (book) => {
    setViewData(book);
    setIsEditMode(true);
    setIsModalOpen(true);

    // Refresh dependencies
    fetchLanguages();

    // ✅ load subjects for selected category
    if (book.categoryId) {
      fetchSubjects(book.categoryId);
    }

    // 🔥 Find language ID by name if languageId is missing (fixes edit selection issue)
    let langId = book.languageId;
    if (!langId && book.languageName) {
      const found = languages.find(l => l.name === book.languageName);
      if (found) langId = found.id;
    }

    // 🔥 Find branch ID by name if branchId is missing (fixes edit selection issue)
    let branchIdVal = book.branchId;
    if (!branchIdVal && book.branchName) {
      const found = branches.find(b => (b.branchName || b.name) === book.branchName);
      if (found) branchIdVal = found.branchId || found.id;
    }

    setFormData({
      title: book.title || '',
      author: book.author || '',
      isbn: book.isbn || '',
      categoryId: book.categoryId || '',
      subjectId: book.subjectId || '',
      stockCount: book.totalCopies || '1',
      publisher: book.publisher || '',
      edition: book.edition || '',
      branch_id: branchIdVal || '',
      language: langId || ''
    });
  };

  const handleDeleteClick = (book) => {
    setBookToDelete(book);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/api/v1/admin/books/${bookToDelete.book_id}`);
      toast.success('Book deleted successfully!');
      fetchBooks();
      setIsDeleteModalOpen(false);
      setBookToDelete(null);
    } catch (err) {
      toast.error('Failed to delete book.');
      console.error("Delete error", err);
    }
  };

  const handleShowMembers = async (book) => {
    setSelectedBookTitle(book.title);
    setIsMembersModalOpen(true);
    setMembersLoading(true);
    try {
      const res = await api.get(`/api/v1/admin/books/${book.book_id}/members`);
      // Handle both { data: [...] } and { data: { data: [...] } } or direct array
      const members = res.data.data || res.data || [];
      setBookMembers(Array.isArray(members) ? members : [members]);
    } catch (err) {
      console.error("Error fetching book members:", err);
      toast.error("Failed to load members.");
    } finally {
      setMembersLoading(false);
    }
  };
  // ================= UI =================

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by Title, Author, or ISBN..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px]"
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter size={18} />
            <span className="text-sm">Filters</span>
          </Button>

          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <Plus size={18} />
            <span>Add</span>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[9px] uppercase font-bold whitespace-nowrap">Sr No</th>
                <th className="px-6 py-4 text-[9px] uppercase font-bold whitespace-nowrap">Book Info</th>
                <th className="px-6 py-4 text-[9px] uppercase font-bold whitespace-nowrap">ISBN</th>
                <th className="px-6 py-4 text-[9px] uppercase font-bold whitespace-nowrap">Category / Subject</th>
                <th className="px-6 py-4 text-[9px] uppercase font-bold whitespace-nowrap">Branch</th>
                <th className="px-6 py-4 text-[9px] uppercase font-bold whitespace-nowrap text-center">Copies (T/A/I)</th>
                <th className="px-6 py-4 text-[9px] uppercase font-bold whitespace-nowrap text-center">Status</th>
                <th className="px-6 py-4 text-[9px] uppercase font-bold whitespace-nowrap text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <TableSkeleton rows={5} columns={8} />
              ) : (
                books.map((book, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-[13px]">{idx + 1}</td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-11 bg-blue-50 rounded flex items-center justify-center text-blue-600 border">
                          <BookIcon size={14} />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-slate-900 leading-tight">{book.title}</p>
                          <p className="text-[11px] text-slate-500">by {book.author}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-[13px] text-slate-600 font-mono">{book.isbn}</td>

                    <td className="px-6 py-4">
                      <p className="text-[13px] font-semibold text-slate-700">{book.categoryName}</p>
                      <p className="text-[11px] text-slate-400">{book.subjectName}</p>
                    </td>

                    <td className="px-6 py-4 text-[13px] text-slate-600">{book.branchName}</td>

                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="text-[13px] font-bold text-slate-800">{book.totalCopies}</span>
                        <div className="flex gap-2 text-[10px] text-slate-400 border-t mt-1 pt-1">
                          <span className="text-emerald-600">A: {book.availableCopies}</span>
                          <span className="text-amber-600">I: {book.issuedCopies}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${book.statusColor}`}>
                        {book.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleView(book)}
                          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>

                        <button
                          onClick={() => handleShowMembers(book)}
                          className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-600 transition"
                          title="View Members"
                        >
                          <Users size={14} />
                        </button>

                        <button
                          onClick={() => handleEdit(book)}
                          className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition"
                          title="Edit Book"
                        >
                          <Edit2 size={14} />
                        </button>

                        <button
                          onClick={() => handleDeleteClick(book)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition"
                          title="Delete Book"
                        >
                          <Trash2Icon size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Book to Catalogue">
        <form onSubmit={handleAddBook} className="space-y-6">

          <Input label="Book Title" value={formData.title} required
            onChange={e => setFormData({ ...formData, title: e.target.value })} />

          <Input label="Author Name" value={formData.author} required
            onChange={e => setFormData({ ...formData, author: e.target.value })} />

          <Input label="ISBN Number" value={formData.isbn} required
            onChange={e => setFormData({ ...formData, isbn: e.target.value })} />

          <Input label="Total Copies" type="number" value={formData.stockCount} required
            onChange={e => setFormData({ ...formData, stockCount: e.target.value })} />
          {(userRole === 'SUPERADMIN' || userRole === 'SUPER_ADMIN') && (
            <Select
              label="Branch"
              value={formData.branch_id}
              required
              onChange={(e) =>
                setFormData({ ...formData, branch_id: e.target.value })
              }
              options={[
                { label: "Select Branch", value: "" }, // ✅ placeholder
                ...branches.map(b => ({
                  label: b.branchName || b.name,
                  value: b.branchId || b.id
                }))
              ]}
            />
          )}

          {/* Category */}
          <Select
            label="Category"
            value={formData.categoryId}
            required
            onChange={(e) => {
              const selectedId = e.target.value;

              setFormData({
                ...formData,
                categoryId: selectedId,
                subjectId: '' // reset subject
              });

              fetchSubjects(selectedId);
            }}
            options={[
              { label: "Select Category", value: "" }, // ✅ placeholder
              ...categories.map(c => ({
                label: c.name,
                value: c.id
              }))
            ]}
          />

          {/* Subject */}
          <Select
            label="Subject"
            value={formData.subjectId}
            required
            onChange={(e) =>
              setFormData({ ...formData, subjectId: e.target.value })
            }
            options={[
              { label: "Select Subject", value: "" }, // ✅ placeholder
              ...subjects.map(s => ({
                label: s.name || s.subjectName,
                value: s.id || s.subjectId
              }))
            ]}
            disabled={!formData.categoryId} // ✅ important
          />

          <Select
            label="Language"
            value={formData.language}
            required
            onChange={(e) =>
              setFormData({ ...formData, language: e.target.value })
            }
            options={[
              { label: "Select Language", value: "" },
              ...languages.map(l => ({
                label: l.name,
                value: l.id
              }))
            ]}
          />


          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button className="flex-1" type="submit">Save</Button>
          </div>

        </form>
      </Modal>


      <Modal
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        title={`Members with "${selectedBookTitle}"`}
      >
        <div className="space-y-4">
          {membersLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 text-sm">Fetching members...</p>
            </div>
          ) : bookMembers.length > 0 ? (
            <div className="border border-slate-100 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Sr No</th>
                    <th className="px-4 py-3">Member</th>
                    <th className="px-4 py-3">Issue Date</th>
                    <th className="px-4 py-3">Due Date</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {bookMembers.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 text-[13px]">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-[13px] font-bold text-slate-900">{item.memberName}</span>
                          <span className="text-[11px] text-slate-500">ID: {item.memberId}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[13px] text-slate-600">{item.issueDate}</td>
                      <td className="px-4 py-3 text-[13px] text-slate-600">{item.dueDate}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.status === 'ISSUED' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-3">
                <Users size={24} />
              </div>
              <p className="text-slate-500 font-medium">No members currently have this book.</p>
            </div>
          )}

          <Button variant="secondary" className="w-full" onClick={() => setIsMembersModalOpen(false)}>
            Close
          </Button>
        </div>
      </Modal>

      {/* View Book Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Book Details"
      >
        {viewData && (
          <div className="space-y-4 text-[13px]">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-12 h-16 bg-blue-100 rounded flex items-center justify-center text-blue-600 border border-blue-200">
                <BookIcon size={24} />
              </div>
              <div>
                <p className="text-slate-400 text-[11px] uppercase font-bold tracking-wider">Book Title</p>
                <p className="text-lg font-bold text-slate-900">{viewData.title}</p>
                <p className="text-slate-500 font-medium">by {viewData.author}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white border border-slate-100 rounded-lg">
                <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">ISBN</p>
                <p className="font-mono font-bold text-slate-700">{viewData.isbn}</p>
              </div>
              <div className="p-3 bg-white border border-slate-100 rounded-lg">
                <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">Status</p>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${viewData.statusColor}`}>
                  {viewData.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white border border-slate-100 rounded-lg">
                <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">Category</p>
                <p className="font-bold text-slate-700">{viewData.categoryName}</p>
              </div>
              <div className="p-3 bg-white border border-slate-100 rounded-lg">
                <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">Subject</p>
                <p className="font-bold text-slate-700">{viewData.subjectName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white border border-slate-100 rounded-lg">
                <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">Branch</p>
                <p className="font-bold text-slate-700">{viewData.branchName}</p>
              </div>
              <div className="p-3 bg-white border border-slate-100 rounded-lg">
                <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">Language</p>
                <p className="font-bold text-slate-700">{viewData.languageName || 'N/A'}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-slate-400 text-[10px] uppercase font-bold mb-3 text-center tracking-widest">Stock Information</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500">Total</span>
                  <span className="text-lg font-black text-slate-800">{viewData.totalCopies}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500">Available</span>
                  <span className="text-lg font-black text-emerald-600">{viewData.availableCopies}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500">Issued</span>
                  <span className="text-lg font-black text-amber-600">{viewData.issuedCopies}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white border border-slate-100 rounded-lg">
                <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">Publisher</p>
                <p className="font-bold text-slate-700">{viewData.publisher || 'N/A'}</p>
              </div>
              <div className="p-3 bg-white border border-slate-100 rounded-lg">
                <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">Edition</p>
                <p className="font-bold text-slate-700">{viewData.edition || 'N/A'}</p>
              </div>
            </div>

            <Button variant="secondary" className="w-full mt-4" onClick={() => setIsViewOpen(false)}>
              Close Details
            </Button>
          </div>
        )}
      </Modal>
      {/* DELETE CONFIRMATION MODAL */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Delete">
        <div className="space-y-6">
          <p className="text-[13px] text-slate-600">
            Are you sure you want to delete the book <span className="font-bold text-slate-900">"{bookToDelete?.title}"</span>? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Catalogue;