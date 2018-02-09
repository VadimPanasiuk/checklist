package checklist.web.rest;

import com.codahale.metrics.annotation.Timed;
import checklist.domain.Checklist;

import checklist.repository.ChecklistRepository;
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
 * REST controller for managing Checklist.
 */
@RestController
@RequestMapping("/api")
public class ChecklistResource {

    private final Logger log = LoggerFactory.getLogger(ChecklistResource.class);

    private static final String ENTITY_NAME = "checklist";

    private final ChecklistRepository checklistRepository;

    public ChecklistResource(ChecklistRepository checklistRepository) {
        this.checklistRepository = checklistRepository;
    }

    /**
     * POST  /checklists : Create a new checklist.
     *
     * @param checklist the checklist to create
     * @return the ResponseEntity with status 201 (Created) and with body the new checklist, or with status 400 (Bad Request) if the checklist has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/checklists")
    @Timed
    public ResponseEntity<Checklist> createChecklist(@RequestBody Checklist checklist) throws URISyntaxException {
        log.debug("REST request to save Checklist : {}", checklist);
        if (checklist.getId() != null) {
            throw new BadRequestAlertException("A new checklist cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Checklist result = checklistRepository.save(checklist);
        return ResponseEntity.created(new URI("/api/checklists/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /checklists : Updates an existing checklist.
     *
     * @param checklist the checklist to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated checklist,
     * or with status 400 (Bad Request) if the checklist is not valid,
     * or with status 500 (Internal Server Error) if the checklist couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/checklists")
    @Timed
    public ResponseEntity<Checklist> updateChecklist(@RequestBody Checklist checklist) throws URISyntaxException {
        log.debug("REST request to update Checklist : {}", checklist);
        if (checklist.getId() == null) {
            return createChecklist(checklist);
        }
        Checklist result = checklistRepository.save(checklist);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, checklist.getId().toString()))
            .body(result);
    }

    /**
     * GET  /checklists : get all the checklists.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of checklists in body
     */
    @GetMapping("/checklists")
    @Timed
    public List<Checklist> getAllChecklists() {
        log.debug("REST request to get all Checklists");
        return checklistRepository.findAllWithEagerRelationships();
        }

    /**
     * GET  /checklists/:id : get the "id" checklist.
     *
     * @param id the id of the checklist to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the checklist, or with status 404 (Not Found)
     */
    @GetMapping("/checklists/{id}")
    @Timed
    public ResponseEntity<Checklist> getChecklist(@PathVariable Long id) {
        log.debug("REST request to get Checklist : {}", id);
        Checklist checklist = checklistRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(checklist));
    }

    /**
     * DELETE  /checklists/:id : delete the "id" checklist.
     *
     * @param id the id of the checklist to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/checklists/{id}")
    @Timed
    public ResponseEntity<Void> deleteChecklist(@PathVariable Long id) {
        log.debug("REST request to delete Checklist : {}", id);
        checklistRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
