import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit2, Trash2 } from 'lucide-react';
import Modal from '../../components/Modal';
import { Input, Select, Button } from '../../components/FormComponents';
import api from '../../api/axios';

const Branch = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [viewingBranch, setViewingBranch] = useState(null);
    const [editingBranch, setEditingBranch] = useState(null);
    const [branchToDelete, setBranchToDelete] = useState(null);

    const [branches, setBranches] = useState([]);

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
        try {
            const res = await api.get('/api/v1/admin/branches');

            if (res.data?.status === 200) {
                const formattedData = res.data.data.map((b) => ({
                    id: b.branchId,
                    name: b.branchName,
                    address: b.address,
                    city: b.address?.split(',')[1]?.trim() || '',
                    pincode: '',
                    contact_number: '',
                    status: b.active ? 'Active' : 'Inactive'
                }));

                setBranches(formattedData);
            }
        } catch (error) {
            console.error('Error fetching branches:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingBranch) {
            setBranches(branches.map(b =>
                b.id === editingBranch.id ? { ...b, ...formData } : b
            ));
            setEditingBranch(null);
        } else {
            setBranches([{ ...formData, id: Date.now() }, ...branches]);
        }

        resetForm();
        setIsModalOpen(false);
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
    };

    const handleEditClick = (b) => {
        setEditingBranch(b);
        setFormData(b);
        setIsModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        setBranches(branches.filter(b => b.id !== branchToDelete.id));
        setIsDeleteModalOpen(false);
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

                <Button onClick={() => { resetForm(); setIsModalOpen(true); }} className="flex items-center gap-2">
                    <Plus size={18} />
                    <span>Add</span>
                </Button>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[9px] uppercase font-bold">Sr No</th>
                                <th className="px-6 py-4 text-[9px] uppercase font-bold">Branch Info</th>
                                <th className="px-6 py-4 text-[9px] uppercase font-bold">City</th>
                                <th className="px-6 py-4 text-[9px] uppercase font-bold">Contact</th>
                                <th className="px-6 py-4 text-[9px] uppercase font-bold">Pincode</th>
                                <th className="px-6 py-4 text-[9px] uppercase font-bold">Status</th>
                                <th className="px-6 py-4 text-[9px] uppercase font-bold text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-50">
                            {branches.map((b, index) => (
                                <tr key={b.id} className="hover:bg-slate-50/50 group">

                                    <td className="px-6 py-4 text-[13px]">{index + 1}</td>

                                    <td className="px-6 py-4">
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

                                    <td className="px-6 py-4 text-[13px]">{b.city}</td>
                                    <td className="px-6 py-4 text-[13px]">{b.contact_number}</td>
                                    <td className="px-6 py-4 text-[13px]">{b.pincode}</td>

                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${b.status === 'Active'
                                                ? 'text-emerald-600 bg-emerald-50'
                                                : 'text-amber-600 bg-amber-50'
                                            }`}>
                                            {b.status}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100">

                                            <button onClick={() => setViewingBranch(b)}>
                                                <Eye size={14} />
                                            </button>

                                            <button onClick={() => handleEditClick(b)}>
                                                <Edit2 size={14} />
                                            </button>

                                            <button onClick={() => {
                                                setBranchToDelete(b);
                                                setIsDeleteModalOpen(true);
                                            }}>
                                                <Trash2 size={14} />
                                            </button>

                                        </div>
                                    </td>

                                </tr>
                            ))}
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

        </div>
    );
};

export default Branch;