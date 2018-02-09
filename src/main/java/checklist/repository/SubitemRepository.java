package checklist.repository;

import checklist.domain.Subitem;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;

/**
 * Spring Data JPA repository for the Subitem entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SubitemRepository extends JpaRepository<Subitem, Long> {
    @Query("select distinct subitem from Subitem subitem left join fetch subitem.checklists")
    List<Subitem> findAllWithEagerRelationships();

    @Query("select subitem from Subitem subitem left join fetch subitem.checklists where subitem.id =:id")
    Subitem findOneWithEagerRelationships(@Param("id") Long id);

}
