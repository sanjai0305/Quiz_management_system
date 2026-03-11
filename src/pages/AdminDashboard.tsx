import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../App';
import { User, Quiz, Attempt } from '../types';
import { Users, BookOpen, Trophy, Plus, Save, Trash2, AlertCircle, Accessibility, User as UserIcon, Pencil, Eye, ShieldCheck, Camera, X, Upload, ChevronRight, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'students' | 'quizzes' | 'leaderboard'>('students');
  const { token, user } = useAuth();

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tighter uppercase">ADMIN {user?.name}</h2>
          <p className="text-sm font-medium uppercase tracking-widest opacity-50">System Management & Oversight</p>
        </div>
        
        <div className="flex bg-white border-2 border-[#141414] p-1 rounded-xl shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
          <TabButton active={activeTab === 'students'} onClick={() => setActiveTab('students')} icon={<Users size={18} />} label="Students" />
          <TabButton active={activeTab === 'quizzes'} onClick={() => setActiveTab('quizzes')} icon={<BookOpen size={18} />} label="Quizzes" />
          <TabButton active={activeTab === 'leaderboard'} onClick={() => setActiveTab('leaderboard')} icon={<Trophy size={18} />} label="Leaderboard" />
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === 'students' && <div key="students"><StudentManager token={token!} /></div>}
        {activeTab === 'quizzes' && <div key="quizzes"><QuizManager token={token!} /></div>}
        {activeTab === 'leaderboard' && <div key="leaderboard"><LeaderboardView token={token!} /></div>}
      </AnimatePresence>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${active ? 'bg-[#141414] text-white' : 'text-[#141414]/50 hover:text-[#141414]'}`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

// --- Student Manager ---
function StudentManager({ token }: { token: string }) {
  const [students, setStudents] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    const res = await fetch('/api/students', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setStudents(data);
    setLoading(false);
  };

  const handleDeleteStudent = async (id: number) => {
    const res = await fetch(`/api/students/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      fetchStudents();
      setStudentToDelete(null);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.registration_number?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white border-2 border-[#141414] p-6 rounded-3xl shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
              <ShieldCheck size={20} />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-widest">OS Security</h4>
          </div>
          <p className="text-[10px] font-medium opacity-50 uppercase mb-2">Status: Protected</p>
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full w-[98%]" />
          </div>
        </div>
        <div className="bg-white border-2 border-[#141414] p-6 rounded-3xl shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <Camera size={20} />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-widest">Camera Facilities</h4>
          </div>
          <p className="text-[10px] font-medium opacity-50 uppercase mb-2">Active Nodes: 12/12</p>
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-full" />
          </div>
        </div>
        <div className="bg-white border-2 border-[#141414] p-6 rounded-3xl shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
              <Accessibility size={20} />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-widest">Priority Access</h4>
          </div>
          <p className="text-[10px] font-medium opacity-50 uppercase mb-2">Mode: Stage-Wise Enabled</p>
          <div className="flex gap-1">
            <div className="h-1.5 flex-1 bg-amber-500 rounded-full" />
            <div className="h-1.5 flex-1 bg-amber-500 rounded-full" />
            <div className="h-1.5 flex-1 bg-amber-500 rounded-full" />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold uppercase tracking-tight">Student Registry</h3>
          <p className="text-[10px] font-bold uppercase opacity-40">Manage enrolled student accounts and biometrics</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-[#141414] text-white px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-[#2a2a2a] transition-all shadow-brutal-sm"
        >
          <Plus size={16} /> Enroll Student
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search by name or registration number..."
          className="w-full p-4 pl-12 bg-white border-2 border-[#141414] rounded-2xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Users className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={20} />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-[#141414] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-[#141414]/10 p-12 rounded-[2.5rem] text-center">
          <p className="text-sm font-bold uppercase opacity-30">No students found in the registry</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map(student => (
            <motion.div 
              layout
              key={student.id} 
              className="bg-white border-2 border-[#141414] p-6 rounded-[2rem] shadow-brutal-sm hover:shadow-brutal transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl overflow-hidden border-2 border-[#141414]/5 flex items-center justify-center">
                  {student.profile_picture ? (
                    <img src={student.profile_picture} alt={student.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <UserIcon size={24} />
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedStudent(student)}
                      className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="View Profile"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      onClick={() => setStudentToDelete(student.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Student"
                    >
                      <Trash2 size={16} />
                    </button>
                    {student.department && (
                      <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md text-[10px] font-bold uppercase border border-emerald-100">
                        {student.department}
                      </span>
                    )}
                    {student.priority_type && student.priority_type !== 'general' && (
                      <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded-md text-[10px] font-bold uppercase border border-amber-100 flex items-center gap-1">
                        <Accessibility size={10} />
                        {student.priority_type}
                      </span>
                    )}
                  </div>
                  <span className="bg-gray-50 text-gray-500 px-2 py-1 rounded-md text-[10px] font-bold uppercase border border-gray-100">
                    ID: {student.id}
                  </span>
                </div>
              </div>
              
              <h4 className="font-bold text-lg leading-tight mb-1">{student.name}</h4>
              <p className="text-xs font-mono font-bold text-indigo-600 mb-4">{student.registration_number}</p>
              
              <div className="space-y-3 pt-4 border-t border-[#141414]/5">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                  <span className="opacity-40">Date of Birth</span>
                  <span>{student.date_of_birth}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                  <span className="opacity-40">Mobile</span>
                  <span>{student.mobile}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showAdd && <AddStudentModal onClose={() => setShowAdd(false)} onAdded={fetchStudents} token={token} />}
      {selectedStudent && <StudentProfileModal student={selectedStudent} onClose={() => setSelectedStudent(null)} token={token} />}
      
      <AnimatePresence>
        {studentToDelete && (
          <div className="fixed inset-0 bg-[#141414]/80 backdrop-blur-sm flex items-center justify-center p-4 z-[200]">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white border-2 border-[#141414] w-full max-w-sm rounded-3xl p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
                <AlertCircle size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold uppercase tracking-tight">Confirm Deletion</h3>
                <p className="text-xs opacity-50 leading-relaxed font-medium">Are you sure you want to delete this student registration? This will also delete all their quiz attempts. This action cannot be undone.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setStudentToDelete(null)} className="py-3 bg-gray-100 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-all">Cancel</button>
                <button onClick={() => handleDeleteStudent(studentToDelete)} className="py-3 bg-red-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-600 transition-all">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function StudentProfileModal({ student, onClose, token }: { student: User, onClose: () => void, token: string }) {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/student/${student.id}/results`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      setResults(data);
      setLoading(false);
    });
  }, [student.id, token]);

  return (
    <div className="fixed inset-0 bg-[#141414]/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white border-2 border-[#141414] w-full max-w-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-[#141414]/10 flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 text-white rounded-lg overflow-hidden flex items-center justify-center">
              {student.profile_picture ? (
                <img src={student.profile_picture} alt={student.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <UserIcon size={20} />
              )}
            </div>
            <h3 className="text-xl font-bold uppercase tracking-tight">Student Profile</h3>
          </div>
          <button onClick={onClose} className="text-sm font-bold opacity-50 hover:opacity-100">CLOSE</button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40">Personal Information</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-bold uppercase opacity-30">Full Name</p>
                  <p className="font-bold text-lg">{student.name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase opacity-30">Registration Number</p>
                  <p className="font-mono font-bold text-indigo-600">{student.registration_number}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase opacity-30">Date of Birth</p>
                  <p className="font-bold">{student.date_of_birth}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase opacity-30">Priority Category</p>
                  <p className="font-bold uppercase text-amber-600">{student.priority_type || 'General'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase opacity-30">Current Academic Stage</p>
                  <p className="font-black text-2xl text-indigo-600">STAGE {student.current_stage || 1}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40">Security & OS Status</h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-emerald-600" size={20} />
                    <span className="text-xs font-bold uppercase">OS Security</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">Verified</span>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Camera className="text-blue-600" size={20} />
                    <span className="text-xs font-bold uppercase">Camera Facility</span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase">Active</span>
                </div>
                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock className="text-indigo-600" size={20} />
                    <span className="text-xs font-bold uppercase">Browser Lock</span>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase">Enabled</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40">Academic Status</h4>
              <div className="bg-indigo-50 p-6 rounded-2xl border-2 border-indigo-100">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={16} className="text-indigo-600" />
                  <p className="text-[10px] font-bold uppercase text-indigo-600">Department</p>
                </div>
                <p className="font-black text-2xl text-indigo-900 uppercase">{student.department}</p>
                <p className="text-[10px] font-medium text-indigo-600/60 mt-2 leading-relaxed">
                  Enrolled in the {student.department} department for the current academic session.
                </p>
              </div>
              {student.priority_type && student.priority_type !== 'general' && (
                <div className="bg-emerald-50 p-4 rounded-2xl border-2 border-emerald-100 flex items-center gap-3">
                  <div className="bg-emerald-600 text-white p-2 rounded-lg">
                    <Accessibility size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-emerald-600">Priority Status</p>
                    <p className="font-bold text-emerald-900 uppercase">{student.priority_type}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40">Academic Performance</h4>
              <span className="text-[10px] font-bold uppercase bg-gray-100 px-2 py-1 rounded">{results.length} Attempts</span>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : results.length === 0 ? (
              <div className="bg-gray-50 border-2 border-dashed border-gray-200 p-8 rounded-2xl text-center">
                <p className="text-[10px] font-bold uppercase opacity-30">No quiz attempts recorded for this student</p>
              </div>
            ) : (
              <div className="space-y-3">
                {results.map((res, i) => (
                  <div key={i} className="bg-white border-2 border-[#141414] p-4 rounded-xl flex items-center justify-between shadow-[4px_4px_0px_0px_rgba(20,20,20,0.05)]">
                    <div>
                      <h5 className="font-bold text-sm">{res.title}</h5>
                      <p className="text-[10px] opacity-50 uppercase tracking-widest">{new Date(res.attempt_date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-lg">{res.score}<span className="text-[10px] opacity-30">/{res.total_questions}</span></p>
                      <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500" 
                          style={{ width: `${(res.score / res.total_questions) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function AddStudentModal({ onClose, onAdded, token }: { onClose: () => void, onAdded: () => void, token: string }) {
  const [formData, setFormData] = useState({
    name: '',
    registration_number: '',
    date_of_birth: '',
    mobile: '',
    department: '',
    profile_picture: '',
    priority_type: 'general',
    current_stage: 1
  });
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profile_picture: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      onAdded();
      onClose();
    } else {
      const data = await res.json();
      setError(data.error);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#141414]/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white border-2 border-[#141414] w-full max-w-md rounded-3xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-[#141414]/10 flex justify-between items-center">
          <h3 className="text-xl font-bold uppercase tracking-tight">New Student Enrollment</h3>
          <button onClick={onClose} className="text-sm font-bold opacity-50 hover:opacity-100">CLOSE</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          <div className="flex flex-col items-center gap-4 mb-2">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 bg-gray-50 border-2 border-dashed border-[#141414]/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-all overflow-hidden relative group"
            >
              {formData.profile_picture ? (
                <>
                  <img src={formData.profile_picture} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Pencil size={20} className="text-white" />
                  </div>
                </>
              ) : (
                <>
                  <Plus size={24} className="opacity-20 mb-1" />
                  <span className="text-[8px] font-bold uppercase opacity-30">Add Photo</span>
                </>
              )}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Full Name</label>
              <input required className="w-full p-3 border-2 border-[#141414] rounded-xl font-medium" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Reg Number</label>
              <input required className="w-full p-3 border-2 border-[#141414] rounded-xl font-medium" value={formData.registration_number} onChange={e => setFormData({...formData, registration_number: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Date of Birth</label>
              <input type="date" required className="w-full p-3 border-2 border-[#141414] rounded-xl font-medium" value={formData.date_of_birth} onChange={e => setFormData({...formData, date_of_birth: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Mobile Number</label>
              <input required className="w-full p-3 border-2 border-[#141414] rounded-xl font-medium" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Department</label>
              <input required className="w-full p-3 border-2 border-[#141414] rounded-xl font-medium" placeholder="e.g. Computer Science" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Priority Category</label>
              <select 
                className="w-full p-3 border-2 border-[#141414] rounded-xl font-medium bg-white"
                value={formData.priority_type}
                onChange={e => setFormData({...formData, priority_type: e.target.value as any})}
              >
                <option value="general">General</option>
                <option value="children">Children (Under 18)</option>
                <option value="disability">Person with Disability</option>
                <option value="senior">Senior Citizen</option>
                <option value="special_needs">Special Needs</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Academic Stage</label>
              <select 
                className="w-full p-3 border-2 border-[#141414] rounded-xl font-medium bg-white"
                value={formData.current_stage}
                onChange={e => setFormData({...formData, current_stage: parseInt(e.target.value)})}
              >
                <option value={1}>Stage 1 (Beginner)</option>
                <option value={2}>Stage 2 (Intermediate)</option>
                <option value={3}>Stage 3 (Advanced)</option>
              </select>
            </div>
          </div>

          {error && <p className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}

          <button type="submit" className="w-full bg-[#141414] text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-[#2a2a2a] transition-all">Complete Enrollment</button>
        </form>
      </motion.div>
    </div>
  );
}

// --- Quiz Manager ---
function QuizManager({ token }: { token: string }) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editingQuizId, setEditingQuizId] = useState<number | null>(null);

  const fetchQuizzes = async () => {
    const res = await fetch('/api/quizzes', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setQuizzes(data);
  };

  useEffect(() => { fetchQuizzes(); }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold uppercase tracking-tight">Curriculum & Quizzes</h3>
        <button onClick={() => setShowAdd(true)} className="bg-[#141414] text-white px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-[#2a2a2a] transition-all">
          <Plus size={16} /> Create Quiz
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quizzes.map(quiz => (
          <div key={quiz.id} className="bg-white border-2 border-[#141414] p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] flex justify-between items-center group">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                  quiz.stage === 1 ? 'bg-blue-50 text-blue-600 border-blue-100' :
                  quiz.stage === 2 ? 'bg-orange-50 text-orange-600 border-orange-100' :
                  'bg-red-50 text-red-600 border-red-100'
                }`}>
                  Stage {quiz.stage}
                </span>
                <p className="text-[10px] font-bold uppercase opacity-40">{quiz.subject}</p>
              </div>
              <h4 className="font-bold text-lg">{quiz.title}</h4>
              <p className="text-xs opacity-50">{quiz.time_limit} Minutes • Multiple Choice</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setEditingQuizId(quiz.id)}
                className="p-3 bg-gray-50 text-[#141414] rounded-xl border border-[#141414]/10 hover:bg-[#141414] hover:text-white transition-all opacity-0 group-hover:opacity-100"
                title="Edit Quiz"
              >
                <Pencil size={18} />
              </button>
              <div className="bg-gray-50 p-4 rounded-xl border border-[#141414]/5">
                <BookOpen size={24} className="opacity-20" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAdd && <QuizModal onClose={() => setShowAdd(false)} onAdded={fetchQuizzes} token={token} />}
      {editingQuizId && <QuizModal quizId={editingQuizId} onClose={() => setEditingQuizId(null)} onAdded={fetchQuizzes} token={token} />}
    </motion.div>
  );
}

function QuizModal({ onClose, onAdded, token, quizId }: { onClose: () => void, onAdded: () => void, token: string, quizId?: number }) {
  const [quizData, setQuizData] = useState({
    title: '',
    subject: '',
    time_limit: 10,
    stage: 1,
    questions: [{ text: '', a: '', b: '', c: '', d: '', correct: 'a' }]
  });
  const [showBulk, setShowBulk] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [isLoading, setIsLoading] = useState(!!quizId);

  useEffect(() => {
    if (quizId) {
      fetch(`/api/quizzes/${quizId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        setQuizData({
          title: data.title,
          subject: data.subject,
          time_limit: data.time_limit,
          stage: data.stage,
          questions: data.questions.map((q: any) => ({
            text: q.question_text,
            a: q.option_a,
            b: q.option_b,
            c: q.option_c,
            d: q.option_d,
            correct: q.correct_answer
          }))
        });
        setIsLoading(false);
      });
    }
  }, [quizId, token]);

  const addQuestion = () => {
    setQuizData({ ...quizData, questions: [...quizData.questions, { text: '', a: '', b: '', c: '', d: '', correct: 'a' }] });
  };

  const addMultipleQuestions = (count: number) => {
    const newQs = Array(count).fill(null).map(() => ({ text: '', a: '', b: '', c: '', d: '', correct: 'a' }));
    setQuizData({ ...quizData, questions: [...quizData.questions, ...newQs] });
  };

  const handleBulkImport = () => {
    const lines = bulkText.split('\n').filter(l => l.trim());
    const newQs = lines.map(line => {
      const [text, a, b, c, d, correct] = line.split('|').map(s => s.trim());
      return { 
        text: text || '', 
        a: a || '', 
        b: b || '', 
        c: c || '', 
        d: d || '', 
        correct: (correct || 'a').toLowerCase() 
      };
    });
    if (newQs.length > 0) {
      setQuizData({ ...quizData, questions: [...quizData.questions, ...newQs] });
      setShowBulk(false);
      setBulkText('');
    }
  };

  const removeQuestion = (index: number) => {
    if (quizData.questions.length > 1) {
      const newQuestions = quizData.questions.filter((_, i) => i !== index);
      setQuizData({ ...quizData, questions: newQuestions });
    }
  };

  const duplicateQuestion = (index: number) => {
    const questionToDuplicate = { ...quizData.questions[index] };
    const newQuestions = [...quizData.questions];
    newQuestions.splice(index + 1, 0, questionToDuplicate);
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const updateQuestion = (index: number, field: string, value: string) => {
    const newQuestions = [...quizData.questions];
    (newQuestions[index] as any)[field] = value;
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = quizId ? `/api/quizzes/${quizId}` : '/api/quizzes';
    const method = quizId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(quizData)
    });
    if (res.ok) {
      onAdded();
      onClose();
    }
  };

  if (isLoading) return null;

  return (
    <div className="fixed inset-0 bg-[#141414]/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white border-2 border-[#141414] w-full max-w-4xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-[#141414]/10 flex justify-between items-center">
          <h3 className="text-xl font-bold uppercase tracking-tight">{quizId ? 'Edit Quiz' : 'Quiz Architect'}</h3>
          <button onClick={onClose} className="text-sm font-bold opacity-50 hover:opacity-100">CLOSE</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Quiz Title</label>
              <input required className="w-full p-3 border-2 border-[#141414] rounded-xl font-medium" value={quizData.title} onChange={e => setQuizData({...quizData, title: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Subject</label>
              <input required className="w-full p-3 border-2 border-[#141414] rounded-xl font-medium" value={quizData.subject} onChange={e => setQuizData({...quizData, subject: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Time (Min)</label>
              <input type="number" required className="w-full p-3 border-2 border-[#141414] rounded-xl font-medium" value={quizData.time_limit} onChange={e => setQuizData({...quizData, time_limit: parseInt(e.target.value)})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Stage (Difficulty)</label>
              <select className="w-full p-3 border-2 border-[#141414] rounded-xl font-medium" value={quizData.stage} onChange={e => setQuizData({...quizData, stage: parseInt(e.target.value)})}>
                <option value={1}>Stage 1: Beginner</option>
                <option value={2}>Stage 2: Intermediate</option>
                <option value={3}>Stage 3: Advanced</option>
              </select>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold uppercase tracking-widest opacity-50">Questions ({quizData.questions.length})</h4>
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => setShowBulk(!showBulk)} className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 hover:underline">Bulk Import</button>
                <button type="button" onClick={() => addMultipleQuestions(5)} className="text-[10px] font-bold uppercase tracking-widest opacity-50 hover:opacity-100">+ Add 5 Questions</button>
                <button type="button" onClick={addQuestion} className="text-xs font-bold uppercase tracking-widest text-indigo-600 hover:underline">+ Add Question</button>
              </div>
            </div>

            {showBulk && (
              <div className="p-6 bg-indigo-50 border-2 border-indigo-100 rounded-2xl space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">Bulk Import Format</label>
                  <p className="text-[10px] opacity-50">Question | Option A | Option B | Option C | Option D | Correct (A/B/C/D)</p>
                  <textarea 
                    className="w-full p-3 border-2 border-indigo-200 rounded-xl font-mono text-xs" 
                    rows={5} 
                    placeholder="What is 2+2? | 3 | 4 | 5 | 6 | B"
                    value={bulkText}
                    onChange={e => setBulkText(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowBulk(false)} className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest opacity-50">Cancel</button>
                  <button type="button" onClick={handleBulkImport} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest">Import Questions</button>
                </div>
              </div>
            )}

            {quizData.questions.map((q, i) => (
              <div key={i} className="p-6 bg-gray-50 border-2 border-[#141414]/10 rounded-2xl space-y-4 relative group">
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    type="button" 
                    onClick={() => duplicateQuestion(i)}
                    className="p-2 bg-white border border-[#141414]/10 rounded-lg text-indigo-600 hover:bg-indigo-50"
                    title="Duplicate Question"
                  >
                    <Plus size={14} />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => removeQuestion(i)}
                    className="p-2 bg-white border border-[#141414]/10 rounded-lg text-red-500 hover:bg-red-50"
                    title="Remove Question"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Question {i + 1}</label>
                  <textarea required className="w-full p-3 border-2 border-[#141414] rounded-xl font-medium" value={q.text} onChange={e => updateQuestion(i, 'text', e.target.value)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['a', 'b', 'c', 'd'].map(opt => (
                    <div key={opt} className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Option {opt.toUpperCase()}</label>
                      <input required className="w-full p-3 border-2 border-[#141414] rounded-xl font-medium" value={(q as any)[opt]} onChange={e => updateQuestion(i, opt, e.target.value)} />
                    </div>
                  ))}
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Correct Answer</label>
                  <select className="w-full p-3 border-2 border-[#141414] rounded-xl font-medium" value={q.correct} onChange={e => updateQuestion(i, 'correct', e.target.value)}>
                    <option value="a">Option A</option>
                    <option value="b">Option B</option>
                    <option value="c">Option C</option>
                    <option value="d">Option D</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          <button type="submit" className="w-full bg-[#141414] text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-[#2a2a2a] transition-all">
            {quizId ? 'Save Changes' : 'Publish Quiz'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// --- Leaderboard View ---
function LeaderboardView({ token }: { token: string }) {
  const [data, setData] = useState<Attempt[]>([]);

  useEffect(() => {
    fetch('/api/leaderboard', {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()).then(setData);
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white border-2 border-[#141414] rounded-3xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(20,20,20,1)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-[#141414]">
              <th className="p-6 text-[10px] font-bold uppercase tracking-widest opacity-50">Rank</th>
              <th className="p-6 text-[10px] font-bold uppercase tracking-widest opacity-50">Student</th>
              <th className="p-6 text-[10px] font-bold uppercase tracking-widest opacity-50">Quiz</th>
              <th className="p-6 text-[10px] font-bold uppercase tracking-widest opacity-50">Score</th>
              <th className="p-6 text-[10px] font-bold uppercase tracking-widest opacity-50">Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-b border-[#141414]/5 hover:bg-gray-50 transition-colors">
                <td className="p-6">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    i === 0 ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                    i === 1 ? 'bg-gray-100 text-gray-700 border border-gray-200' :
                    i === 2 ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                    'text-gray-400'
                  }`}>
                    {i + 1}
                  </span>
                </td>
                <td className="p-6">
                  <p className="font-bold">{row.name}</p>
                  <p className="text-[10px] font-mono opacity-50">{row.registration_number}</p>
                </td>
                <td className="p-6 font-medium">{row.quiz_name}</td>
                <td className="p-6">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-lg">{row.score}</span>
                    <span className="text-[10px] opacity-30">/ {row.total_questions}</span>
                  </div>
                </td>
                <td className="p-6 text-xs opacity-50">{new Date(row.attempt_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
