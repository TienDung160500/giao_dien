package com.mycompany.myapp.web.rest.request;




public class ChiTietSanXuatRequest {
    private Long idChiTietSanXuat;

    private Long idSanXuatHangNgay;

    private String maKichBan;

    private Integer rows;

    private String thongSo;

    private Float minValue;

    private Float maxValue;

    private Float trungBinh;

    private String donVi;

    public ChiTietSanXuatRequest() {
    }

    public Long getIdChiTietSanXuat() {
        return idChiTietSanXuat;
    }

    public void setIdChiTietSanXuat(Long idChiTietSanXuat) {
        this.idChiTietSanXuat = idChiTietSanXuat;
    }

    public Long getIdSanXuatHangNgay() {
        return idSanXuatHangNgay;
    }

    public void setIdSanXuatHangNgay(Long idSanXuatHangNgay) {
        this.idSanXuatHangNgay = idSanXuatHangNgay;
    }

    public String getMaKichBan() {
        return maKichBan;
    }

    public void setMaKichBan(String maKichBan) {
        this.maKichBan = maKichBan;
    }

    public Integer getRows() {
        return rows;
    }

    public void setRows(Integer rows) {
        this.rows = rows;
    }

    public String getThongSo() {
        return thongSo;
    }

    public void setThongSo(String thongSo) {
        this.thongSo = thongSo;
    }

    public Float getMinValue() {
        return minValue;
    }

    public void setMinValue(Float minValue) {
        this.minValue = minValue;
    }

    public Float getMaxValue() {
        return maxValue;
    }

    public void setMaxValue(Float maxValue) {
        this.maxValue = maxValue;
    }

    public Float getTrungBinh() {
        return trungBinh;
    }

    public void setTrungBinh(Float trungBinh) {
        this.trungBinh = trungBinh;
    }

    public String getDonVi() {
        return donVi;
    }

    public void setDonVi(String donVi) {
        this.donVi = donVi;
    }
}
