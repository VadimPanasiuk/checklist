package checklist.web.rest;

import com.codahale.metrics.annotation.Timed;
import checklist.domain.ChecklistItem;

import checklist.repository.ChecklistItemRepository;
import checklist.web.rest.errors.BadRequestAlertException;
import checklist.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing ChecklistItem.
 */
@RestController
@RequestMapping("/api")
public class ChecklistItemResource {

    private final Logger log = LoggerFactory.getLogger(ChecklistItemResource.class);

    private static final String ENTITY_NAME = "checklistItem";

    private final ChecklistItemRepository checklistItemRepository;

    public ChecklistItemResource(ChecklistItemRepository checklistItemRepository) {
        this.checklistItemRepository = checklistItemRepository;
    }

    /**
     * POST  /checklist-items : Create a new checklistItem.
     *
     * @param checklistItem the checklistItem to create
     * @return the ResponseEntity with status 201 (Created) and with body the new checklistItem, or with status 400 (Bad Request) if the checklistItem has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/checklist-items")
    @Timed
    public ResponseEntity<ChecklistItem> createChecklistItem(@RequestBody ChecklistItem checklistItem) throws URISyntaxException {
        log.debug("REST request to save ChecklistItem : {}", checklistItem);
        if (checklistItem.getId() != null) {
            throw new BadRequestAlertException("A new checklistItem cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ChecklistItem result = checklistItemRepository.save(checklistItem);
        return ResponseEntity.created(new URI("/api/checklist-items/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /checklist-items : Updates an existing checklistItem.
     *
     * @param checklistItem the checklistItem to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated checklistItem,
     * or with status 400 (Bad Request) if the checklistItem is not valid,
     * or with status 500 (Internal Server Error) if the checklistItem couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/checklist-items")
    @Timed
    public ResponseEntity<ChecklistItem> updateChecklistItem(@RequestBody ChecklistItem checklistItem) throws URISyntaxException {
        log.debug("REST request to update ChecklistItem : {}", checklistItem);
        if (checklistItem.getId() == null) {
            return createChecklistItem(checklistItem);
        }
        ChecklistItem result = checklistItemRepository.save(checklistItem);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, checklistItem.getId().toString()))
            .body(result);
    }

    /**
     * GET  /checklist-items : get all the checklistItems.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of checklistItems in body
     */
    @GetMapping("/checklist-items")
    @Timed
    public List<ChecklistItem> getAllChecklistItems() {
        log.debug("REST request to get all ChecklistItems");
        return checklistItemRepository.findAll();
        }

    /**
     * GET  /checklist-items/:id : get the "id" checklistItem.
     *
     * @param id the id of the checklistItem to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the checklistItem, or with status 404 (Not Found)
     */
    @GetMapping("/checklist-items/{id}")
    @Timed
    public ResponseEntity<ChecklistItem> getChecklistItem(@PathVariable Long id) {
        log.debug("REST request to get ChecklistItem : {}", id);
        ChecklistItem checklistItem = checklistItemRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(checklistItem));
    }

    /**
     * DELETE  /checklist-items/:id : delete the "id" checklistItem.
     *
     * @param id the id of the checklistItem to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/checklist-items/{id}")
    @Timed
    public ResponseEntity<Void> deleteChecklistItem(@PathVariable Long id) {
        log.debug("REST request to delete ChecklistItem : {}", id);
        checklistItemRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
