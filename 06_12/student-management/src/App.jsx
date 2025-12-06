import axios from 'axios';
import { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Search, ArrowUpDown, Trash2, Edit3, 
  GraduationCap, Calendar, Hash, X, Check, AlertCircle, BookOpen 
} from 'lucide-react';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [stuClass, setStuClass] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // UI State
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  
  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editClass, setEditClass] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch Data
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    setLoading(true);
    axios.get('http://localhost:5000/api/students')
      .then(response => {
        setStudents(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Fetch error:", error);
        setError("Không thể kết nối đến server");
        setLoading(false);
      });
  };

  // Filter & Sort
  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    return sortAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  });

  // Actions
  const handleAddStudent = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const newStu = { name, age: Number(age), class: stuClass };

    axios.post('http://localhost:5000/api/students', newStu)
      .then(res => {
        setStudents(prev => [...prev, res.data]);
        setName(""); setAge(""); setStuClass("");
        showToast(`🎉 Đã thêm "${res.data.name}" thành công!`);
      })
      .catch(err => alert("Lỗi: " + err.message))
      .finally(() => setIsSubmitting(false));
  };

  const handleUpdateStudent = (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const updatedData = { name: editName, age: Number(editAge), class: editClass };

    axios.put(`http://localhost:5000/api/students/${editingStudent._id}`, updatedData)
      .then(res => {
        setStudents(prev => prev.map(s => s._id === editingStudent._id ? res.data : s));
        closeEditModal();
        showToast(`✨ Đã cập nhật thông tin thành công!`);
      })
      .catch(err => alert("Lỗi: " + err.message))
      .finally(() => setIsUpdating(false));
  };

  const handleDelete = (id, studentName) => {
    if (!window.confirm(`Bạn có chắc muốn xóa học sinh "${studentName}"?`)) return;
    
    axios.delete(`http://localhost:5000/api/students/${id}`)
      .then(() => {
        setStudents(prev => prev.filter(s => s._id !== id));
        showToast(`🗑️ Đã xóa học sinh thành công!`);
      })
      .catch(err => alert("Lỗi: " + err.message));
  };

  // Helper Functions
  const showToast = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setEditName(student.name);
    setEditAge(student.age);
    setEditClass(student.class);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingStudent(null);
  };

  return (
    <div className="container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <div className="logo-icon">
            <BookOpen size={24} color="#2D334A" />
          </div>
          <span>EduManager</span>
        </div>
        <div>
          <button className="btn-primary" style={{backgroundColor: '#845EC2', color: 'white'}}>
            <Users size={18} />
            {students.length} Students
          </button>
        </div>
      </nav>

      {/* Stats Section */}
      <div className="stats-bar">
        <div className="stat-card mint">
          <span className="stat-number">{students.length}</span>
          <span className="stat-label">Tổng Học Sinh</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {students.length > 0 ? Math.round(students.reduce((acc, curr) => acc + curr.age, 0) / students.length) : 0}
          </span>
          <span className="stat-label">Tuổi Trung Bình</span>
        </div>
        <div className="stat-card" style={{backgroundColor: '#FF9F1C'}}>
          <span className="stat-number">{new Set(students.map(s => s.class)).size}</span>
          <span className="stat-label">Lớp Học</span>
        </div>
      </div>

      <div className="main-content">
        {/* Left Column: Add Form */}
        <aside className="form-card clay-card">
          <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px'}}>
            <div className="btn-icon" style={{backgroundColor: '#4ade80'}}>
              <UserPlus size={20} />
            </div>
            <h2 style={{fontWeight: 800, fontSize: '1.25rem'}}>Thêm Học Sinh</h2>
          </div>
          
          <form onSubmit={handleAddStudent}>
            <div className="form-group">
              <label className="form-label">Họ và Tên</label>
              <input
                className="clay-input"
                type="text"
                placeholder="Ví dụ: Nguyễn Văn A"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tuổi</label>
              <input
                className="clay-input"
                type="number"
                placeholder="Nhập tuổi"
                value={age}
                onChange={e => setAge(e.target.value)}
                min="1"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Lớp</label>
              <input
                className="clay-input"
                type="text"
                placeholder="Ví dụ: 12A1"
                value={stuClass}
                onChange={e => setStuClass(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn-primary" 
              style={{width: '100%'}}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang xử lý...' : 'Thêm Mới Ngay'}
            </button>
          </form>
        </aside>

        {/* Right Column: List */}
        <section className="student-list-card clay-card">
          <div className="tools-bar">
            <div className="search-wrapper">
              <Search className="search-icon-absolute" size={20} />
              <input
                className="clay-input search-input"
                type="text"
                placeholder="Tìm kiếm học sinh..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              className="btn-primary" 
              style={{backgroundColor: '#FF9F1C', color: 'black'}}
              onClick={() => setSortAsc(!sortAsc)}
            >
              <ArrowUpDown size={18} />
              {sortAsc ? 'A-Z' : 'Z-A'}
            </button>
          </div>

          {loading ? (
            <div className="empty-state">
              <div className="empty-icon">⏳</div>
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : error ? (
            <div className="empty-state">
              <div className="empty-icon">⚠️</div>
              <p>{error}</p>
            </div>
          ) : sortedStudents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>Không tìm thấy học sinh nào!</p>
            </div>
          ) : (
            <div className="student-grid">
              {sortedStudents.map((student) => (
                <div key={student._id} className="student-card">
                  <div style={{display: 'flex', gap: '15px'}}>
                    <div className="student-avatar">
                      <GraduationCap size={32} />
                    </div>
                    <div className="student-info">
                      <h3>{student.name}</h3>
                      <div className="student-detail">
                        <Calendar size={14} />
                        <span>{student.age} tuổi</span>
                      </div>
                      <div className="student-detail">
                        <Hash size={14} />
                        <span>Lớp: {student.class}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card-actions">
                    <button 
                      className="btn-primary btn-card-action"
                      style={{backgroundColor: '#e2e8f0', color: '#2D334A'}}
                      onClick={() => openEditModal(student)}
                    >
                      <Edit3 size={16} /> Sửa
                    </button>
                    <button 
                      className="btn-primary btn-card-action btn-danger"
                      onClick={() => handleDelete(student._id, student.name)}
                    >
                      <Trash2 size={16} /> Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Toast Notification */}
      {successMessage && (
        <div className="toast">
          <Check size={24} color="#00C9A7" />
          {successMessage}
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{fontSize: '1.5rem', fontWeight: 800}}>Chỉnh Sửa</h3>
              <button className="btn-icon" onClick={closeEditModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateStudent}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Họ và Tên</label>
                  <input
                    className="clay-input"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tuổi</label>
                  <input
                    className="clay-input"
                    type="number"
                    value={editAge}
                    onChange={e => setEditAge(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Lớp</label>
                  <input
                    className="clay-input"
                    value={editClass}
                    onChange={e => setEditClass(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-primary" 
                  style={{backgroundColor: '#e2e8f0', color: '#2D334A'}}
                  onClick={closeEditModal}
                >
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  {isUpdating ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
