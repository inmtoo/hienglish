<?php

namespace Application\Models;

use Doctrine\ORM\Mapping as ORM;


/**
 * @ORM\Entity
 * @ORM\Table(name="elements")
 */
class Element
{

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     */
    private $parent_id;

    /**
     * @ORM\Column(type="string")
     */
    private $name;

    public function getId() {
        return $this->id;
    }

    public function getParentId() {
        return $this->parent_id;
    }

    public function setParentId($parentId) {
        $this->parent_id = $parentId;
    }

    public function getName() {
        return $this->name;
    }

    public function setName($name) {
        $this->name = $name;
    }
}