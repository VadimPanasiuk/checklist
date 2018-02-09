package checklist.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Checklist.
 */
@Entity
@Table(name = "checklist")
public class Checklist implements Serializable {

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

    @ManyToMany
    @JoinTable(name = "checklist_checklistitem",
               joinColumns = @JoinColumn(name="checklists_id", referencedColumnName="id"),
               inverseJoinColumns = @JoinColumn(name="checklistitems_id", referencedColumnName="id"))
    private Set<ChecklistItem> checklistitems = new HashSet<>();

    @ManyToMany(mappedBy = "checklists")
    @JsonIgnore
    private Set<Subitem> subitems = new HashSet<>();

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

    public Checklist name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getOrder() {
        return order;
    }

    public Checklist order(Integer order) {
        this.order = order;
        return this;
    }

    public void setOrder(Integer order) {
        this.order = order;
    }

    public String getIdentifier() {
        return identifier;
    }

    public Checklist identifier(String identifier) {
        this.identifier = identifier;
        return this;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public byte[] getImage() {
        return image;
    }

    public Checklist image(byte[] image) {
        this.image = image;
        return this;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getImageContentType() {
        return imageContentType;
    }

    public Checklist imageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
        return this;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public Set<ChecklistItem> getChecklistitems() {
        return checklistitems;
    }

    public Checklist checklistitems(Set<ChecklistItem> checklistItems) {
        this.checklistitems = checklistItems;
        return this;
    }

    public Checklist addChecklistitem(ChecklistItem checklistItem) {
        this.checklistitems.add(checklistItem);
        checklistItem.getChecklists().add(this);
        return this;
    }

    public Checklist removeChecklistitem(ChecklistItem checklistItem) {
        this.checklistitems.remove(checklistItem);
        checklistItem.getChecklists().remove(this);
        return this;
    }

    public void setChecklistitems(Set<ChecklistItem> checklistItems) {
        this.checklistitems = checklistItems;
    }

    public Set<Subitem> getSubitems() {
        return subitems;
    }

    public Checklist subitems(Set<Subitem> subitems) {
        this.subitems = subitems;
        return this;
    }

    public Checklist addSubitem(Subitem subitem) {
        this.subitems.add(subitem);
        subitem.getChecklists().add(this);
        return this;
    }

    public Checklist removeSubitem(Subitem subitem) {
        this.subitems.remove(subitem);
        subitem.getChecklists().remove(this);
        return this;
    }

    public void setSubitems(Set<Subitem> subitems) {
        this.subitems = subitems;
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
        Checklist checklist = (Checklist) o;
        if (checklist.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), checklist.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Checklist{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", order=" + getOrder() +
            ", identifier='" + getIdentifier() + "'" +
            ", image='" + getImage() + "'" +
            ", imageContentType='" + getImageContentType() + "'" +
            "}";
    }
}
