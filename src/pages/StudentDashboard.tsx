import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { Quiz } from '../types';
import { BookOpen, Trophy, Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function StudentDashboard() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const [qRes, rRes] = await Promise.all([
        fetch('/api/quizzes', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/student/results', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      setQuizzes(await qRes.json());
      setResults(await rRes.json());
      setLoading(false);
    };
    fetchData();
  }, [token]);

  const handleStartQuiz = (quiz: Quiz) => {
    navigate(`/quiz/${quiz.id}`);
  };

  return (
    <div className="space-y-12">
      <header className="flex items-center gap-6">
        <div className="w-20 h-20 bg-white border-2 border-[#141414] rounded-3xl overflow-hidden shadow-brutal-sm flex items-center justify-center">
          {user?.profile_picture ? (
            <img src={user.profile_picture} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="bg-indigo-50 text-indigo-600 w-full h-full flex items-center justify-center">
              <BookOpen size={32} />
            </div>
          )}
        </div>
        <div>
          <h2 className="text-4xl font-black tracking-tighter">STUDENT PORTAL</h2>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-sm font-medium uppercase tracking-widest opacity-50">Academic Dashboard • Welcome, {user?.name}</p>
            {user?.priority_type && user.priority_type !== 'general' && (
              <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-amber-200">
                {user.priority_type} Priority
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="text-indigo-600" />
              <h3 className="text-xl font-bold uppercase tracking-tight">Available Assessments</h3>
            </div>
            
            <div className="space-y-12">
              {[1, 2, 3].map(stage => {
                const stageQuizzes = quizzes.filter(q => q.stage === stage);
                if (stageQuizzes.length === 0) return null;
                return (
                  <div key={stage} className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className={`h-px flex-1 ${stage === 1 ? 'bg-blue-200' : stage === 2 ? 'bg-orange-200' : 'bg-red-200'}`} />
                      <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] ${stage === 1 ? 'text-blue-600' : stage === 2 ? 'text-orange-600' : 'text-red-600'}`}>
                        Stage {stage}: {stage === 1 ? 'Beginner' : stage === 2 ? 'Intermediate' : 'Advanced'}
                      </h4>
                      <div className={`h-px flex-1 ${stage === 1 ? 'bg-blue-200' : stage === 2 ? 'bg-orange-200' : 'bg-red-200'}`} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {stageQuizzes.map(quiz => (
                        <motion.div 
                          key={quiz.id} 
                          whileHover={{ y: -5 }}
                          className="bg-white border-2 border-[#141414] p-6 rounded-3xl shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <p className="text-[10px] font-bold uppercase opacity-40">{quiz.subject}</p>
                            </div>
                            <h4 className="font-bold text-xl mb-2">{quiz.title}</h4>
                            <div className="flex items-center gap-4 text-xs opacity-50 mb-6">
                              <div className="flex items-center gap-1"><Clock size={14} /> {quiz.time_limit}m</div>
                              <div className="flex items-center gap-1"><BookOpen size={14} /> MCQs</div>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleStartQuiz(quiz)}
                            className="w-full bg-[#141414] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#2a2a2a] transition-all group"
                          >
                            Initiate Quiz <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="text-yellow-600" />
              <h3 className="text-xl font-bold uppercase tracking-tight">Recent Performance</h3>
            </div>
            
            <div className="space-y-4">
              {results.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-[#141414]/10 p-8 rounded-3xl text-center">
                  <p className="text-xs font-bold uppercase opacity-30">No attempts recorded yet</p>
                </div>
              ) : (
                results.map((res, i) => (
                  <div key={i} className="bg-white border-2 border-[#141414] p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm">{res.title}</h4>
                      <p className="text-[10px] opacity-50 uppercase tracking-widest">{new Date(res.attempt_date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-xl">{res.score}<span className="text-xs opacity-30">/{res.total_questions}</span></p>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase">Completed</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="bg-indigo-600 text-white p-6 rounded-3xl shadow-[8px_8px_0px_0px_rgba(79,70,229,0.3)]">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={20} />
              <h4 className="font-bold uppercase tracking-widest text-xs">Academic Info</h4>
            </div>
            <p className="text-sm font-medium opacity-90 mb-4">
              Department: <span className="font-bold uppercase">{user?.department}</span>
            </p>
            <div className="text-[10px] opacity-70 leading-relaxed">
              Welcome to the {user?.department} portal. All assessments listed here are tailored for your curriculum.
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
