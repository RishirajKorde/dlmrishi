import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2Icon } from 'lucide-react';
import Modal from '../../components/Modal';
import { Input, Select, Button } from '../../components/FormComponents';
import api from '../../api/axios';

const Subjects = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [categories, setCategories] = useState([]);
    const [editingSubject, setEditingSubject] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        categoryId: ''
    });

    // ✅ INITIAL LOAD
    useEffect(() => {
        fetchCategories();
        fetchSubjects();
    }, []);

    // ✅ FETCH CATEGORIES
    const fetchCategories = async () => {
        try {
            const res = await api.get('/api/v1/admin/categories');

            if (res.data?.status === 200) {
                setCategories(res.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // ✅ FETCH SUBJECTS
    const fetchSubjects = async () => {
        try {
            const res = await api.get('/api/v1/admin/categories/subjects');

            if (res.data?.status === 200) {
                const formatted = (res.data.data || []).map((s) => ({
                    id: s.id,
                    name: s.name,
                    categoryId: s.categoryId || s.category?.id,
                    categoryName: s.categoryName || s.category?.name || 'N/A',
                    status: s.isActive ? 'Active' : 'Inactive'
                }));

                setSubjects(formatted);
            }
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    };

    // ✅ ADD / UPDATE SUBJECT
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let res;

            const queryParams = new URLSearchParams({
                name: formData.name,
                categoryId: formData.categoryId
            }).toString();

            if (editingSubject) {
                // 🔄 UPDATE
                res = await api.put(`/api/v1/admin/categories/subjects/${editingSubject.id}?${queryParams}`);
            } else {
                // ➕ CREATE
                res = await api.post(`/api/v1/admin/categories/subjects?${queryParams}`);
            }

            if (res.data?.status === 200 || res.status === 200) {
                fetchSubjects();
                resetForm();
                setIsModalOpen(false);
            }

        } catch (error) {
            console.error("Error saving subject:", error.response?.data || error);
        }
    };

    // ✅ EDIT CLICK
    const handleEditClick = (subject) => {
        setEditingSubject(subject);

        setFormData({
            name: subject.name,
            categoryId: subject.categoryId || ''
        });

        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this subject?")) return;

        try {
            await api.delete(`/api/v1/admin/categories/subjects/${id}`);

            fetchSubjects(); // 🔥 refresh table

        } catch (error) {
            console.error("Delete error:", error.response?.data || error);
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const res = await api.patch(`/api/v1/admin/categories/subjects/${id}/toggle`);
            if (res.data?.status === 200 || res.status === 200) {
                fetchSubjects();
            }
        } catch (error) {
            console.error("Error toggling status:", error);
        }
    };

    // ✅ RESET FORM
    const resetForm = () => {
        setFormData({
            name: '',
            categoryId: ''
        });
        setEditingSubject(null);
    };

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search Subject..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px]"
                    />
                </div>

                <Button onClick={() => { resetForm(); setIsModalOpen(true); }} className="flex items-center gap-2 w-full md:w-auto justify-center">
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
                                <th className="px-6 py-4 text-[9px] uppercase font-bold whitespace-nowrap">Sr No</th>
                                <th className="px-6 py-4 text-[9px] uppercase font-bold whitespace-nowrap">Subject</th>
                                <th className="px-6 py-4 text-[9px] uppercase font-bold whitespace-nowrap">Category</th>
                                <th className="px-6 py-4 text-[9px] uppercase font-bold whitespace-nowrap">Status</th>
                                <th className="px-6 py-4 text-[9px] uppercase font-bold text-center whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-50">
                            {subjects.map((s, index) => (
                                <tr key={s.id} className="hover:bg-slate-50/50">

                                    <td className="px-6 py-4 text-[13px] whitespace-nowrap">{index + 1}</td>

                                    <td className="px-6 py-4 text-[13px] font-bold whitespace-nowrap">
                                        {s.name}
                                    </td>

                                    <td className="px-6 py-4 text-[13px] whitespace-nowrap">
                                        {s.categoryName}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            {/* Simple Toggle Design */}
                                            <button
                                                type="button"
                                                onClick={() => handleToggleStatus(s.id)}
                                                className={`w-9 h-5 flex items-center rounded-full p-1 transition-colors ${s.status === 'Active' ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
                                                    }`}
                                            >
                                                <div className="w-3.5 h-3.5 bg-white rounded-full shadow-sm" />
                                            </button>

                                            <span className={`text-[11px] font-semibold ${s.status === 'Active' ? 'text-emerald-600' : 'text-slate-500'}`}>
                                                {s.status}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                        <div className="flex justify-end gap-1.5">
                                            <button onClick={() => handleEditClick(s)}
                                                className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(s.id)}
                                                className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition"
                                            >
                                                <Trash2Icon size={14} />
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingSubject ? "Edit Subject" : "Add Subject"}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* CATEGORY */}
                    <Select
                        label="Category"
                        value={formData.categoryId}
                        onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                        options={[
                            { label: 'Select Category', value: '' },
                            ...categories.map(c => ({
                                label: c.name,
                                value: c.id
                            }))
                        ]}
                        required
                    />
                    {/* SUBJECT NAME */}
                    <Input
                        label="Subject Name"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                    />



                    <div className="flex gap-3">
                        <Button variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button className="flex-1" type="submit">
                            {editingSubject ? "Update" : "Save"}
                        </Button>
                    </div>

                </form>
            </Modal>

        </div>
    );
};

export default Subjects;