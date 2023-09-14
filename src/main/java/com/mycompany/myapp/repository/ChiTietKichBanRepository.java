package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ChiTietKichBan;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data SQL repository for the ChiTietKichBan entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChiTietKichBanRepository extends JpaRepository<ChiTietKichBan, Long> {
    //☺Xem danh sach thong so kich ban
    public List<ChiTietKichBan> findAllByMaKichBan(String maKichBan);
    @Modifying
    @Query(value = "update chi_tiet_kich_ban ChiTietKichBan set kich_ban_id = ?1 where ma_kich_ban = ?2",
        nativeQuery = true)
    public void updateIdKichBan (Long id, String maThietBi);
}
