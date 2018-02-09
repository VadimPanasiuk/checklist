package checklist.web.rest;

import checklist.ChecklistApp;

import checklist.domain.Subitem;
import checklist.repository.SubitemRepository;
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
 * Test class for the SubitemResource REST controller.
 *
 * @see SubitemResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ChecklistApp.class)
public class SubitemResourceIntTest {

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
    private SubitemRepository subitemRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restSubitemMockMvc;

    private Subitem subitem;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final SubitemResource subitemResource = new SubitemResource(subitemRepository);
        this.restSubitemMockMvc = MockMvcBuilders.standaloneSetup(subitemResource)
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
    public static Subitem createEntity(EntityManager em) {
        Subitem subitem = new Subitem()
            .name(DEFAULT_NAME)
            .order(DEFAULT_ORDER)
            .identifier(DEFAULT_IDENTIFIER)
            .image(DEFAULT_IMAGE)
            .imageContentType(DEFAULT_IMAGE_CONTENT_TYPE);
        return subitem;
    }

    @Before
    public void initTest() {
        subitem = createEntity(em);
    }

    @Test
    @Transactional
    public void createSubitem() throws Exception {
        int databaseSizeBeforeCreate = subitemRepository.findAll().size();

        // Create the Subitem
        restSubitemMockMvc.perform(post("/api/subitems")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(subitem)))
            .andExpect(status().isCreated());

        // Validate the Subitem in the database
        List<Subitem> subitemList = subitemRepository.findAll();
        assertThat(subitemList).hasSize(databaseSizeBeforeCreate + 1);
        Subitem testSubitem = subitemList.get(subitemList.size() - 1);
        assertThat(testSubitem.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testSubitem.getOrder()).isEqualTo(DEFAULT_ORDER);
        assertThat(testSubitem.getIdentifier()).isEqualTo(DEFAULT_IDENTIFIER);
        assertThat(testSubitem.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testSubitem.getImageContentType()).isEqualTo(DEFAULT_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    public void createSubitemWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = subitemRepository.findAll().size();

        // Create the Subitem with an existing ID
        subitem.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSubitemMockMvc.perform(post("/api/subitems")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(subitem)))
            .andExpect(status().isBadRequest());

        // Validate the Subitem in the database
        List<Subitem> subitemList = subitemRepository.findAll();
        assertThat(subitemList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllSubitems() throws Exception {
        // Initialize the database
        subitemRepository.saveAndFlush(subitem);

        // Get all the subitemList
        restSubitemMockMvc.perform(get("/api/subitems?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(subitem.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].order").value(hasItem(DEFAULT_ORDER)))
            .andExpect(jsonPath("$.[*].identifier").value(hasItem(DEFAULT_IDENTIFIER.toString())))
            .andExpect(jsonPath("$.[*].imageContentType").value(hasItem(DEFAULT_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].image").value(hasItem(Base64Utils.encodeToString(DEFAULT_IMAGE))));
    }

    @Test
    @Transactional
    public void getSubitem() throws Exception {
        // Initialize the database
        subitemRepository.saveAndFlush(subitem);

        // Get the subitem
        restSubitemMockMvc.perform(get("/api/subitems/{id}", subitem.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(subitem.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.order").value(DEFAULT_ORDER))
            .andExpect(jsonPath("$.identifier").value(DEFAULT_IDENTIFIER.toString()))
            .andExpect(jsonPath("$.imageContentType").value(DEFAULT_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.image").value(Base64Utils.encodeToString(DEFAULT_IMAGE)));
    }

    @Test
    @Transactional
    public void getNonExistingSubitem() throws Exception {
        // Get the subitem
        restSubitemMockMvc.perform(get("/api/subitems/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSubitem() throws Exception {
        // Initialize the database
        subitemRepository.saveAndFlush(subitem);
        int databaseSizeBeforeUpdate = subitemRepository.findAll().size();

        // Update the subitem
        Subitem updatedSubitem = subitemRepository.findOne(subitem.getId());
        // Disconnect from session so that the updates on updatedSubitem are not directly saved in db
        em.detach(updatedSubitem);
        updatedSubitem
            .name(UPDATED_NAME)
            .order(UPDATED_ORDER)
            .identifier(UPDATED_IDENTIFIER)
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE);

        restSubitemMockMvc.perform(put("/api/subitems")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedSubitem)))
            .andExpect(status().isOk());

        // Validate the Subitem in the database
        List<Subitem> subitemList = subitemRepository.findAll();
        assertThat(subitemList).hasSize(databaseSizeBeforeUpdate);
        Subitem testSubitem = subitemList.get(subitemList.size() - 1);
        assertThat(testSubitem.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testSubitem.getOrder()).isEqualTo(UPDATED_ORDER);
        assertThat(testSubitem.getIdentifier()).isEqualTo(UPDATED_IDENTIFIER);
        assertThat(testSubitem.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testSubitem.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    public void updateNonExistingSubitem() throws Exception {
        int databaseSizeBeforeUpdate = subitemRepository.findAll().size();

        // Create the Subitem

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restSubitemMockMvc.perform(put("/api/subitems")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(subitem)))
            .andExpect(status().isCreated());

        // Validate the Subitem in the database
        List<Subitem> subitemList = subitemRepository.findAll();
        assertThat(subitemList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteSubitem() throws Exception {
        // Initialize the database
        subitemRepository.saveAndFlush(subitem);
        int databaseSizeBeforeDelete = subitemRepository.findAll().size();

        // Get the subitem
        restSubitemMockMvc.perform(delete("/api/subitems/{id}", subitem.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Subitem> subitemList = subitemRepository.findAll();
        assertThat(subitemList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Subitem.class);
        Subitem subitem1 = new Subitem();
        subitem1.setId(1L);
        Subitem subitem2 = new Subitem();
        subitem2.setId(subitem1.getId());
        assertThat(subitem1).isEqualTo(subitem2);
        subitem2.setId(2L);
        assertThat(subitem1).isNotEqualTo(subitem2);
        subitem1.setId(null);
        assertThat(subitem1).isNotEqualTo(subitem2);
    }
}
