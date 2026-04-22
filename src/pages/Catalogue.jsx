import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, MoreVertical, Book as BookIcon, Edit2, Trash2Icon, Eye } from 'lucide-react';
import Modal from '../components/Modal';
import { Input, Select, Button } from '../components/FormComponents';
import api from '../api/axios';

const Catalogue = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ BOOKS 
  const [books, setBooks] = useState([]);

  // ✅ API states
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [branches, setBranches] = useState([]);
  const [viewData, setViewData] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
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
    branch_id: ''
  });

  // ✅ Initial Load
  useEffect(() => {
    fetchCategories();
    fetchBranches();
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
    try {
      const res = await api.get('/api/v1/admin/books');

      console.log("Books FULL response:", res.data);

      const booksData = res.data.data.content || [];


      const formatted = booksData.map((b) => ({
        book_id: b.bookId,
        title: b.title,
        author: b.author,
        isbn: b.isbn,
        cat: b.categoryName,

        // ✅ ADD THESE (VERY IMPORTANT)
        categoryId: b.categoryId,
        subjectId: b.subjectId,

        total_copies: b.totalCopies,
        available_copies: b.availableCopies,
        branch_id: b.branchId,

        status: b.availableCopies > 0 ? "Active" : "Out of Stock",
        color:
          b.availableCopies > 0
            ? "text-emerald-600 bg-emerald-50"
            : "text-rose-600 bg-rose-50",
        stock: `${b.availableCopies}/${b.totalCopies}`,
      }));

      setBooks(formatted);

    } catch (err) {
      console.error("Books fetch error", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/v1/admin/categories');
      setCategories(res.data.data);
    } catch (err) {
      console.error("Category error", err);
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await api.get('/api/v1/admin/branches');
      setBranches(res.data.data);
    } catch (err) {
      console.error("Branch error", err);
    }
  };

  const fetchSubjects = async (categoryId) => {
    try {
      const res = await api.get(
        `/api/v1/admin/categories/by-category?categoryId=${categoryId}`
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
      categoryId: Number(formData.categoryId),
      subjectId: Number(formData.subjectId),
      branchId: Number(formData.branch_id),
      totalCopies: Number(formData.stockCount),
    };

    try {
      if (isEditMode) {
        await api.put(`/api/v1/admin/books/${viewData.book_id}`, payload);
      } else {
        await api.post('/api/v1/admin/books', payload);
      }

      fetchBooks();
      setIsModalOpen(false);
      setIsEditMode(false);

    } catch (err) {
      console.error("Save error", err.response?.data || err);
    }
  };

  // view Modal function
  const handleView = (book) => {
    setViewData(book);
    setIsViewOpen(true);
  };

  const handleEdit = (book) => {
    setIsEditMode(true);
    setIsModalOpen(true);
    setViewData(book);

    // ✅ load subjects for selected category
    fetchSubjects(book.categoryId);

    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      categoryId: book.categoryId || '',
      subjectId: book.subjectId || '',
      stockCount: book.total_copies,
      publisher: '',
      edition: '',
      branch_id: book.branch_id
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      await api.delete(`/api/v1/admin/books/${id}`);

      fetchBooks(); // refresh
    } catch (err) {
      console.error("Delete error", err);
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
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[9px] uppercase font-bold">Sr No</th>

                <th className="px-6 py-4 text-[9px] uppercase font-bold">Book Details</th>
                <th className="px-6 py-4 text-[9px] uppercase font-bold">ISBN</th>
                <th className="px-6 py-4 text-[9px] uppercase font-bold">Category</th>
                <th className="px-6 py-4 text-[9px] uppercase font-bold">Status</th>
                <th className="px-6 py-4 text-[9px] uppercase font-bold">Copies</th>
                <th className="px-6 py-4 text-[9px] uppercase font-bold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {books.map((book, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-[13px]">{idx + 1}</td>

                  <td className="px-6 py-4 text-[13px] uppercase font-bold">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-16 bg-slate-100 rounded flex items-center justify-center">
                        <BookIcon size={20} />
                      </div>
                      <div>
                        <p className="text-slate-900">{book.title}</p>
                        <p className="text-xs text-slate-500">by {book.author}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-[13px] text-slate-600">{book.isbn}</td>

                  <td className="px-6 py-4 text-[13px]">{book.cat}
                    {/* <span className="text-sm bg-slate-100 px-2 py-1 rounded">{book.cat}</span> */}
                  </td>

                  <td className="px-6 py-4 text-[13px]">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${book.color}`}>
                      {book.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-[13px]">
                    <div className="text-xs">{book.stock}</div>
                  </td>
                  <td className="px-6 py-4 text-right gap-1.5">

                    {/* VIEW */}
                    <button

                      onClick={() => handleView(book)}
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition"

                    >
                      <Eye size={14} />
                    </button>

                    {/* EDIT */}
                    <button
                      onClick={() => handleEdit(book)}
                      className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition"
                    >
                      <Edit2 size={14} />
                    </button>

                    {/* DELETE */}
                    <button

                      onClick={() => handleDelete(book.book_id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition"
                    >
                      <Trash2Icon size={16} />                     
                       </button>


                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Book to Catalogue">
        <form onSubmit={handleAddBook} className="space-y-6">

          <Input label="Book Title" value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })} />

          <Input label="Author Name" value={formData.author}
            onChange={e => setFormData({ ...formData, author: e.target.value })} />

          <Input label="ISBN Number" value={formData.isbn}
            onChange={e => setFormData({ ...formData, isbn: e.target.value })} />

          <Input label="Total Copies" type="number" value={formData.stockCount}
            onChange={e => setFormData({ ...formData, stockCount: e.target.value })} />
          <Select
            label="Branch"
            value={formData.branch_id}
            onChange={(e) =>
              setFormData({ ...formData, branch_id: e.target.value })
            }
            options={[
              { label: "Select Branch", value: "" }, // ✅ placeholder
              ...branches.map(b => ({
                label: b.branchName,
                value: b.branchId
              }))
            ]}
          />

          {/* Category */}
          <Select
            label="Category"
            value={formData.categoryId}
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
            onChange={(e) =>
              setFormData({ ...formData, subjectId: e.target.value })
            }
            options={[
              { label: "Select Subject", value: "" }, // ✅ placeholder
              ...subjects.map(s => ({
                label: s.subjectName,
                value: s.subjectId
              }))
            ]}
            disabled={!formData.categoryId} // ✅ important
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
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Book Details"
      >
        {viewData && (
          <div className="space-y-3 text-sm">
            <p><b>Title:</b> {viewData.title}</p>
            <p><b>Author:</b> {viewData.author}</p>
            <p><b>ISBN:</b> {viewData.isbn}</p>
            <p><b>Category:</b> {viewData.cat}</p>
            <p><b>Copies:</b> {viewData.stock}</p>
            <p><b>Status:</b> {viewData.status}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Catalogue;