// lấy các phần tử cần thiết
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const addProductBtn = document.getElementById('addProductBtn');
const addProductForm = document.getElementById('addProductForm');
const productItems = document.querySelectorAll('.product-item');

// xử lý sự kiện tìm kiếm khi click nút "Tìm"
searchBtn.addEventListener('click', function() {
    timKiemSanPham();
});

// xử lý sự kiện tìm kiếm khi nhập liệu (keyup)
searchInput.addEventListener('keyup', function() {
    timKiemSanPham();
});

// hàm tìm kiếm sản phẩm
function timKiemSanPham() {
    // lấy giá trị từ ô tìm kiếm và chuyển về chữ thường
    const keyword = searchInput.value.toLowerCase();
    
    // duyệt qua tất cả sản phẩm
    productItems.forEach(function(product) {
        // lấy tên sản phẩm
        const productName = product.querySelector('.product-name').textContent.toLowerCase();
        
        // kiểm tra xem tên có chứa từ khóa không
        if (productName.includes(keyword)) {
            // hiển thị sản phẩm
            product.style.display = '';
        } else {
            // ẩn sản phẩm
            product.style.display = 'none';
        }
    });
}

// xử lý sự kiện nút "Thêm sản phẩm" để ẩn/hiện form
addProductBtn.addEventListener('click', function() {
    // toggle: nếu form đang ẩn thì hiện, nếu đang hiện thì ẩn
    addProductForm.classList.toggle('hidden');
});
