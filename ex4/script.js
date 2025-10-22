// lấy các phần tử cần thiết
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const addProductBtn = document.getElementById('addProductBtn');
const addProductForm = document.getElementById('addProductForm');
let productItems = document.querySelectorAll('.product-item');
const productList = document.getElementById('san-pham');
const cancelBtn = document.getElementById('cancelBtn');
const errorMsg = document.getElementById('errorMsg');

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
    
    // cập nhật lại danh sách sản phẩm để bao gồm cả sản phẩm mới
    productItems = document.querySelectorAll('.product-item');
    
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

// xử lý sự kiện submit của form thêm sản phẩm
addProductForm.addEventListener('submit', function(event) {
    // ngăn form gửi yêu cầu HTTP và reload trang
    event.preventDefault();
    
    // lấy giá trị từ các trường input
    const name = document.getElementById('newName').value.trim();
    const price = document.getElementById('newPrice').value.trim();
    const desc = document.getElementById('newDesc').value.trim();
    
    // xóa thông báo lỗi trước đó
    errorMsg.textContent = '';
    
    // kiểm tra validation
    if (name === '') {
        errorMsg.textContent = 'Vui lòng nhập tên sản phẩm!';
        return;
    }
    
    if (price === '' || isNaN(price) || Number(price) <= 0) {
        errorMsg.textContent = 'Vui lòng nhập giá hợp lệ (số lớn hơn 0)!';
        return;
    }
    
    // tạo phần tử sản phẩm mới
    const newItem = document.createElement('article');
    newItem.className = 'product-item';
    
    // tạo nội dung HTML cho sản phẩm mới
    newItem.innerHTML = `<h3 class="product-name">${name}</h3>
                         <p>${desc}</p>
                         <p>Giá: <span>${price}₫</span></p>`;
    
    // chèn sản phẩm mới vào đầu danh sách
    productList.insertBefore(newItem, productList.children[1]);
    
    // cập nhật lại danh sách sản phẩm
    productItems = document.querySelectorAll('.product-item');
    
    // reset form
    addProductForm.reset();
    
    // ẩn form
    addProductForm.style.display = 'none';
});

// xử lý sự kiện nút "Hủy"
cancelBtn.addEventListener('click', function() {
    // xóa thông báo lỗi
    errorMsg.textContent = '';
    
    // reset form
    addProductForm.reset();
    
    // ẩn form
    addProductForm.style.display = 'none';
});
