package checklist.repository;

import checklist.domain.ChecklistItem;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the ChecklistItem entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChecklistItemRepository extends JpaRepository<ChecklistItem, Long> {

}
