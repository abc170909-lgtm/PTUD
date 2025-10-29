const db = require('../config/database');

class XinPhepNghiHoc {
  static async getHocSinhByPhuHuynh(maPhuHuynh) {
    try {
      const [rows] = await db.execute(
        `SELECT hs.MaHocSinh, hs.TenHocSinh, l.TenLop
         FROM HocSinh hs
         JOIN Lop l ON hs.MaLop = l.MaLop
         JOIN PhuHuynh ph ON ph.MaHocSinh = hs.MaHocSinh
         WHERE ph.Email = ? OR ph.SDT = ?`,
        [maPhuHuynh, maPhuHuynh]
      );
      return rows;
    } catch (error) {
      console.error('Error in getHocSinhByPhuHuynh:', error);
      throw error;
    }
  }

  static async createPhieuXinPhep(data) {
    try {
      const maPhieu = await this.generateMaPhieu();

      await db.execute(
        `INSERT INTO PhieuXinPhep (MaPhieu, LyDoNghi, Ngay, MaHocSinh)
         VALUES (?, ?, ?, ?)`,
        [maPhieu, data.lyDoNghi, data.ngay, data.maHocSinh]
      );

      return { maPhieu, success: true };
    } catch (error) {
      console.error('Error in createPhieuXinPhep:', error);
      throw error;
    }
  }

  static async generateMaPhieu() {
    try {
      const [rows] = await db.execute(
        `SELECT MaPhieu FROM PhieuXinPhep ORDER BY MaPhieu DESC LIMIT 1`
      );

      if (rows.length === 0) {
        return 'PX001';
      }

      const lastMa = rows[0].MaPhieu;
      const number = parseInt(lastMa.substring(2)) + 1;
      return 'PX' + number.toString().padStart(3, '0');
    } catch (error) {
      console.error('Error in generateMaPhieu:', error);
      throw error;
    }
  }

  static async getPhieuXinPhepByHocSinh(maHocSinh) {
    try {
      const [rows] = await db.execute(
        `SELECT pxp.*, hs.TenHocSinh, l.TenLop
         FROM PhieuXinPhep pxp
         JOIN HocSinh hs ON pxp.MaHocSinh = hs.MaHocSinh
         JOIN Lop l ON hs.MaLop = l.MaLop
         WHERE pxp.MaHocSinh = ?
         ORDER BY pxp.Ngay DESC`,
        [maHocSinh]
      );
      return rows;
    } catch (error) {
      console.error('Error in getPhieuXinPhepByHocSinh:', error);
      throw error;
    }
  }

  static async getAllPhieuXinPhep() {
    try {
      const [rows] = await db.execute(
        `SELECT pxp.*, hs.TenHocSinh, l.TenLop
         FROM PhieuXinPhep pxp
         JOIN HocSinh hs ON pxp.MaHocSinh = hs.MaHocSinh
         JOIN Lop l ON hs.MaLop = l.MaLop
         ORDER BY pxp.Ngay DESC`
      );
      return rows;
    } catch (error) {
      console.error('Error in getAllPhieuXinPhep:', error);
      throw error;
    }
  }
}

module.exports = XinPhepNghiHoc;
