package checklist.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Item.
 */
@Entity
@Table(name = "item")
public class Item implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "imageurl")
    private String imageurl;

    @Column(name = "identifier")
    private String identifier;

    @Column(name = "jhi_order")
    private Integer order;

    @OneToMany(mappedBy = "item")
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

    public Item name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImageurl() {
        return imageurl;
    }

    public Item imageurl(String imageurl) {
        this.imageurl = imageurl;
        return this;
    }

    public void setImageurl(String imageurl) {
        this.imageurl = imageurl;
    }

    public String getIdentifier() {
        return identifier;
    }

    public Item identifier(String identifier) {
        this.identifier = identifier;
        return this;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public Integer getOrder() {
        return order;
    }

    public Item order(Integer order) {
        this.order = order;
        return this;
    }

    public void setOrder(Integer order) {
        this.order = order;
    }

    public Set<Subitem> getSubitems() {
        return subitems;
    }

    public Item subitems(Set<Subitem> subitems) {
        this.subitems = subitems;
        return this;
    }

    public Item addSubitem(Subitem subitem) {
        this.subitems.add(subitem);
        subitem.setItem(this);
        return this;
    }

    public Item removeSubitem(Subitem subitem) {
        this.subitems.remove(subitem);
        subitem.setItem(null);
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
        Item item = (Item) o;
        if (item.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), item.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Item{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", imageurl='" + getImageurl() + "'" +
            ", identifier='" + getIdentifier() + "'" +
            ", order=" + getOrder() +
            "}";
    }
}
