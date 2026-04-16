import React, { useState } from 'react';
import { Search, Plus, Filter, MoreVertical, Book as BookIcon } from 'lucide-react';
import Modal from '../components/Modal';
import { Input, Select, Button } from '../components/FormComponents';

const Catalogue = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [books, setBooks] = useState([
    { title: "Atomic Habits", author: "James Clear", isbn: "978-0735211292", cat: "Self-Help", status: "Available", color: "text-emerald-600 bg-emerald-50", stock: "12/15" },
    { title: "The Design of Everyday Things", author: "Don Norman", isbn: "978-0465050659", cat: "Design", status: "Available", color: "text-emerald-600 bg-emerald-50", stock: "5/8" },
    { title: "Clean Code", author: "Robert C. Martin", isbn: "978-0132350884", cat: "Technology", status: "Reserved", color: "text-amber-600 bg-amber-50", stock: "0/4" },
    { title: "Sapiens", author: "Yuval Noah Harari", isbn: "978-0062316097", cat: "History", status: "Issued", color: "text-blue-600 bg-blue-50", stock: "2/10" },
    { title: "JavaScript: The Good Parts", author: "Douglas Crockford", isbn: "978-0596517748", cat: "Technology", status: "Available", color: "text-emerald-600 bg-emerald-50", stock: "3/3" },
  ]);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    cat: 'Self-Help',
    stockCount: '1'
  });

  const handleAddBook = (e) => {
    e.preventDefault();
    const newBook = {
      title: formData.title,
      author: formData.author,
      isbn: formData.isbn,
      cat: formData.cat,
      status: "Available",
      color: "text-emerald-600 bg-emerald-50",
      stock: `${formData.stockCount}/${formData.stockCount}`
    };
    setBooks([newBook, ...books]);
    setFormData({ title: '', author: '', isbn: '', cat: 'Self-Help', stockCount: '1' });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by Title, Author, or ISBN..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter size={18} />
            <span className="text-sm">Filters</span>
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <Plus size={18} />
            <span className="text-sm">Add Book</span>
          </Button>
        </div>
      </div>

      {/* Book Grid/Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Book Details</th>
                <th className="px-6 py-4">ISBN</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Copies</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {books.map((book, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-16 bg-slate-100 rounded flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                        <BookIcon size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-blue-600">{book.title}</p>
                        <p className="text-xs text-slate-500">by {book.author}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-600">{book.isbn}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded">{book.cat}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${book.color}`}>
                      {book.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="text-xs font-bold text-slate-700">{book.stock}</div>
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${parseInt(book.stock.split('/')[0]) < 2 ? 'bg-rose-500' : 'bg-blue-500'}`} 
                          style={{ width: `${(parseInt(book.stock.split('/')[0]) / parseInt(book.stock.split('/')[1])) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-sm">
          <p className="text-slate-500">Showing {books.length} of 45,210 books</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-slate-200 rounded text-slate-400 cursor-not-allowed">Previous</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>

      {/* Add Book Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add New Book to Catalogue"
      >
        <form onSubmit={handleAddBook} className="space-y-6">
          <Input 
            label="Book Title" 
            placeholder="Enter book title"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            required
          />
          <Input 
            label="Author Name" 
            placeholder="Enter author's name"
            value={formData.author}
            onChange={e => setFormData({...formData, author: e.target.value})}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input 
              label="ISBN Number" 
              placeholder="978-XXXXXXXXXX"
              value={formData.isbn}
              onChange={e => setFormData({...formData, isbn: e.target.value})}
              required
            />
            <Input 
              label="Total Copies" 
              type="number"
              min="1"
              value={formData.stockCount}
              onChange={e => setFormData({...formData, stockCount: e.target.value})}
              required
            />
          </div>
          <Select 
            label="Category"
            value={formData.cat}
            onChange={e => setFormData({...formData, cat: e.target.value})}
            options={[
              { label: 'Self-Help', value: 'Self-Help' },
              { label: 'Technology', value: 'Technology' },
              { label: 'Design', value: 'Design' },
              { label: 'History', value: 'History' },
              { label: 'Medicine', value: 'Medicine' }
            ]}
          />
          <div className="pt-4 flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)} type="button">
              Cancel
            </Button>
            <Button className="flex-1" type="submit">
              Add Book
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Catalogue;
