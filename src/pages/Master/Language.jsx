import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit2, Trash2 } from 'lucide-react';
import Modal from '../../components/Modal';
import { Input, Select, Button } from '../../components/FormComponents';
import TableSkeleton from '../../components/TableSkeleton';
import api from '../../api/axios';
import { toast } from 'react-toastify';

const Language = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewingLanguage, setViewingLanguage] = useState(null);
    const [editingLanguage, setEditingLanguage] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [languageToDelete, setLanguageToDelete] = useState(null);

    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        status: 'Active'
    });

    // ✅ FETCH API
    useEffect(() => {
        fetchLanguages();
    }, []);

    const fetchLanguages = async (showSkeleton = true) => {
        if (showSkeleton) setLoading(true);
        try {
            // Assuming the endpoint follows the pattern /api/v1/admin/languages
            const res = await api.get('/api/v1/admin/languages');
            if (res.data?.status === 200) {
                const formattedData = res.data.data.map((l) => ({
                    id: l.id,
                    name: l.name,
                    status: l.isActive ? 'Active' : 'Inactive'
                }));

                setLanguages(formattedData);
            }
        } catch (error) {
            console.error('Error fetching languages:', error);
            // Fallback for demo if API fails
            // setLanguages([{ id: 1, name: 'English', status: 'Active' }]);
        } finally {
            setLoading(false);
        }
    };

    // ✅ POST & PUT LANGUAGE
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let res;
            const payload = {
                name: formData.name,
                isActive: formData.status === 'Active'
            };

            if (editingLanguage) {
                res = await api.put(`/api/v1/admin/languages/${editingLanguage.id}`, payload);
            } else {
                res = await api.post('/api/v1/admin/languages', payload);
            }

            if (res.data?.status === 200 || res.status === 200) {
                toast.success(editingLanguage ? 'Language updated successfully!' : 'Language added successfully!');
                fetchLanguages();
                resetForm();
                setIsModalOpen(false);
            }

        } catch (error) {
            toast.error(editingLanguage ? 'Failed to update language.' : 'Failed to add language.');
            console.error("Error saving language:", error);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            status: 'Active'
        });
        setEditingLanguage(null);
    };

    const handleEditClick = (l) => {
        setEditingLanguage(l);
        setFormData(l);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (l) => {
        setLanguageToDelete(l);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await api.delete(`/api/v1/admin/languages/${languageToDelete.id}`);
            toast.success('Language deleted successfully!');
            fetchLanguages();
            setIsDeleteModalOpen(false);
            setLanguageToDelete(null);
        } catch (error) {
            toast.error('Failed to delete language.');
            console.error('Error deleting language:', error);
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const res = await api.patch(`/api/v1/admin/languages/${id}/toggle`, {});
            if (res.data?.status === 200 || res.status === 200) {
                toast.success('Status updated successfully!');
                fetchLanguages(false);
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
                        placeholder="Search Language..."
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
                                <th className="px-6 py-4 text-[9px] uppercase font-bold">Language Name</th>
                                <th className="px-6 py-4 text-[9px] uppercase font-bold">Status</th>
                                <th className="px-6 py-4 text-[9px] uppercase font-bold text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <TableSkeleton rows={5} columns={4} />
                            ) : (
                                languages.map((l, index) => (
                                    <tr key={l.id} className="hover:bg-slate-50/50 group">

                                        <td className="px-6 py-4 text-[13px]">{index + 1}</td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-bold text-[11px] border">
                                                    {l.name?.[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 text-[13px]">{l.name}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleStatus(l.id)}
                                                    className={`w-9 h-5 flex items-center rounded-full p-1 transition-colors ${l.status === 'Active' ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
                                                        }`}
                                                >
                                                    <div className="w-3.5 h-3.5 bg-white rounded-full shadow-sm" />
                                                </button>

                                                <span className={`text-[11px] font-semibold ${l.status === 'Active' ? 'text-emerald-600' : 'text-slate-500'}`}>
                                                    {l.status}
                                                </span>
                                            </div>
                                        </td>


                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button onClick={() => setViewingLanguage(l)}
                                                    className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition">
                                                    <Eye size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleEditClick(l)}
                                                    className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition"
                                                >
                                                    <Edit2 size={14} />
                                                </button>

                                                <button
                                                    onClick={() => handleDeleteClick(l)}
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
            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={editingLanguage ? "Edit Language" : "Add Language"}>
                <form onSubmit={handleSubmit} className="space-y-6">

                    <Input
                        label="Language Name"
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
                        <Button className="flex-1" type="submit">{editingLanguage ? "Update" : "Save"}</Button>
                    </div>

                </form>
            </Modal>

            {/* VIEW MODAL */}
            <Modal isOpen={!!viewingLanguage} onClose={() => setViewingLanguage(null)} title="Language Details">
                {viewingLanguage && (
                    <div className="space-y-4 text-[13px]">
                        <div>
                            <p className="text-slate-400">Language Name</p>
                            <p className="font-bold text-lg">{viewingLanguage.name}</p>
                        </div>
                        <div>
                            <p className="text-slate-400">Status</p>
                            <p className={`font-bold ${viewingLanguage.status === 'Active' ? 'text-emerald-600' : 'text-slate-500'}`}>{viewingLanguage.status}</p>
                        </div>
                    </div>
                )}
            </Modal>

            {/* DELETE CONFIRMATION MODAL */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Delete">
                <div className="space-y-6">
                    <p className="text-[13px] text-slate-600">
                        Are you sure you want to delete the language <span className="font-bold text-slate-900">"{languageToDelete?.name}"</span>? This action cannot be undone.
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

export default Language;
