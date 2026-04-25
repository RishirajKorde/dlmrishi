import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit2, Trash2Icon } from 'lucide-react';
import Modal from '../../components/Modal';
import { Input, Select, Button } from '../../components/FormComponents';
import TableSkeleton from '../../components/TableSkeleton';
import api from '../../api/axios';
import { toast } from 'react-toastify';

const Branch = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [viewingBranch, setViewingBranch] = useState(null);
    const [editingBranch, setEditingBranch] = useState(null);
    const [branchToDelete, setBranchToDelete] = useState(null);

    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        pincode: '',
        contact_number: '',
        status: 'Active'
    });

    // ✅ FETCH API
    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/v1/admin/branches');

            if (res.data?.status === 200) {
                const formattedData = res.data.data.map((b) => ({
                    id: b.branchId,
                    name: b.branchName,
                    address: b.address,
                    city: b.city || '',
                    pincode: b.pinCode || '',
                    contact_number: b.contactNo || '',
                    status: b.active ? 'Active' : 'Inactive'
                }));

                setBranches(formattedData);
            }
        } catch (error) {
            console.error('Error fetching branches:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                branchName: formData.name,
                address: formData.address,
                city: formData.city,
                pinCode: formData.pincode,
                contactNo: formData.contact_number,
                active: formData.status === 'Active'
            };

            if (editingBranch) {
                await api.put(`/api/v1/admin/branches/${editingBranch.id}`, payload);
                toast.success('Branch updated successfully!');
            } else {
                await api.post('/api/v1/admin/branches', payload);
                toast.success('Branch added successfully!');
            }

            fetchBranches();
            resetForm();
            setIsModalOpen(false);
        } catch (error) {
            toast.error(editingBranch ? 'Failed to update branch.' : 'Failed to add branch.');
            console.error('Error saving branch:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            address: '',
            city: '',
            pincode: '',
            contact_number: '',
            status: 'Active'
        });
        setEditingBranch(null);
    };

    const handleEditClick = (b) => {
        setEditingBranch(b);
        setFormData(b);
        setIsModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await api.delete(`/api/v1/admin/branches/${branchToDelete.id}`);
            toast.success('Branch deleted successfully!');
            fetchBranches();
            setIsDeleteModalOpen(false);
        } catch (error) {
            toast.error('Failed to delete branch.');
            console.error('Error deleting branch:', error);
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const res = await api.patch(`/api/v1/admin/branches/${id}/toggle-status`);
            if (res.data?.status === 200 || res.status === 200) {
                toast.success('Status updated successfully!');
                fetchBranches();
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
                        placeholder="Search Branch..."
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
                    <table className="w-full min-w-[1000px] text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[9px] uppercase font-bold whitespace-nowrap">Sr No</th>
                                <th className="px-6 py-4 text-[9px] uppercase font-bold whitespace-nowrap">Branch Info</th>
                                <th className="px-6 py-4 text-[9px] uppercase font-bold whitespace-nowrap">City</th>
                                <th className="px-6 py-4 text-[9px] uppercase font-bold whitespace-nowrap">Contact</th>
                                <th className="px-6 py-4 text-[9px] uppercase font-bold whitespace-nowrap">Pincode</th>
                                <th className="px-6 py-4 text-[9px] uppercase font-bold whitespace-nowrap">Status</th>
                                <th className="px-6 py-4 text-[9px] uppercase font-bold text-center whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <TableSkeleton rows={5} columns={7} />
                            ) : (
                                branches.map((b, index) => (
                                    <tr key={b.id} className="hover:bg-slate-50/50 group">

                                        <td className="px-6 py-4 text-[13px] whitespace-nowrap">{index + 1}</td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-bold text-[11px] border">
                                                    {b.name?.[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 text-[13px]">{b.name}</p>
                                                    <p className="text-[9px] text-blue-600 font-mono">{b.address}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-[13px] whitespace-nowrap">{b.city}</td>
                                        <td className="px-6 py-4 text-[13px] whitespace-nowrap">{b.contact_number}</td>
                                        <td className="px-6 py-4 text-[13px] whitespace-nowrap">{b.pincode}</td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                {/* Simple Toggle Design */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleStatus(b.id)}
                                                    className={`w-9 h-5 flex items-center rounded-full p-1 transition-colors ${b.status === 'Active' ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
                                                        }`}
                                                >
                                                    <div className="w-3.5 h-3.5 bg-white rounded-full shadow-sm" />
                                                </button>

                                                <span className={`text-[11px] font-semibold ${b.status === 'Active' ? 'text-emerald-600' : 'text-slate-500'}`}>
                                                    {b.status}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <div className="flex justify-end gap-1.5">
                                                <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition" onClick={() => setViewingBranch(b)}>
                                                    <Eye size={14} />
                                                </button>

                                                <button className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition" onClick={() => handleEditClick(b)}>
                                                    <Edit2 size={14} />
                                                </button>

                                                <button className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition" onClick={() => {
                                                    setBranchToDelete(b);
                                                    setIsDeleteModalOpen(true);
                                                }}>
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

            {/* FORM MODAL */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Branch Form">
                <form onSubmit={handleSubmit} className="space-y-6">

                    <Input label="Branch Name" value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })} required />

                    <Input label="Address" value={formData.address}
                        onChange={e => setFormData({ ...formData, address: e.target.value })} />

                    <Input label="City" value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })} />

                    <Input label="Pincode" value={formData.pincode}
                        onChange={e => setFormData({ ...formData, pincode: e.target.value })} />

                    <Input label="Contact Number" value={formData.contact_number}
                        onChange={e => setFormData({ ...formData, contact_number: e.target.value })} />

                    <Select label="Status" value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                        options={[
                            { label: 'Active', value: 'Active' },
                            { label: 'Inactive', value: 'Inactive' }
                        ]}
                    />

                    <div className="flex gap-3">
                        <Button variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button className="flex-1" type="submit">Save</Button>
                    </div>

                </form>
            </Modal>

            {/* VIEW MODAL */}
            <Modal isOpen={!!viewingBranch} onClose={() => setViewingBranch(null)} title="Branch Details">
                {viewingBranch && (
                    <div className="space-y-4 text-[13px]">
                        <div>
                            <p className="text-slate-400">Branch Name</p>
                            <p className="font-bold">{viewingBranch.name}</p>
                        </div>
                        <div>
                            <p className="text-slate-400">Address</p>
                            <p className="font-bold">{viewingBranch.address}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-slate-400">City</p>
                                <p className="font-bold">{viewingBranch.city || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-slate-400">Pincode</p>
                                <p className="font-bold">{viewingBranch.pincode || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-slate-400">Contact Number</p>
                                <p className="font-bold">{viewingBranch.contact_number || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-slate-400">Status</p>
                                <p className="font-bold">{viewingBranch.status}</p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* DELETE CONFIRMATION MODAL */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Delete">
                <div className="space-y-6">
                    <p className="text-[13px] text-slate-600">
                        Are you sure you want to delete the branch <span className="font-bold">{branchToDelete?.name}</span>? This action cannot be undone.
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

export default Branch;