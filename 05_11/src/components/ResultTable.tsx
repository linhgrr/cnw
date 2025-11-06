import { useState, useEffect } from 'react'

interface User {
  id: number
  name: string
  username: string
  email: string
  address: {
    street?: string
    suite?: string
    city: string
  }
  phone?: string
  website?: string
}

function ResultTable({ 
  keyword, 
  user, 
  onAdded 
}: { 
  keyword: string
  user: any
  onAdded: () => void 
}) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<User | null>(null)

  // Tải dữ liệu 1 lần khi component mount
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(res => res.json())
      .then(data => { 
        setUsers(data)
        setLoading(false)
      })
  }, [])

  // Khi prop user thay đổi → thêm vào danh sách
  useEffect(() => {
    if (user) {
      setUsers((prev) => [...prev, { ...user, id: prev.length + 1 }])
      onAdded()
    }
  }, [user, onAdded])

  // Lọc danh sách theo keyword
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(keyword.toLowerCase()) ||
      u.username.toLowerCase().includes(keyword.toLowerCase())
  )

  const editUser = (u: User) => {
    setEditing({ ...u, address: { ...u.address } })
  }

  const handleEditChange = (field: string, value: string) => {
    if (!editing) return
    
    if (["street", "suite", "city"].includes(field)) {
      setEditing({ ...editing, address: { ...editing.address, [field]: value } })
    } else {
      setEditing({ ...editing, [field]: value })
    }
  }

  const saveUser = () => {
    if (!editing) return
    setUsers(prev => prev.map(u => u.id === editing.id ? editing : u))
    setEditing(null)
  }

  const removeUser = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }

  if (loading) {
    return <div className="loading">Đang tải...</div>
  }

  return (
    <div>
      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h4>Sửa người dùng</h4>
            <div className="form-group">
              <label htmlFor="edit-name">Name: </label>
              <input 
                id="edit-name" 
                type="text" 
                value={editing.name} 
                onChange={(e) => handleEditChange("name", e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-username">Username: </label>
              <input 
                id="edit-username" 
                type="text" 
                value={editing.username} 
                onChange={(e) => handleEditChange("username", e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-email">Email: </label>
              <input 
                id="edit-email" 
                type="text" 
                value={editing.email} 
                onChange={(e) => handleEditChange("email", e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-street">Street: </label>
              <input 
                id="edit-street" 
                type="text" 
                value={editing.address.street || ""} 
                onChange={(e) => handleEditChange("street", e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-suite">Suite: </label>
              <input 
                id="edit-suite" 
                type="text" 
                value={editing.address.suite || ""} 
                onChange={(e) => handleEditChange("suite", e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-city">City: </label>
              <input 
                id="edit-city" 
                type="text" 
                value={editing.address.city} 
                onChange={(e) => handleEditChange("city", e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-phone">Phone: </label>
              <input 
                id="edit-phone" 
                type="text" 
                value={editing.phone || ""} 
                onChange={(e) => handleEditChange("phone", e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-website">Website: </label>
              <input 
                id="edit-website" 
                type="text" 
                value={editing.website || ""} 
                onChange={(e) => handleEditChange("website", e.target.value)} 
              />
            </div>
            <div className="form-actions">
              <button onClick={saveUser}>Lưu</button>
              <button onClick={() => setEditing(null)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>City</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.address.city}</td>
              <td>
                <button onClick={() => editUser(u)}>Sửa</button>
                <button className="btn-delete" onClick={() => removeUser(u.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ResultTable

