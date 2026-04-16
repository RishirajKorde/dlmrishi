import React from 'react';
import { FileText, Video, Download, ExternalLink, Search, Filter } from 'lucide-react';

const DigitalLibrary = () => {
  const content = [
    { title: "Maharashtra State Library Policy 2024", type: "PDF", category: "Government Docs", size: "2.4 MB", date: "Jan 15, 2024" },
    { title: "Introduction to Library Science", type: "Video", category: "Educational", size: "450 MB", date: "Feb 02, 2024" },
    { title: "History of Nagpur Municipal Corp", type: "PDF", category: "History", size: "12.1 MB", date: "Mar 10, 2024" },
    { title: "Advanced Research Methodology", type: "PDF", category: "Research", size: "1.8 MB", date: "Apr 01, 2024" },
    { title: "Digital Preservation Standards", type: "PDF", category: "Technology", size: "3.5 MB", date: "Dec 20, 2023" },
    { title: "Community Reading Initiatives", type: "Video", category: "Civic", size: "820 MB", date: "Nov 12, 2023" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search eBooks, papers, videos..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
          />
        </div>
        <div className="flex gap-3">
          <select className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 outline-none">
            <option>All Content</option>
            <option>PDF Documents</option>
            <option>Video Lectures</option>
            <option>Research Papers</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {content.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm group hover:shadow-lg hover:border-blue-100 transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-2xl ${item.type === 'PDF' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>
                {item.type === 'PDF' ? <FileText size={32} /> : <Video size={32} />}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded">
                v2.1
              </span>
            </div>

            <div className="space-y-1 mb-6">
              <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{item.title}</h3>
              <p className="text-sm text-slate-500">{item.category} • {item.size}</p>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
              <span className="text-xs text-slate-400 font-medium">{item.date}</span>
              <div className="flex gap-2">
                <button title="Download" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                  <Download size={18} />
                </button>
                <button title="View Online" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                  <ExternalLink size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DigitalLibrary;
