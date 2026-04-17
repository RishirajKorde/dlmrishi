import React, { useState } from 'react';
import { Search, Plus, Mail, Phone, Calendar, Eye, Edit2, Trash2, ShieldCheck, UserCheck } from 'lucide-react';
import Modal from '../../components/Modal';
import { Input, Select, Button } from '../../components/FormComponents';

const Users = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [viewingUser, setViewingUser] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);

    const [users, setUsers] = useState([
        {
            id: "USR-001",
            name: "Admin User",
            email: "admin@gmail.com",
            mobile: "9876543210",
            role: "SUPER_ADMIN",
            branch: "Head Office",
            last_login: "16 Apr 2026",
            status: "Active"
        }
    ]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        role: 'LIBRARIAN',
        branch: '',
        status: 'Active'
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingUser) {
            setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
            setEditingUser(null);
        } else {
            const newUser = {
                ...formData,
                id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
                last_login: "-"
            };
            setUsers([newUser, ...users]);
        }

        resetForm();
        setIsModalOpen(false);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            mobile: '',
            password: '',
            role: 'LIBRARIAN',
            branch: '',
            status: 'Active'
        });
    };

    const handleEditClick = (user) => {
        setEditingUser(user);
        setFormData(user);
        setIsModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        setUsers(users.filter(u => u.id !== userToDelete.id));
        setIsDeleteModalOpen(false);
    };

    return (
        <div className="space-y-6">

            {/* HEADER SAME */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm transition-all duration-300">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Name, User ID..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px]"
                    />
                </div>

                <Button onClick={() => { resetForm(); setIsModalOpen(true); }} className="flex items-center gap-2">
                    <Plus size={18} />
                    <span>Add</span>
                </Button>
            </div>

            {/* TABLE SAME */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[9px] uppercase font-bold">Sr No</th>
                                <th className="px-6 py-4 text-[9px] uppercase font-bold">User Info</th>
                                <th className="px-6 py-4 text-[9px] uppercase font-bold">Role</th>
                                <th className="px-6 py-4 text-[9px] uppercase font-bold">Contact</th>
                                <th className="px-6 py-4 text-[9px] uppercase font-bold">Last Login</th>
                                <th className="px-6 py-4 text-[9px] uppercase font-bold">Status</th>
                                <th className="px-6 py-4 text-[9px] uppercase font-bold text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-50">
                            {users.map((user, index) => (
                                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">

                                    <td className="px-6 py-4 text-[13px]">{index + 1}</td>

                                    {/* SAME MEMBER CARD */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-bold text-[11px] border">
                                                {user.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-[13px]">{user.name}</p>
                                                <p className="text-[9px] text-blue-600 font-mono uppercase">{user.id}</p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="text-[13px] font-bold">{user.role}</span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-2 text-[11px]">
                                                <Mail size={12} />
                                                {user.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-[11px]">
                                                <Phone size={12} />
                                                {user.mobile}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-[13px]">
                                        {user.last_login}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${user.status === 'Active'
                                            ? 'bg-green-100 text-green-600'
                                            : 'bg-yellow-100 text-yellow-600'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100">

                                            <button onClick={() => setViewingUser(user)}>
                                                <Eye size={14} />
                                            </button>

                                            <button onClick={() => handleEditClick(user)}>
                                                <Edit2 size={14} />
                                            </button>

                                            <button onClick={() => { setUserToDelete(user); setIsDeleteModalOpen(true); }}>
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

            {/* FORM SAME STYLE */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register User">
                <form onSubmit={handleSubmit} className="space-y-6">

                    <Input label="Full Name" value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })} required />

                    <Input label="Email" value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })} required />

                    <Input label="Mobile" value={formData.mobile}
                        onChange={e => setFormData({ ...formData, mobile: e.target.value })} required />

                    <Input label="Password" type="password"
                        onChange={e => setFormData({ ...formData, password: e.target.value })} />

                    {/* ROLE DROPDOWN */}
                    <Select
                        label="Role"
                        value={formData.role}
                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                        options={[
                            { label: 'SUPER_ADMIN', value: 'SUPER_ADMIN' },
                            { label: 'LIB_ADMIN', value: 'LIB_ADMIN' },
                            { label: 'LIBRARIAN', value: 'LIBRARIAN' }
                        ]}
                    />

                    <Input label="Branch" value={formData.branch}
                        onChange={e => setFormData({ ...formData, branch: e.target.value })} />

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
                        <Button variant="secondary" className="flex-1">Cancel</Button>
                        <Button className="flex-1" type="submit">Save</Button>
                    </div>

                </form>
            </Modal>

        </div>
    );
};

export default Users;