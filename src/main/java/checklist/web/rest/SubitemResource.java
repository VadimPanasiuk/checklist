package checklist.web.rest;

import com.codahale.metrics.annotation.Timed;
import checklist.domain.Subitem;

import checklist.repository.SubitemRepository;
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
 * REST controller for managing Subitem.
 */
@RestController
@RequestMapping("/api")
public class SubitemResource {

    private final Logger log = LoggerFactory.getLogger(SubitemResource.class);

    private static final String ENTITY_NAME = "subitem";

    private final SubitemRepository subitemRepository;

    public SubitemResource(SubitemRepository subitemRepository) {
        this.subitemRepository = subitemRepository;
    }

    /**
     * POST  /subitems : Create a new subitem.
     *
     * @param subitem the subitem to create
     * @return the ResponseEntity with status 201 (Created) and with body the new subitem, or with status 400 (Bad Request) if the subitem has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/subitems")
    @Timed
    public ResponseEntity<Subitem> createSubitem(@RequestBody Subitem subitem) throws URISyntaxException {
        log.debug("REST request to save Subitem : {}", subitem);
        if (subitem.getId() != null) {
            throw new BadRequestAlertException("A new subitem cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Subitem result = subitemRepository.save(subitem);
        return ResponseEntity.created(new URI("/api/subitems/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /subitems : Updates an existing subitem.
     *
     * @param subitem the subitem to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated subitem,
     * or with status 400 (Bad Request) if the subitem is not valid,
     * or with status 500 (Internal Server Error) if the subitem couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/subitems")
    @Timed
    public ResponseEntity<Subitem> updateSubitem(@RequestBody Subitem subitem) throws URISyntaxException {
        log.debug("REST request to update Subitem : {}", subitem);
        if (subitem.getId() == null) {
            return createSubitem(subitem);
        }
        Subitem result = subitemRepository.save(subitem);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, subitem.getId().toString()))
            .body(result);
    }

    /**
     * GET  /subitems : get all the subitems.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of subitems in body
     */
    @GetMapping("/subitems")
    @Timed
    public List<Subitem> getAllSubitems() {
        log.debug("REST request to get all Subitems");
        return subitemRepository.findAllWithEagerRelationships();
        }

    /**
     * GET  /subitems/:id : get the "id" subitem.
     *
     * @param id the id of the subitem to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the subitem, or with status 404 (Not Found)
     */
    @GetMapping("/subitems/{id}")
    @Timed
    public ResponseEntity<Subitem> getSubitem(@PathVariable Long id) {
        log.debug("REST request to get Subitem : {}", id);
        Subitem subitem = subitemRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(subitem));
    }

    /**
     * DELETE  /subitems/:id : delete the "id" subitem.
     *
     * @param id the id of the subitem to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/subitems/{id}")
    @Timed
    public ResponseEntity<Void> deleteSubitem(@PathVariable Long id) {
        log.debug("REST request to delete Subitem : {}", id);
        subitemRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
