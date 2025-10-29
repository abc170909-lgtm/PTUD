document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('leave-request-form');
  const resetBtn = document.getElementById('reset-form');
  const filterHocSinh = document.getElementById('filter-hocsinh');
  const toast = document.getElementById('toast');

  function showToast(message, type) {
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.style.display = 'block';

    setTimeout(() => {
      toast.style.display = 'none';
    }, 3000);
  }

  function validateForm() {
    let isValid = true;
    const maHocSinh = document.getElementById('maHocSinh');
    const ngay = document.getElementById('ngay');
    const lyDoNghi = document.getElementById('lyDoNghi');

    document.querySelectorAll('.error-message').forEach(el => {
      el.classList.remove('show');
    });

    if (!maHocSinh.value) {
      document.getElementById('error-maHocSinh').textContent = 'Vui lòng chọn con';
      document.getElementById('error-maHocSinh').classList.add('show');
      isValid = false;
    }

    if (!ngay.value) {
      document.getElementById('error-ngay').textContent = 'Vui lòng chọn ngày nghỉ';
      document.getElementById('error-ngay').classList.add('show');
      isValid = false;
    }

    if (!lyDoNghi.value.trim()) {
      document.getElementById('error-lyDoNghi').textContent = 'Vui lòng điền lý do xin phép';
      document.getElementById('error-lyDoNghi').classList.add('show');
      isValid = false;
    }

    return isValid;
  }

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = {
      maHocSinh: document.getElementById('maHocSinh').value,
      ngay: document.getElementById('ngay').value,
      lyDoNghi: document.getElementById('lyDoNghi').value.trim()
    };

    try {
      const response = await fetch('/api/xinphepnghihoc/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        showToast(result.message, 'success');
        form.reset();

        if (filterHocSinh.value) {
          loadHistory(filterHocSinh.value);
        }
      } else {
        showToast(result.message, 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('Lỗi hệ thống khi lưu đơn. Đã tự động lưu nháp.', 'error');
    }
  });

  resetBtn.addEventListener('click', function() {
    form.reset();
    document.querySelectorAll('.error-message').forEach(el => {
      el.classList.remove('show');
    });
  });

  filterHocSinh.addEventListener('change', function() {
    const maHocSinh = this.value;
    if (maHocSinh) {
      loadHistory(maHocSinh);
    } else {
      document.getElementById('history-list').innerHTML = '<p class="no-data">Chọn con để xem lịch sử xin nghỉ</p>';
    }
  });

  async function loadHistory(maHocSinh) {
    try {
      const response = await fetch(`/api/xinphepnghihoc/history?maHocSinh=${maHocSinh}`);
      const result = await response.json();

      const historyList = document.getElementById('history-list');

      if (result.success && result.data.length > 0) {
        historyList.innerHTML = result.data.map(item => {
          const date = new Date(item.Ngay);
          const formattedDate = date.toLocaleDateString('vi-VN');

          return `
            <div class="history-item">
              <div class="history-item-header">
                <span class="history-item-date">Ngày nghỉ: ${formattedDate}</span>
                <span class="history-item-student">${item.TenHocSinh} - Lớp ${item.TenLop}</span>
              </div>
              <div class="history-item-reason">
                <strong>Lý do:</strong> ${item.LyDoNghi}
              </div>
            </div>
          `;
        }).join('');
      } else {
        historyList.innerHTML = '<p class="no-data">Chưa có đơn xin nghỉ nào</p>';
      }
    } catch (error) {
      console.error('Error loading history:', error);
      showToast('Lỗi khi tải lịch sử', 'error');
    }
  }

  const today = new Date().toISOString().split('T')[0];
  document.getElementById('ngay').setAttribute('min', today);
});
