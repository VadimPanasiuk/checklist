package checklist.web.rest;

import checklist.ChecklistApp;

import checklist.domain.Checklist;
import checklist.repository.ChecklistRepository;
import checklist.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

import javax.persistence.EntityManager;
import java.util.List;

import static checklist.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the ChecklistResource REST controller.
 *
 * @see ChecklistResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ChecklistApp.class)
public class ChecklistResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Integer DEFAULT_ORDER = 1;
    private static final Integer UPDATED_ORDER = 2;

    private static final String DEFAULT_IDENTIFIER = "AAAAAAAAAA";
    private static final String UPDATED_IDENTIFIER = "BBBBBBBBBB";

    private static final byte[] DEFAULT_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_IMAGE = TestUtil.createByteArray(2, "1");
    private static final String DEFAULT_IMAGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_IMAGE_CONTENT_TYPE = "image/png";

    @Autowired
    private ChecklistRepository checklistRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restChecklistMockMvc;

    private Checklist checklist;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ChecklistResource checklistResource = new ChecklistResource(checklistRepository);
        this.restChecklistMockMvc = MockMvcBuilders.standaloneSetup(checklistResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Checklist createEntity(EntityManager em) {
        Checklist checklist = new Checklist()
            .name(DEFAULT_NAME)
            .order(DEFAULT_ORDER)
            .identifier(DEFAULT_IDENTIFIER)
            .image(DEFAULT_IMAGE)
            .imageContentType(DEFAULT_IMAGE_CONTENT_TYPE);
        return checklist;
    }

    @Before
    public void initTest() {
        checklist = createEntity(em);
    }

    @Test
    @Transactional
    public void createChecklist() throws Exception {
        int databaseSizeBeforeCreate = checklistRepository.findAll().size();

        // Create the Checklist
        restChecklistMockMvc.perform(post("/api/checklists")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(checklist)))
            .andExpect(status().isCreated());

        // Validate the Checklist in the database
        List<Checklist> checklistList = checklistRepository.findAll();
        assertThat(checklistList).hasSize(databaseSizeBeforeCreate + 1);
        Checklist testChecklist = checklistList.get(checklistList.size() - 1);
        assertThat(testChecklist.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testChecklist.getOrder()).isEqualTo(DEFAULT_ORDER);
        assertThat(testChecklist.getIdentifier()).isEqualTo(DEFAULT_IDENTIFIER);
        assertThat(testChecklist.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testChecklist.getImageContentType()).isEqualTo(DEFAULT_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    public void createChecklistWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = checklistRepository.findAll().size();

        // Create the Checklist with an existing ID
        checklist.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restChecklistMockMvc.perform(post("/api/checklists")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(checklist)))
            .andExpect(status().isBadRequest());

        // Validate the Checklist in the database
        List<Checklist> checklistList = checklistRepository.findAll();
        assertThat(checklistList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllChecklists() throws Exception {
        // Initialize the database
        checklistRepository.saveAndFlush(checklist);

        // Get all the checklistList
        restChecklistMockMvc.perform(get("/api/checklists?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(checklist.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].order").value(hasItem(DEFAULT_ORDER)))
            .andExpect(jsonPath("$.[*].identifier").value(hasItem(DEFAULT_IDENTIFIER.toString())))
            .andExpect(jsonPath("$.[*].imageContentType").value(hasItem(DEFAULT_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].image").value(hasItem(Base64Utils.encodeToString(DEFAULT_IMAGE))));
    }

    @Test
    @Transactional
    public void getChecklist() throws Exception {
        // Initialize the database
        checklistRepository.saveAndFlush(checklist);

        // Get the checklist
        restChecklistMockMvc.perform(get("/api/checklists/{id}", checklist.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(checklist.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.order").value(DEFAULT_ORDER))
            .andExpect(jsonPath("$.identifier").value(DEFAULT_IDENTIFIER.toString()))
            .andExpect(jsonPath("$.imageContentType").value(DEFAULT_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.image").value(Base64Utils.encodeToString(DEFAULT_IMAGE)));
    }

    @Test
    @Transactional
    public void getNonExistingChecklist() throws Exception {
        // Get the checklist
        restChecklistMockMvc.perform(get("/api/checklists/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateChecklist() throws Exception {
        // Initialize the database
        checklistRepository.saveAndFlush(checklist);
        int databaseSizeBeforeUpdate = checklistRepository.findAll().size();

        // Update the checklist
        Checklist updatedChecklist = checklistRepository.findOne(checklist.getId());
        // Disconnect from session so that the updates on updatedChecklist are not directly saved in db
        em.detach(updatedChecklist);
        updatedChecklist
            .name(UPDATED_NAME)
            .order(UPDATED_ORDER)
            .identifier(UPDATED_IDENTIFIER)
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE);

        restChecklistMockMvc.perform(put("/api/checklists")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedChecklist)))
            .andExpect(status().isOk());

        // Validate the Checklist in the database
        List<Checklist> checklistList = checklistRepository.findAll();
        assertThat(checklistList).hasSize(databaseSizeBeforeUpdate);
        Checklist testChecklist = checklistList.get(checklistList.size() - 1);
        assertThat(testChecklist.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testChecklist.getOrder()).isEqualTo(UPDATED_ORDER);
        assertThat(testChecklist.getIdentifier()).isEqualTo(UPDATED_IDENTIFIER);
        assertThat(testChecklist.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testChecklist.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    public void updateNonExistingChecklist() throws Exception {
        int databaseSizeBeforeUpdate = checklistRepository.findAll().size();

        // Create the Checklist

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restChecklistMockMvc.perform(put("/api/checklists")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(checklist)))
            .andExpect(status().isCreated());

        // Validate the Checklist in the database
        List<Checklist> checklistList = checklistRepository.findAll();
        assertThat(checklistList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteChecklist() throws Exception {
        // Initialize the database
        checklistRepository.saveAndFlush(checklist);
        int databaseSizeBeforeDelete = checklistRepository.findAll().size();

        // Get the checklist
        restChecklistMockMvc.perform(delete("/api/checklists/{id}", checklist.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Checklist> checklistList = checklistRepository.findAll();
        assertThat(checklistList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Checklist.class);
        Checklist checklist1 = new Checklist();
        checklist1.setId(1L);
        Checklist checklist2 = new Checklist();
        checklist2.setId(checklist1.getId());
        assertThat(checklist1).isEqualTo(checklist2);
        checklist2.setId(2L);
        assertThat(checklist1).isNotEqualTo(checklist2);
        checklist1.setId(null);
        assertThat(checklist1).isNotEqualTo(checklist2);
    }
}
