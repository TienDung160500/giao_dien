package com.mycompany.myapp.web.rest.response;



public class ChiTietSanXuatResponse {
    private Integer id;

    private Integer idSanXuatHangNgay;

    private String maKichBan;

    private Integer rows;

    private String thongSo;

    private Float minValue;

    private Float maxValue;

    private Float trungBinh;

    private String donVi;

    public ChiTietSanXuatResponse() {
    }

    public ChiTietSanXuatResponse(Integer id, Integer idSanXuatHangNgay, String maKichBan, Integer rows, String thongSo, Float minValue, Float maxValue, Float trungBinh, String donVi) {
        this.id = id;
        this.idSanXuatHangNgay = idSanXuatHangNgay;
        this.maKichBan = maKichBan;
        this.rows = rows;
        this.thongSo = thongSo;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.trungBinh = trungBinh;
        this.donVi = donVi;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getIdSanXuatHangNgay() {
        return idSanXuatHangNgay;
    }

    public void setIdSanXuatHangNgay(Integer idSanXuatHangNgay) {
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
