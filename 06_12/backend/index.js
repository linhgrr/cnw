const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Student = require('./Student');

// Khởi tạo ứng dụng Express
const app = express();

// Định nghĩa cổng chạy server
const PORT = process.env.PORT || 5000;

// Middleware
// Cho phép frontend truy cập API (Cross-Origin Resource Sharing)
app.use(cors());

// Parse JSON request body
app.use(express.json());

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/student_db')
    .then(() => console.log("Đã kết nối MongoDB thành công"))
    .catch(err => console.error("Lỗi kết nối MongoDB:", err));

// Route kiểm tra server hoạt động
app.get('/', (req, res) => {
    res.json({ 
        message: 'Server đang chạy!',
        status: 'OK'
    });
});

// API GET danh sách học sinh
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API POST thêm học sinh mới
app.post('/api/students', async (req, res) => {
    try {
        const newStudent = await Student.create(req.body);
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// API PUT cập nhật học sinh theo ID
app.put('/api/students/:id', async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedStudent) {
            return res.status(404).json({ error: "Student not found" });
        }
        res.json(updatedStudent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// API DELETE xóa học sinh theo ID
app.delete('/api/students/:id', async (req, res) => {
    try {
        const deleted = await Student.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: "Student not found" });
        }
        res.json({ message: "Đã xóa học sinh", id: deleted._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
