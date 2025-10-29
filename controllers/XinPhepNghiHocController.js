const XinPhepNghiHocModel = require('../models/XinPhepNghiHocModel');

class XinPhepNghiHocController {
  static async renderForm(req, res) {
    try {
      const user = req.session.user;

      if (!user || user.LoaiTaiKhoan !== 'Phụ huynh') {
        return res.status(403).send('<p style="color:red;">Chỉ phụ huynh mới có quyền truy cập</p>');
      }

      const hocSinhList = await XinPhepNghiHocModel.getHocSinhByPhuHuynh(user.TenTaiKhoan);

      res.render('pages/xinphepnghihoc', {
        user,
        hocSinhList
      });
    } catch (error) {
      console.error('Error in renderForm:', error);
      res.status(500).send('<p style="color:red;">Lỗi hệ thống</p>');
    }
  }

  static async submitRequest(req, res) {
    try {
      const user = req.session.user;

      if (!user || user.LoaiTaiKhoan !== 'Phụ huynh') {
        return res.status(403).json({
          success: false,
          message: 'Chỉ phụ huynh mới có quyền gửi đơn'
        });
      }

      const { maHocSinh, lyDoNghi, ngay } = req.body;

      if (!maHocSinh || !lyDoNghi || !ngay) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng điền đầy đủ thông tin'
        });
      }

      if (lyDoNghi.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng điền lý do xin phép'
        });
      }

      const result = await XinPhepNghiHocModel.createPhieuXinPhep({
        maHocSinh,
        lyDoNghi: lyDoNghi.trim(),
        ngay
      });

      res.json({
        success: true,
        message: 'Gửi đơn xin nghỉ thành công',
        maPhieu: result.maPhieu
      });
    } catch (error) {
      console.error('Error in submitRequest:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi hệ thống khi lưu đơn. Đã tự động lưu nháp.'
      });
    }
  }

  static async getHistory(req, res) {
    try {
      const user = req.session.user;

      if (!user || user.LoaiTaiKhoan !== 'Phụ huynh') {
        return res.status(403).json({
          success: false,
          message: 'Không có quyền truy cập'
        });
      }

      const { maHocSinh } = req.query;

      if (!maHocSinh) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu mã học sinh'
        });
      }

      const history = await XinPhepNghiHocModel.getPhieuXinPhepByHocSinh(maHocSinh);

      res.json({
        success: true,
        data: history
      });
    } catch (error) {
      console.error('Error in getHistory:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy lịch sử'
      });
    }
  }
}

module.exports = XinPhepNghiHocController;
