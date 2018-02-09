package checklist.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A ChecklistItem.
 */
@Entity
@Table(name = "checklist_item")
public class ChecklistItem implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "jhi_order")
    private Integer order;

    @Column(name = "identifier")
    private String identifier;

    @Lob
    @Column(name = "image")
    private byte[] image;

    @Column(name = "image_content_type")
    private String imageContentType;

    @ManyToMany(mappedBy = "checklistitems")
    @JsonIgnore
    private Set<Checklist> checklists = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public ChecklistItem name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getOrder() {
        return order;
    }

    public ChecklistItem order(Integer order) {
        this.order = order;
        return this;
    }

    public void setOrder(Integer order) {
        this.order = order;
    }

    public String getIdentifier() {
        return identifier;
    }

    public ChecklistItem identifier(String identifier) {
        this.identifier = identifier;
        return this;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public byte[] getImage() {
        return image;
    }

    public ChecklistItem image(byte[] image) {
        this.image = image;
        return this;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getImageContentType() {
        return imageContentType;
    }

    public ChecklistItem imageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
        return this;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public Set<Checklist> getChecklists() {
        return checklists;
    }

    public ChecklistItem checklists(Set<Checklist> checklists) {
        this.checklists = checklists;
        return this;
    }

    public ChecklistItem addChecklist(Checklist checklist) {
        this.checklists.add(checklist);
        checklist.getChecklistitems().add(this);
        return this;
    }

    public ChecklistItem removeChecklist(Checklist checklist) {
        this.checklists.remove(checklist);
        checklist.getChecklistitems().remove(this);
        return this;
    }

    public void setChecklists(Set<Checklist> checklists) {
        this.checklists = checklists;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        ChecklistItem checklistItem = (ChecklistItem) o;
        if (checklistItem.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), checklistItem.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ChecklistItem{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", order=" + getOrder() +
            ", identifier='" + getIdentifier() + "'" +
            ", image='" + getImage() + "'" +
            ", imageContentType='" + getImageContentType() + "'" +
            "}";
    }
}
