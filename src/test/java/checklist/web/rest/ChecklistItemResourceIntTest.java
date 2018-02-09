package checklist.web.rest;

import checklist.ChecklistApp;

import checklist.domain.ChecklistItem;
import checklist.repository.ChecklistItemRepository;
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
 * Test class for the ChecklistItemResource REST controller.
 *
 * @see ChecklistItemResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ChecklistApp.class)
public class ChecklistItemResourceIntTest {

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
    private ChecklistItemRepository checklistItemRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restChecklistItemMockMvc;

    private ChecklistItem checklistItem;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ChecklistItemResource checklistItemResource = new ChecklistItemResource(checklistItemRepository);
        this.restChecklistItemMockMvc = MockMvcBuilders.standaloneSetup(checklistItemResource)
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
    public static ChecklistItem createEntity(EntityManager em) {
        ChecklistItem checklistItem = new ChecklistItem()
            .name(DEFAULT_NAME)
            .order(DEFAULT_ORDER)
            .identifier(DEFAULT_IDENTIFIER)
            .image(DEFAULT_IMAGE)
            .imageContentType(DEFAULT_IMAGE_CONTENT_TYPE);
        return checklistItem;
    }

    @Before
    public void initTest() {
        checklistItem = createEntity(em);
    }

    @Test
    @Transactional
    public void createChecklistItem() throws Exception {
        int databaseSizeBeforeCreate = checklistItemRepository.findAll().size();

        // Create the ChecklistItem
        restChecklistItemMockMvc.perform(post("/api/checklist-items")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(checklistItem)))
            .andExpect(status().isCreated());

        // Validate the ChecklistItem in the database
        List<ChecklistItem> checklistItemList = checklistItemRepository.findAll();
        assertThat(checklistItemList).hasSize(databaseSizeBeforeCreate + 1);
        ChecklistItem testChecklistItem = checklistItemList.get(checklistItemList.size() - 1);
        assertThat(testChecklistItem.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testChecklistItem.getOrder()).isEqualTo(DEFAULT_ORDER);
        assertThat(testChecklistItem.getIdentifier()).isEqualTo(DEFAULT_IDENTIFIER);
        assertThat(testChecklistItem.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testChecklistItem.getImageContentType()).isEqualTo(DEFAULT_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    public void createChecklistItemWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = checklistItemRepository.findAll().size();

        // Create the ChecklistItem with an existing ID
        checklistItem.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restChecklistItemMockMvc.perform(post("/api/checklist-items")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(checklistItem)))
            .andExpect(status().isBadRequest());

        // Validate the ChecklistItem in the database
        List<ChecklistItem> checklistItemList = checklistItemRepository.findAll();
        assertThat(checklistItemList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllChecklistItems() throws Exception {
        // Initialize the database
        checklistItemRepository.saveAndFlush(checklistItem);

        // Get all the checklistItemList
        restChecklistItemMockMvc.perform(get("/api/checklist-items?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(checklistItem.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].order").value(hasItem(DEFAULT_ORDER)))
            .andExpect(jsonPath("$.[*].identifier").value(hasItem(DEFAULT_IDENTIFIER.toString())))
            .andExpect(jsonPath("$.[*].imageContentType").value(hasItem(DEFAULT_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].image").value(hasItem(Base64Utils.encodeToString(DEFAULT_IMAGE))));
    }

    @Test
    @Transactional
    public void getChecklistItem() throws Exception {
        // Initialize the database
        checklistItemRepository.saveAndFlush(checklistItem);

        // Get the checklistItem
        restChecklistItemMockMvc.perform(get("/api/checklist-items/{id}", checklistItem.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(checklistItem.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.order").value(DEFAULT_ORDER))
            .andExpect(jsonPath("$.identifier").value(DEFAULT_IDENTIFIER.toString()))
            .andExpect(jsonPath("$.imageContentType").value(DEFAULT_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.image").value(Base64Utils.encodeToString(DEFAULT_IMAGE)));
    }

    @Test
    @Transactional
    public void getNonExistingChecklistItem() throws Exception {
        // Get the checklistItem
        restChecklistItemMockMvc.perform(get("/api/checklist-items/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateChecklistItem() throws Exception {
        // Initialize the database
        checklistItemRepository.saveAndFlush(checklistItem);
        int databaseSizeBeforeUpdate = checklistItemRepository.findAll().size();

        // Update the checklistItem
        ChecklistItem updatedChecklistItem = checklistItemRepository.findOne(checklistItem.getId());
        // Disconnect from session so that the updates on updatedChecklistItem are not directly saved in db
        em.detach(updatedChecklistItem);
        updatedChecklistItem
            .name(UPDATED_NAME)
            .order(UPDATED_ORDER)
            .identifier(UPDATED_IDENTIFIER)
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE);

        restChecklistItemMockMvc.perform(put("/api/checklist-items")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedChecklistItem)))
            .andExpect(status().isOk());

        // Validate the ChecklistItem in the database
        List<ChecklistItem> checklistItemList = checklistItemRepository.findAll();
        assertThat(checklistItemList).hasSize(databaseSizeBeforeUpdate);
        ChecklistItem testChecklistItem = checklistItemList.get(checklistItemList.size() - 1);
        assertThat(testChecklistItem.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testChecklistItem.getOrder()).isEqualTo(UPDATED_ORDER);
        assertThat(testChecklistItem.getIdentifier()).isEqualTo(UPDATED_IDENTIFIER);
        assertThat(testChecklistItem.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testChecklistItem.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    public void updateNonExistingChecklistItem() throws Exception {
        int databaseSizeBeforeUpdate = checklistItemRepository.findAll().size();

        // Create the ChecklistItem

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restChecklistItemMockMvc.perform(put("/api/checklist-items")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(checklistItem)))
            .andExpect(status().isCreated());

        // Validate the ChecklistItem in the database
        List<ChecklistItem> checklistItemList = checklistItemRepository.findAll();
        assertThat(checklistItemList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteChecklistItem() throws Exception {
        // Initialize the database
        checklistItemRepository.saveAndFlush(checklistItem);
        int databaseSizeBeforeDelete = checklistItemRepository.findAll().size();

        // Get the checklistItem
        restChecklistItemMockMvc.perform(delete("/api/checklist-items/{id}", checklistItem.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<ChecklistItem> checklistItemList = checklistItemRepository.findAll();
        assertThat(checklistItemList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ChecklistItem.class);
        ChecklistItem checklistItem1 = new ChecklistItem();
        checklistItem1.setId(1L);
        ChecklistItem checklistItem2 = new ChecklistItem();
        checklistItem2.setId(checklistItem1.getId());
        assertThat(checklistItem1).isEqualTo(checklistItem2);
        checklistItem2.setId(2L);
        assertThat(checklistItem1).isNotEqualTo(checklistItem2);
        checklistItem1.setId(null);
        assertThat(checklistItem1).isNotEqualTo(checklistItem2);
    }
}
