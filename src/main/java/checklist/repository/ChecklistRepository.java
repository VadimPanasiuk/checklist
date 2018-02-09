package checklist.repository;

import checklist.domain.Checklist;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;

/**
 * Spring Data JPA repository for the Checklist entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChecklistRepository extends JpaRepository<Checklist, Long> {
    @Query("select distinct checklist from Checklist checklist left join fetch checklist.checklistitems")
    List<Checklist> findAllWithEagerRelationships();

    @Query("select checklist from Checklist checklist left join fetch checklist.checklistitems where checklist.id =:id")
    Checklist findOneWithEagerRelationships(@Param("id") Long id);

}
