import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit2, Trash2 } from 'lucide-react';
import Modal from '../../components/Modal';
import { Input, Select, Button } from '../../components/FormComponents';
import TableSkeleton from '../../components/TableSkeleton';
import api from '../../api/axios';
import { toast } from 'react-toastify';

const MembershipType = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [viewingType, setViewingType] = useState(null);
    const [editingType, setEditingType] = useState(null);
    const [typeToDelete, setTypeToDelete] = useState(null);

    const [membershipTypes, setMembershipTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        borrowLimit: '',
        validityMonths: '',
        finePerDay: '',
        status: 'Active'
    });

    // ✅ FETCH API
    useEffect(() => {
        fetchMembershipTypes();
    }, []);

    const fetchMembershipTypes = async (showSkeleton = true) => {
        if (showSkeleton) setLoading(true);
        try {
            const res = await api.get('/api/v1/admin/membership-type');
            if (res.data?.status === 200) {
                const formattedData = res.data.data.map((t) => ({
                    id: t.id,
                    name: t.name,
                    borrowLimit: t.borrowLimit,
                    validityMonths: t.validityMonths,
                    finePerDay: t.finePerDay,
                    status: t.isActive ? 'Active' : 'Inactive'
                }));
                setMembershipTypes(formattedData);
            }
        } catch (error) {
            console.error('Error fetching membership types:', error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ POST & PUT MEMBERSHIP TYPE
    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            name: formData.name,
            borrowLimit: parseInt(formData.borrowLimit),
            validityMonths: parseInt(formData.validityMonths),
            finePerDay: parseFloat(formData.finePerDay)
        };

        try {
            let res;
            if (editingType) {
                res = await api.put(`/api/v1/admin/membership-type/${editingType.id}`, payload);
            } else {
                res = await api.post('/api/v1/admin/membership-type', payload);
            }

            if (res.data?.status === 200 || res.status === 200) {
                toast.success(editingType ? 'Membership type updated successfully!' : 'Membership type added successfully!');
                fetchMembershipTypes();
                resetForm();
                setIsModalOpen(false);
            }
        } catch (error) {
            toast.error(editingType ? 'Failed to update membership type.' : 'Failed to add membership type.');
            console.error("Error saving membership type:", error);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            borrowLimit: '',
            validityMonths: '',
            finePerDay: '',
            status: 'Active'
        });
        setEditingType(null);
    };

    const handleEditClick = (t) => {
        setEditingType(t);
        setFormData({
            name: t.name,
            borrowLimit: t.borrowLimit,
            validityMonths: t.validityMonths,
            finePerDay: t.finePerDay,
            status: t.status
        });
        setIsModalOpen(true);
    };

    const handleDeleteClick = (t) => {
        setTypeToDelete(t);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            const res = await api.delete(`/api/v1/admin/membership-type/${typeToDelete.id}`);
            if (res.data?.status === 200 || res.status === 200) {
                toast.success('Membership type deleted successfully!');
                fetchMembershipTypes();
                setIsDeleteModalOpen(false);
                setTypeToDelete(null);
            }
        } catch (error) {
            toast.error('Failed to delete membership type.');
            console.error("Error deleting membership type:", error);
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            // Using the toggle-status pattern as seen in Conversation 41438b5a
            const res = await api.patch(`/api/v1/admin/membership-type/${id}/toggle`, {});
            if (res.data?.status === 200 || res.status === 200) {
                toast.success('Status updated successfully!');
                fetchMembershipTypes(false);
            }
        } catch (error) {
            toast.error('Failed to update status.');
            console.error("Error toggling status:", error);
        }
    };

    const filteredTypes = membershipTypes.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search Membership Type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
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
                    <table className="w-full min-w-[800px] text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[9px] uppercase font-bold">Sr No</th>
                                <th className="px-6 py-4 text-[9px] uppercase font-bold">Type Name</th>
                                <th className="px-6 py-4 text-[9px] uppercase font-bold text-center">Borrow Limit</th>
                                <th className="px-6 py-4 text-[9px] uppercase font-bold text-center">Validity (Months)</th>
                                <th className="px-6 py-4 text-[9px] uppercase font-bold text-center">Fine/Day</th>
                                <th className="px-6 py-4 text-[9px] uppercase font-bold text-center">Status</th>
                                <th className="px-6 py-4 text-[9px] uppercase font-bold text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <TableSkeleton rows={5} columns={7} />
                            ) : (
                                filteredTypes.map((t, index) => (
                                    <tr key={t.id} className="hover:bg-slate-50/50 group">
                                        <td className="px-6 py-4 text-[13px]">{index + 1}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-bold text-[11px] border">
                                                    {t.name?.[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 text-[13px]">{t.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-[13px] text-center font-medium">{t.borrowLimit}</td>
                                        <td className="px-6 py-4 text-[13px] text-center font-medium">{t.validityMonths}</td>
                                        <td className="px-6 py-4 text-[13px] text-center font-medium">₹{t.finePerDay}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleStatus(t.id)}
                                                    className={`w-9 h-5 flex items-center rounded-full p-1 transition-colors ${t.status === 'Active' ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
                                                        }`}
                                                >
                                                    <div className="w-3.5 h-3.5 bg-white rounded-full shadow-sm" />
                                                </button>
                                                <span className={`text-[11px] font-semibold min-w-[50px] ${t.status === 'Active' ? 'text-emerald-600' : 'text-slate-500'}`}>
                                                    {t.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button onClick={() => setViewingType(t)}
                                                    className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition">
                                                    <Eye size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleEditClick(t)}
                                                    className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(t)}
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
            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={editingType ? "Edit Membership Type" : "Add Membership Type"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Type Name"
                        placeholder="e.g. PREMIUM, STUDENT"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Borrow Limit"
                            type="number"
                            placeholder="e.g. 5"
                            value={formData.borrowLimit}
                            onChange={e => setFormData({ ...formData, borrowLimit: e.target.value })}
                            required
                        />
                        <Input
                            label="Validity (Months)"
                            type="number"
                            placeholder="e.g. 12"
                            value={formData.validityMonths}
                            onChange={e => setFormData({ ...formData, validityMonths: e.target.value })}
                            required
                        />
                    </div>

                    <Input
                        label="Fine Per Day (₹)"
                        type="number"
                        step="0.01"
                        placeholder="e.g. 2"
                        value={formData.finePerDay}
                        onChange={e => setFormData({ ...formData, finePerDay: e.target.value })}
                        required
                    />

                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="secondary" className="flex-1" onClick={() => { setIsModalOpen(false); resetForm(); }}>
                            Cancel
                        </Button>
                        <Button className="flex-1" type="submit">{editingType ? "Update" : "Save"}</Button>
                    </div>
                </form>
            </Modal>

            {/* DELETE CONFIRMATION MODAL */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Delete">
                <div className="space-y-4">
                    <p className="text-slate-600 text-[14px]">Are you sure you want to delete the membership type <span className="font-bold text-slate-900">"{typeToDelete?.name}"</span>? This action cannot be undone.</p>
                    <div className="flex gap-3">
                        <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsDeleteModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={handleDeleteConfirm}>
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* VIEW MODAL */}
            <Modal isOpen={!!viewingType} onClose={() => setViewingType(null)} title="Membership Type Details">
                {viewingType && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Type Name</p>
                                <p className="text-slate-900 font-medium">{viewingType.name}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Status</p>
                                <p className={`font-medium ${viewingType.status === 'Active' ? 'text-emerald-600' : 'text-slate-500'}`}>{viewingType.status}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Borrow Limit</p>
                                <p className="text-slate-900 font-medium">{viewingType.borrowLimit} Books</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Validity</p>
                                <p className="text-slate-900 font-medium">{viewingType.validityMonths} Months</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Fine Per Day</p>
                                <p className="text-slate-900 font-medium">₹{viewingType.finePerDay}</p>
                            </div>
                        </div>
                        <div className="pt-4">
                            <Button className="w-full" onClick={() => setViewingType(null)}>Close</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default MembershipType;
