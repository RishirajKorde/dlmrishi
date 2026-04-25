import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit2, Trash2 } from 'lucide-react';
import Modal from '../../components/Modal';
import { Input, Select, Button } from '../../components/FormComponents';
import TableSkeleton from '../../components/TableSkeleton';
import api from '../../api/axios';
import { toast } from 'react-toastify';

const Categories = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [viewingCategory, setViewingCategory] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        status: 'Active'
    });

    // ✅ FETCH API
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async (showSkeleton = true) => {
        if (showSkeleton) setLoading(true);
        try {
            const res = await api.get('/api/v1/admin/categories');
            // console.log("kordec",res);
            if (res.data?.status === 200) {
                const formattedData = res.data.data.map((c) => ({
                    id: c.id,
                    name: c.name,
                    status: c.isActive ? 'Active' : 'Inactive'
                }));

                setCategories(formattedData);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ POST & PUT CATEGORY
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let res;
            if (editingCategory) {
                res = await api.put(`/api/v1/admin/categories/${editingCategory.id}`, null, {
                    params: {
                        name: formData.name
                    }
                });
            } else {
                res = await api.post('/api/v1/admin/categories', null, {
                    params: {
                        name: formData.name
                    }
                });
            }

            if (res.data?.status === 200 || res.status === 200) {
                toast.success(editingCategory ? 'Category updated successfully!' : 'Category added successfully!');
                fetchCategories();
                resetForm();
                setIsModalOpen(false);
            }

        } catch (error) {
            toast.error(editingCategory ? 'Failed to update category.' : 'Failed to add category.');
            console.error("Error saving category:", error);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            status: 'Active'
        });
        setEditingCategory(null);
    };

    const handleEditClick = (c) => {
        setEditingCategory(c);
        setFormData(c);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this category?")) return;
        try {
            await api.delete(`/api/v1/admin/categories/${id}`);
            toast.success('Category deleted successfully!');
            fetchCategories();
        } catch (error) {
            toast.error('Failed to delete category.');
            console.error('Error deleting category:', error);
        }
    };

    const handleDeleteConfirm = () => {
        setCategories(categories.filter(c => c.id !== categoryToDelete.id));
        setIsDeleteModalOpen(false);
    };

    const handleToggleStatus = async (id) => {
        try {
            // Added an empty object {} in case the server requires a body even for a PATCH toggle
            const res = await api.patch(`/api/v1/admin/categories/${id}/toggle`, {});
            if (res.data?.status === 200 || res.status === 200) {
                toast.success('Status updated successfully!');
                fetchCategories(false);
            }
        } catch (error) {
            toast.error('Failed to update status.');
            console.error("Error toggling status:", error);
        }
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search Category..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px]"
                    />
                </div>

                <Button onClick={() => { resetForm(); setIsModalOpen(true); }} className="flex items-center gap-2">
                    <Plus size={18} />
                    <span>Add</span>
                </Button>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[9px] uppercase font-bold">Sr No</th>
                                <th className="px-6 py-4 text-[9px] uppercase font-bold">Category Name</th>
                                <th className="px-6 py-4 text-[9px] uppercase font-bold">Status</th>
                                <th className="px-6 py-4 text-[9px] uppercase font-bold text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <TableSkeleton rows={5} columns={4} />
                            ) : (
                                categories.map((c, index) => (
                                    <tr key={c.id} className="hover:bg-slate-50/50 group">

                                        <td className="px-6 py-4 text-[13px]">{index + 1}</td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-bold text-[11px] border">
                                                    {c.name?.[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 text-[13px]">{c.name}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {/* Simple Toggle Design */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleStatus(c.id)}
                                                    className={`w-9 h-5 flex items-center rounded-full p-1 transition-colors ${c.status === 'Active' ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
                                                        }`}
                                                >
                                                    <div className="w-3.5 h-3.5 bg-white rounded-full shadow-sm" />
                                                </button>

                                                <span className={`text-[11px] font-semibold ${c.status === 'Active' ? 'text-emerald-600' : 'text-slate-500'}`}>
                                                    {c.status}
                                                </span>
                                            </div>
                                        </td>


                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button onClick={() => setViewingCategory(c)}
                                                    className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition">
                                                    <Eye size={14} />
                                                </button>
                                                {/* EDIT */}
                                                <button
                                                    onClick={() => handleEditClick(c)}
                                                    className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition"
                                                >
                                                    <Edit2 size={14} />
                                                </button>

                                                {/* DELETE */}
                                                <button
                                                    onClick={() => handleDelete(c.id)}
                                                    className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition"
                                                >
                                                    <Trash2 size={14} />
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

            {/* FORM MODAL */}
            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={editingCategory ? "Edit Category" : "Add Category"}>
                <form onSubmit={handleSubmit} className="space-y-6">

                    <Input
                        label="Category Name"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                    />

                    <Select
                        label="Status"
                        value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                        options={[
                            { label: 'Active', value: 'Active' },
                            { label: 'Inactive', value: 'Inactive' }
                        ]}
                    />

                    <div className="flex gap-3">
                        <Button type="button" variant="secondary" className="flex-1" onClick={() => { setIsModalOpen(false); resetForm(); }}>
                            Cancel
                        </Button>
                        <Button className="flex-1" type="submit">{editingCategory ? "Update" : "Save"}</Button>
                    </div>

                </form>
            </Modal>

        </div>
    );
};

export default Categories;