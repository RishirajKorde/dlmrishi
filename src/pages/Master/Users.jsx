import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2,  Eye  } from 'lucide-react';
import Modal from '../../components/Modal';
import { Input, Select, Button } from '../../components/FormComponents';
import api from '../../api/axios';

const Users = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [branches, setBranches] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
const [viewingUser, setViewingUser] = useState(null);
const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        branchId: ''
    });

    useEffect(() => {
        fetchUsers();
        fetchBranches();
    }, []);

    // const fetchUsers = async () => {
    //     try {
    //         const res = await api.get('/api/v1/branch-admin/librarians');

    //         if (res.data?.status === 200) {
    //             let list = res.data.data;
    //             if (list?.content) list = list.content;

    //             setUsers(Array.isArray(list) ? list : []);
    //         }
    //     } catch (err) {
    //         console.error(err);
    //         setUsers([]);
    //     }
    // };


    const fetchUsers = async () => {
    try {
        const res = await api.get('/api/v1/branch-admin/librarians');

        if (res.data?.status === 200) {
            let list = res.data.data;

            if (list?.content) list = list.content;

            const formatted = (list || []).map((u) => ({
                id: u.id || u.librarianId,   // 🔥 FIX HERE
                name: u.name,
                email: u.email,
                mobile: u.mobile,
                branchId: u.branchId || u.branch?.branchId,
                branchName: u.branchName || u.branch?.branchName
            }));

            setUsers(formatted);
        }

    } catch (err) {
        console.error(err);
        setUsers([]);
    }
};
    const fetchBranches = async () => {
        try {
            const res = await api.get('/api/v1/admin/branches');

            if (res.data?.status === 200) {
                setBranches(res.data.data || []);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                mobile: formData.mobile,
                password: formData.password,
                branchId: Number(formData.branchId)
            };

            let res;

            if (editingUser) {
                res = await api.put(`/api/v1/branch-admin/librarians/${editingUser.id}`, payload);
            } else {
                res = await api.post('/api/v1/branch-admin/librarians', payload);
            }

            if (res.data?.status === 200 || res.status === 200) {
                fetchUsers();
                resetForm();
                setIsModalOpen(false);
            }

        } catch (err) {
            console.error(err);
        }
    };

    const handleEditClick = (u) => {
        setEditingUser(u);
        setFormData({
            name: u.name,
            email: u.email,
            mobile: u.mobile,
            password: '',
            branchId: u.branchId || u.branch?.branchId
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this user?")) return;

        try {
            await api.delete(`/api/v1/branch-admin/librarians/${id}`);
            fetchUsers();
        } catch (err) {
            console.error(err);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            mobile: '',
            password: '',
            branchId: ''
        });
        setEditingUser(null);
    };

    return (
        <div className="space-y-6">

            {/* HEADER (same as subject) */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search User..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px]"
                    />
                </div>

                <Button onClick={() => { resetForm(); setIsModalOpen(true); }} className="flex items-center gap-2">
                    <Plus size={18} />
                    <span>Add</span>
                </Button>
            </div>

            {/* TABLE (same style) */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">

                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[9px] uppercase font-bold">Sr No</th>
                                <th className="px-6 py-4 text-[9px] uppercase font-bold">Name</th>
                                <th className="px-6 py-4 text-[9px] uppercase font-bold">Email</th>
                                <th className="px-6 py-4 text-[9px] uppercase font-bold">Mobile</th>
                                <th className="px-6 py-4 text-[9px] uppercase font-bold">Branch</th>
                                <th className="px-6 py-4 text-[9px] uppercase font-bold text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-50">
                            {users.map((u, index) => (
                                <tr key={u.id} className="hover:bg-slate-50/50">

                                    <td className="px-6 py-4 text-[13px]">{index + 1}</td>

                                    <td className="px-6 py-4 text-[13px] font-bold">
                                        {u.name}
                                    </td>

                                    <td className="px-6 py-4 text-[13px]">
                                        {u.email}
                                    </td>

                                    <td className="px-6 py-4 text-[13px]">
                                        {u.mobile}
                                    </td>

                                    <td className="px-6 py-4 text-[13px]">
                                        {u.branchName || u.branch?.branchName || 'N/A'}
                                    </td>

                                    <td className="px-6 py-4 text-right">

                                            {/* 👁️ VIEW */}
    <button
        onClick={() => {
            setViewingUser(u);
            setIsViewModalOpen(true);
        }}
        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition"
    >
        <Eye size={14} />
    </button>

                                        <button
                                            onClick={() => handleEditClick(u)}
                                            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition"
                                        >
                                            <Edit2 size={14} />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(u.id)}
                                            className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            </div>

            {/* MODAL (same style) */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingUser ? "Edit User" : "Add User"}
            >
                <form onSubmit={handleSubmit} className="space-y-6">

                    <Input label="Name" value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })} required />

                    <Input label="Email" value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })} required />

                    <Input label="Mobile" value={formData.mobile}
                        onChange={e => setFormData({ ...formData, mobile: e.target.value })} required />

                    <Input label="Password" type="password"
                        onChange={e => setFormData({ ...formData, password: e.target.value })} />

                    <Select
                        label="Branch"
                        value={formData.branchId}
                        onChange={e => setFormData({ ...formData, branchId: e.target.value })}
                        options={[
                            { label: 'Select Branch', value: '' },
                            ...branches.map(b => ({
                                label: b.branchName,
                                value: b.branchId
                            }))
                        ]}
                        required
                    />

                    <div className="flex gap-3">
                        <Button variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button className="flex-1" type="submit">
                            {editingUser ? "Update" : "Save"}
                        </Button>
                    </div>

                </form>
            </Modal>
<Modal
    isOpen={isViewModalOpen}
    onClose={() => setIsViewModalOpen(false)}
    title="librarians Details"
>
    {viewingUser && (
        <div className="space-y-4 text-[13px]">

            <div>
                <p className="text-slate-400">Name</p>
                <p className="font-bold">{viewingUser.name}</p>
            </div>

            <div>
                <p className="text-slate-400">Email</p>
                <p className="font-bold">{viewingUser.email}</p>
            </div>

            <div>
                <p className="text-slate-400">Mobile</p>
                <p className="font-bold">{viewingUser.mobile}</p>
            </div>

            <div>
                <p className="text-slate-400">Branch</p>
                <p className="font-bold">
                    {viewingUser.branchName || viewingUser.branch?.branchName || 'N/A'}
                </p>
            </div>

        </div>
    )}
</Modal>
        </div>
    );
};

export default Users;