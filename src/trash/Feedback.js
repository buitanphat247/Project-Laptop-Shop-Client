import React, { useState } from 'react';

const PRODUCT = {
  name: 'Evernote',
  logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Evernote_2018_Logo.svg',
  score: 7.5,
  rating: 4.8,
  ratingCount: 120,
};

const CRITERIA = [
  { label: 'Design', key: 'design' },
  { label: 'Features', key: 'features' },
  { label: 'Performance', key: 'performance' },
  { label: 'Practicality', key: 'practicality' },
  { label: 'Value', key: 'value' },
];

const TABS = [
  'News',
  'Resources',
  'Courses',
  'Trainers',
  'Reviews',
];

// Sinh nhiều dữ liệu giả cho từng tab
function randomName() {
  const first = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ'];
  const last = ['An', 'Bình', 'Châu', 'Dũng', 'Hà', 'Hải', 'Hạnh', 'Hòa', 'Hùng', 'Khánh', 'Lan', 'Linh', 'Minh', 'Nam', 'Phương', 'Quang', 'Sơn', 'Thảo', 'Trang', 'Tuấn'];
  return first[Math.floor(Math.random()*first.length)] + ' ' + last[Math.floor(Math.random()*last.length)];
}
function randomComment() {
  const arr = [
    'Sản phẩm rất tốt, tôi hài lòng.',
    'Dịch vụ hỗ trợ nhanh, nhiệt tình.',
    'Giao diện đẹp, dễ sử dụng.',
    'Tính năng đa dạng, đáp ứng nhu cầu.',
    'Hiệu suất ổn định, ít lỗi.',
    'Giá hợp lý, chất lượng tốt.',
    'Sẽ giới thiệu cho bạn bè.',
    'Cần cải thiện thêm về tốc độ.',
    'Tôi thích tính năng đồng bộ.',
    'Đội ngũ hỗ trợ rất chuyên nghiệp.'
  ];
  return arr[Math.floor(Math.random()*arr.length)];
}
function randomCriteria() {
  let obj = {};
  CRITERIA.forEach(c => {
    obj[c.key] = +(Math.random()*2+3).toFixed(1); // 3.0 - 5.0
  });
  return obj;
}
function randomDate() {
  const start = new Date(2022, 0, 1).getTime();
  const end = new Date().getTime();
  return new Date(start + Math.random()*(end-start)).toISOString().slice(0,10);
}
const FAKE_REVIEWS = Array.from({length:120}).map((_,i) => ({
  name: randomName(),
  date: randomDate(),
  rating: Math.floor(Math.random()*3)+3, // 3-5 sao
  criteria: randomCriteria(),
  comment: randomComment(),
}));
const FAKE_NEWS = Array.from({length:80}).map((_,i) => ({
  title: `Tin tức ${i+1}: Cập nhật mới nhất về sản phẩm`,
  date: randomDate(),
  desc: randomComment(),
}));
const FAKE_RESOURCES = Array.from({length:60}).map((_,i) => ({
  title: `Tài liệu hướng dẫn ${i+1}`,
  link: '#',
}));
const FAKE_COURSES = Array.from({length:50}).map((_,i) => ({
  title: `Khóa học ${i+1}: Làm chủ Evernote`,
  author: randomName(),
  date: randomDate(),
}));
const FAKE_TRAINERS = Array.from({length:40}).map((_,i) => ({
  name: randomName(),
  exp: Math.floor(Math.random()*10)+1,
}));

function StarRating({ value, size = 20, onChange }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(star => (
        onChange ? (
          <button key={star} type="button" onClick={() => onChange(star)} className="focus:outline-none">
            <svg width={size} height={size} viewBox="0 0 24 24" fill={star <= value ? '#fbbf24' : 'none'} stroke="#fbbf24" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
          </button>
        ) : (
          <svg key={star} width={size} height={size} viewBox="0 0 24 24" fill={star <= value ? '#fbbf24' : 'none'} stroke="#fbbf24" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
        )
      ))}
    </span>
  );
}

