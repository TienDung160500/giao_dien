package com.mycompany.myapp.web.rest.response;



public class ChiTietKichBanResponse {
    private Integer id;

    private Integer idKichBan;

    private String maKichBan;

    private Integer rows;

    private String thongSo;

    private Float minValue;

    private Float maxValue;

    private Float trungBinh;

    private String donVi;

    private String phanLoai;

    public ChiTietKichBanResponse() {
    }

    public ChiTietKichBanResponse(Integer id, Integer idKichBan, String maKichBan, Integer rows, String thongSo, Float minValue, Float maxValue, Float trungBinh, String donVi, String phanLoai) {
        this.id = id;
        this.idKichBan = idKichBan;
        this.maKichBan = maKichBan;
        this.rows = rows;
        this.thongSo = thongSo;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.trungBinh = trungBinh;
        this.donVi = donVi;
        this.phanLoai = phanLoai;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getIdKichBan() {
        return idKichBan;
    }

    public void setIdKichBan(Integer idKichBan) {
        this.idKichBan = idKichBan;
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

    public String getPhanLoai() {
        return phanLoai;
    }

    public void setPhanLoai(String phanLoai) {
        this.phanLoai = phanLoai;
    }
}
