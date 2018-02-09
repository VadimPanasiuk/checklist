package checklist.domain;


import javax.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Subitem.
 */
@Entity
@Table(name = "subitem")
public class Subitem implements Serializable {

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

    @ManyToOne
    private Item item;

    @ManyToMany
    @JoinTable(name = "subitem_checklist",
               joinColumns = @JoinColumn(name="subitems_id", referencedColumnName="id"),
               inverseJoinColumns = @JoinColumn(name="checklists_id", referencedColumnName="id"))
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

    public Subitem name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getOrder() {
        return order;
    }

    public Subitem order(Integer order) {
        this.order = order;
        return this;
    }

    public void setOrder(Integer order) {
        this.order = order;
    }

    public String getIdentifier() {
        return identifier;
    }

    public Subitem identifier(String identifier) {
        this.identifier = identifier;
        return this;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public byte[] getImage() {
        return image;
    }

    public Subitem image(byte[] image) {
        this.image = image;
        return this;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getImageContentType() {
        return imageContentType;
    }

    public Subitem imageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
        return this;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public Item getItem() {
        return item;
    }

    public Subitem item(Item item) {
        this.item = item;
        return this;
    }

    public void setItem(Item item) {
        this.item = item;
    }

    public Set<Checklist> getChecklists() {
        return checklists;
    }

    public Subitem checklists(Set<Checklist> checklists) {
        this.checklists = checklists;
        return this;
    }

    public Subitem addChecklist(Checklist checklist) {
        this.checklists.add(checklist);
        checklist.getSubitems().add(this);
        return this;
    }

    public Subitem removeChecklist(Checklist checklist) {
        this.checklists.remove(checklist);
        checklist.getSubitems().remove(this);
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
        Subitem subitem = (Subitem) o;
        if (subitem.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), subitem.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Subitem{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", order=" + getOrder() +
            ", identifier='" + getIdentifier() + "'" +
            ", image='" + getImage() + "'" +
            ", imageContentType='" + getImageContentType() + "'" +
            "}";
    }
}
