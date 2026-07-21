package com.salonbooking.salonbackend.repository;

import com.salonbooking.salonbackend.entity.User;
import com.salonbooking.salonbackend.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = "DELETE FROM customer WHERE user_id = :id", nativeQuery = true)
    void removeCustomerProfile(@Param("id") Integer id);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = "DELETE FROM staff WHERE user_id = :id", nativeQuery = true)
    void removeStaffProfile(@Param("id") Integer id);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = "INSERT INTO customer (user_id) VALUES (:id)", nativeQuery = true)
    void createCustomerProfile(@Param("id") Integer id);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = "INSERT INTO staff (user_id) VALUES (:id)", nativeQuery = true)
    void createStaffProfile(@Param("id") Integer id);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE User u SET u.role = :role WHERE u.id = :id")
    void updateRole(@Param("id") Integer id, @Param("role") Role role);
}