function CriteriaBar({ label, value }) {
  return (
    <div className="flex items-center gap-3 mb-2 w-full">
      <span className="w-32 text-gray-600 text-sm">{label}</span>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-2 bg-yellow-400" style={{ width: `${(value/5)*100}%` }} />
      </div>
      <span className="w-10 text-right text-gray-700 text-sm font-semibold">{value.toFixed(1)}</span>
    </div>
  );
}

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
}

const PAGE_SIZE = 10;

export default function Feedback() {
  const [activeTab, setActiveTab] = useState('Reviews');
  // Reviews tab state
  const [reviews, setReviews] = useState(FAKE_REVIEWS);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('latest');
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ name: '', rating: 0, comment: '', criteria: { design: 5, features: 5, performance: 5, practicality: 5, value: 5 } });
  const [sent, setSent] = useState(false);
  const [page, setPage] = useState(1);

  // Pagination cho từng tab
  const [pageNews, setPageNews] = useState(1);
  const [pageResources, setPageResources] = useState(1);
  const [pageCourses, setPageCourses] = useState(1);
  const [pageTrainers, setPageTrainers] = useState(1);

  // Tính điểm trung bình
  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(2)
    : 0;
  const count = reviews.length;
  const avgCriteria = {};
  CRITERIA.forEach(c => {
    avgCriteria[c.key] = reviews.length
      ? (reviews.reduce((s, r) => s + (r.criteria?.[c.key] || 0), 0) / reviews.length).toFixed(1)
      : 0;
  });

  // Lọc và sắp xếp
  let filtered = reviews.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.comment.toLowerCase().includes(search.toLowerCase())
  );
  if (filter !== 'all') filtered = filtered.filter(r => r.rating === Number(filter));
  if (sort === 'latest') filtered = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  if (sort === 'oldest') filtered = filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  if (sort === 'high') filtered = filtered.sort((a, b) => b.rating - a.rating);
  if (sort === 'low') filtered = filtered.sort((a, b) => a.rating - b.rating);

  // Phân trang cho từng tab
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
  const totalPagesNews = Math.ceil(FAKE_NEWS.length / PAGE_SIZE);
  const pagedNews = FAKE_NEWS.slice((pageNews-1)*PAGE_SIZE, pageNews*PAGE_SIZE);
  const totalPagesResources = Math.ceil(FAKE_RESOURCES.length / PAGE_SIZE);
  const pagedResources = FAKE_RESOURCES.slice((pageResources-1)*PAGE_SIZE, pageResources*PAGE_SIZE);
  const totalPagesCourses = Math.ceil(FAKE_COURSES.length / PAGE_SIZE);
  const pagedCourses = FAKE_COURSES.slice((pageCourses-1)*PAGE_SIZE, pageCourses*PAGE_SIZE);
  const totalPagesTrainers = Math.ceil(FAKE_TRAINERS.length / PAGE_SIZE);
  const pagedTrainers = FAKE_TRAINERS.slice((pageTrainers-1)*PAGE_SIZE, pageTrainers*PAGE_SIZE);

  // Gửi review mới
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleRating = rating => setForm({ ...form, rating });
  const handleCriteria = (key, value) => setForm({ ...form, criteria: { ...form.criteria, [key]: value } });
  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.rating || !form.comment) return;
    setReviews([
      {
        ...form,
        date: new Date().toISOString().slice(0,10),
      },
      ...reviews,
    ]);
    setSent(true);
    setTimeout(() => setSent(false), 2000);
    setForm({ name: '', rating: 0, comment: '', criteria: { design: 5, features: 5, performance: 5, practicality: 5, value: 5 } });
    setPage(1);
  };

  // Nội dung từng tab
  function renderTabContent() {
    if (activeTab === 'Reviews') {
      return (
        <>
          {/* User Reviews Section */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10 px-6">
            <div className="col-span-1 bg-[#f7fafd] rounded-2xl shadow p-8 flex flex-col items-center justify-center w-full">
              <span className="inline-block px-4 py-2 rounded bg-yellow-100 text-yellow-700 font-semibold text-base mb-3">Very Good</span>
              <div className="text-5xl font-extrabold text-gray-800 mb-2">{avg}</div>
              <div className="flex items-center gap-2 mb-2"><StarRating value={Math.round(avg)} size={22} /><span className="text-gray-500 text-lg">out of 5</span></div>
              <div className="text-base text-gray-400">{count} Ratings</div>
            </div>
            <div className="col-span-2 bg-[#f7fafd] rounded-2xl shadow p-8 flex flex-col gap-3 justify-center w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {CRITERIA.map(c => (
                  <CriteriaBar key={c.key} label={c.label} value={Number(avgCriteria[c.key])} />
                ))}
              </div>
            </div>
          </div>
          {/* Form & Filter/Search */}
          <div className="w-full flex flex-col lg:flex-row gap-8 mb-10 px-6 items-start">
            <form onSubmit={handleSubmit} className="flex-1 bg-white rounded-2xl shadow p-8 flex flex-col gap-4 w-full">
              <div className="flex flex-col md:flex-row gap-4">
                <input name="name" value={form.name} onChange={handleChange} required placeholder="Tên của bạn" className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-300 outline-none text-base" />
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 font-medium">Số sao:</span>
                  <StarRating value={form.rating} onChange={handleRating} size={26} />
                </div>
              </div>
              <textarea name="comment" value={form.comment} onChange={handleChange} required placeholder="Nội dung đánh giá..." rows={3} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-300 outline-none text-base" />
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {CRITERIA.map(c => (
                  <div key={c.key} className="flex flex-col items-center">
                    <span className="text-sm text-gray-500 mb-1">{c.label}</span>
                    <input type="number" min={1} max={5} step={0.1} value={form.criteria[c.key]} onChange={e => handleCriteria(c.key, Number(e.target.value))} className="w-16 px-2 py-1 rounded border border-gray-200 text-center text-base" />
                  </div>
                ))}
              </div>
              <button type="submit" className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-lg shadow hover:scale-105 transition-transform">Gửi đánh giá</button>
              {sent && <div className="text-green-600 font-semibold text-center mt-2">Cảm ơn bạn đã gửi đánh giá!</div>}
            </form>
            <div className="flex flex-col gap-3 w-full lg:w-80">
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Tìm kiếm đánh giá..." className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-300 outline-none text-base" />
              <div className="flex gap-3">
                <select value={sort} onChange={e=>setSort(e.target.value)} className="flex-1 px-3 py-2 rounded border border-gray-200 text-base">
                  <option value="latest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                  <option value="high">Sao cao nhất</option>
                  <option value="low">Sao thấp nhất</option>
                </select>
                <select value={filter} onChange={e=>setFilter(e.target.value)} className="flex-1 px-3 py-2 rounded border border-gray-200 text-base">
                  <option value="all">Tất cả</option>
                  {[5,4,3,2,1].map(star=>(<option key={star} value={star}>{star} Sao</option>))}
                </select>
              </div>
            </div>
          </div>
          {/* Danh sách review */}
          <div className="w-full px-6 pb-16">
            {paged.length === 0 && <div className="text-gray-500 text-center py-8">Không có đánh giá nào phù hợp.</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 w-full">
              {paged.map((r, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow p-8 flex gap-5 w-full">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-2xl">
                      {getInitials(r.name)}
                    </div>
                  </div>
                  {/* Nội dung */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-800 text-lg">{r.name}</span>
                      <StarRating value={r.rating} size={22} />
                      <span className="text-gray-400 text-sm ml-2">{new Date(r.date).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="text-gray-700 text-base mb-2">{r.comment}</div>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {CRITERIA.map(c => (
                        <span key={c.key} className="inline-flex items-center gap-1 px-3 py-1 rounded bg-gray-100 text-sm text-gray-600 font-medium">
                          {c.label}: <span className="text-yellow-500 font-bold">{r.criteria?.[c.key] || 0}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button disabled={page===1} onClick={()=>setPage(page-1)} className="px-3 py-2 rounded bg-gray-100 text-gray-600 disabled:opacity-50">Trước</button>
                {Array.from({length: totalPages}).map((_,i)=>(
                  <button key={i} onClick={()=>setPage(i+1)} className={`px-3 py-2 rounded ${page===i+1 ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700'}`}>{i+1}</button>
                ))}
                <button disabled={page===totalPages} onClick={()=>setPage(page+1)} className="px-3 py-2 rounded bg-gray-100 text-gray-600 disabled:opacity-50">Sau</button>
              </div>
            )}
          </div>
        </>
      );
    }
    if (activeTab === 'News') {
      return (
        <div className="w-full px-6 py-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {pagedNews.map((n,i)=>(
            <div key={i} className="bg-white rounded-2xl shadow p-8 flex flex-col gap-2">
              <div className="font-bold text-lg text-indigo-600 mb-1">{n.title}</div>
              <div className="text-gray-400 text-xs mb-2">{new Date(n.date).toLocaleDateString('vi-VN')}</div>
              <div className="text-gray-700 text-base">{n.desc}</div>
            </div>
          ))}
          {/* Pagination */}
          {totalPagesNews > 1 && (
            <div className="col-span-full flex justify-center items-center gap-2 mt-8">
              <button disabled={pageNews===1} onClick={()=>setPageNews(pageNews-1)} className="px-3 py-2 rounded bg-gray-100 text-gray-600 disabled:opacity-50">Trước</button>
              {Array.from({length: totalPagesNews}).map((_,i)=>(
                <button key={i} onClick={()=>setPageNews(i+1)} className={`px-3 py-2 rounded ${pageNews===i+1 ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700'}`}>{i+1}</button>
              ))}
              <button disabled={pageNews===totalPagesNews} onClick={()=>setPageNews(pageNews+1)} className="px-3 py-2 rounded bg-gray-100 text-gray-600 disabled:opacity-50">Sau</button>
            </div>
          )}
        </div>
      );
    }
    if (activeTab === 'Resources') {
      return (
        <div className="w-full px-6 py-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {pagedResources.map((r,i)=>(
            <div key={i} className="bg-white rounded-2xl shadow p-8 flex flex-col gap-2">
              <div className="font-bold text-lg text-indigo-600 mb-1">{r.title}</div>
              <a href={r.link} className="text-blue-500 hover:underline">Xem chi tiết</a>
            </div>
          ))}
          {totalPagesResources > 1 && (
            <div className="col-span-full flex justify-center items-center gap-2 mt-8">
              <button disabled={pageResources===1} onClick={()=>setPageResources(pageResources-1)} className="px-3 py-2 rounded bg-gray-100 text-gray-600 disabled:opacity-50">Trước</button>
              {Array.from({length: totalPagesResources}).map((_,i)=>(
                <button key={i} onClick={()=>setPageResources(i+1)} className={`px-3 py-2 rounded ${pageResources===i+1 ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700'}`}>{i+1}</button>
              ))}
              <button disabled={pageResources===totalPagesResources} onClick={()=>setPageResources(pageResources+1)} className="px-3 py-2 rounded bg-gray-100 text-gray-600 disabled:opacity-50">Sau</button>
            </div>
          )}
        </div>
      );
    }
    if (activeTab === 'Courses') {
      return (
        <div className="w-full px-6 py-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {pagedCourses.map((c,i)=>(
            <div key={i} className="bg-white rounded-2xl shadow p-8 flex flex-col gap-2">
              <div className="font-bold text-lg text-indigo-600 mb-1">{c.title}</div>
              <div className="text-gray-500 text-sm">Tác giả: {c.author}</div>
              <div className="text-gray-400 text-xs">{new Date(c.date).toLocaleDateString('vi-VN')}</div>
            </div>
          ))}
          {totalPagesCourses > 1 && (
            <div className="col-span-full flex justify-center items-center gap-2 mt-8">
              <button disabled={pageCourses===1} onClick={()=>setPageCourses(pageCourses-1)} className="px-3 py-2 rounded bg-gray-100 text-gray-600 disabled:opacity-50">Trước</button>
              {Array.from({length: totalPagesCourses}).map((_,i)=>(
                <button key={i} onClick={()=>setPageCourses(i+1)} className={`px-3 py-2 rounded ${pageCourses===i+1 ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700'}`}>{i+1}</button>
              ))}
              <button disabled={pageCourses===totalPagesCourses} onClick={()=>setPageCourses(pageCourses+1)} className="px-3 py-2 rounded bg-gray-100 text-gray-600 disabled:opacity-50">Sau</button>
            </div>
          )}
        </div>
      );
    }
    if (activeTab === 'Trainers') {
      return (
        <div className="w-full px-6 py-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {pagedTrainers.map((t,i)=>(
            <div key={i} className="bg-white rounded-2xl shadow p-8 flex flex-col gap-2 items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-2xl mb-2">{getInitials(t.name)}</div>
              <div className="font-bold text-lg text-indigo-600 mb-1">{t.name}</div>
              <div className="text-gray-500 text-sm">Kinh nghiệm: {t.exp} năm</div>
            </div>
          ))}
          {totalPagesTrainers > 1 && (
            <div className="col-span-full flex justify-center items-center gap-2 mt-8">
              <button disabled={pageTrainers===1} onClick={()=>setPageTrainers(pageTrainers-1)} className="px-3 py-2 rounded bg-gray-100 text-gray-600 disabled:opacity-50">Trước</button>
              {Array.from({length: totalPagesTrainers}).map((_,i)=>(
                <button key={i} onClick={()=>setPageTrainers(i+1)} className={`px-3 py-2 rounded ${pageTrainers===i+1 ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700'}`}>{i+1}</button>
              ))}
              <button disabled={pageTrainers===totalPagesTrainers} onClick={()=>setPageTrainers(pageTrainers+1)} className="px-3 py-2 rounded bg-gray-100 text-gray-600 disabled:opacity-50">Sau</button>
            </div>
          )}
        </div>
      );
    }
    // Không còn tab View và Alternatives
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-6 px-0 rounded-xl overflow-auto">
      {/* Header sản phẩm */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 px-6 py-6 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-6">
          {/* Đã xóa logo */}
          <div>
            <div className="text-3xl font-extrabold text-gray-800 mb-1">{PRODUCT.name}</div>
            <div className="flex items-center gap-3 text-base text-gray-500">
              <span>Toolfinder Score</span>
              <span className="font-bold text-green-600 text-lg">{PRODUCT.score}/10</span>
              <span className="ml-4">Ratings</span>
              <span className="font-bold text-yellow-500 text-lg">{PRODUCT.rating} <StarRating value={Math.round(PRODUCT.rating)} size={18} /></span>
              <span className="text-xs text-gray-400">({PRODUCT.ratingCount} Ratings)</span>
            </div>
          </div>
        </div>
      </div>
      {/* Tabs điều hướng */}
      <div className="w-full flex items-center gap-2 border-b border-gray-200 mb-8 px-6 overflow-x-auto bg-white">
        {TABS.map(tab => (
          <button key={tab} onClick={()=>{setActiveTab(tab); setPage(1);}} className={`px-6 py-3 rounded-t-lg font-semibold text-base transition-all duration-150 ${activeTab===tab ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-500 shadow' : 'text-gray-500 hover:bg-gray-100'}`}>{tab}</button>
        ))}
        <div className="flex-1" />
      </div>
      {/* Nội dung tab */}
      {renderTabContent()}
    </div>
  );
}