<?php

declare(strict_types=1);

namespace Application\Controller;

use Application\Models\Element;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\Tools\Setup;
use Laminas\Mvc\Controller\AbstractActionController;
use Laminas\View\Model\ViewModel;

class IndexController extends AbstractActionController
{
    private $db;
    private $dbParams = [
        'driver' => 'mysqli',
        'user' => 'root',
        'password' => 'root',
        'dbname' => 'test'
    ];
    private $text;
    private $count;

    public function __construct() {
        $config = Setup::createAnnotationMetadataConfiguration([__DIR__ . "/../Models"], true, null, null, false);
        $this->db = EntityManager::create($this->dbParams, $config);
    }

    /**
     * @param $parentId
     * @param $elements Element[]
     * @return array
     */
    private function prepareArr($parentId, $elements) {
        $arr = [];
        foreach ($elements as $element) {
            if ($element->getParentId() != $parentId) continue;

            $arr[] = [
                'name' => $element->getName(),
                'id' => $element->getId(),
                'parent_id' => $element->getParentId(),
                'children' => $this->prepareArr($element->getId(), $elements)
            ];
        }

        return $arr;
    }

    public function indexAction() {
        $elements = $this->db->getRepository(Element::class)->findAll();
        $arr = $this->prepareArr(0, $elements);

        return new ViewModel([
            'elements' => $arr
        ]);
    }

    private function getRandomWord() {
        $random = rand(0, count($this->text) - 1);
        return $this->text[$random];
    }

    private function deleteElement($elementId) {

        $element = $this->db->getRepository(Element::class)->find($elementId);
        if (!$element) return;

        $this->db->remove($element);
        $this->db->flush();

        /**
         * @var $children Element[]
         */
        $children = $this->db->getRepository(Element::class)->findBy(['parent_id' => $elementId]);
        foreach ($children as $child) {
            $this->deleteElement($child->getId());
        }

    }

    public function deleteAction() {
        $id = $_GET['id'];
        if (empty($id)) return;


        $this->deleteElement($id);
        echo 1;

        exit;
    }

    private function generateElement($parentId) {


        $element = new Element();
        $element->setName($this->getRandomWord());
        $element->setParentId($parentId);
        $this->db->persist($element);
        $this->db->flush();

        $needChild = rand(0, 1); // нужно ли добавлять дочерние элементы

        if (!$needChild || 10 > $this->count) return;

        $random = rand(10, $this->count);
        $this->count -= $random;
        while ($random > 0) {
            $this->generateElement($element->getId());
            $random--;
        }

    }

    public function generateAction() {
        $elements = $this->db->getRepository(Element::class)->findAll();

        foreach ($elements as $element) {
            $this->db->remove($element);
            $this->db->flush();
        }

        $text = str_replace(["\r", "\n"], ' ', file_get_contents(__DIR__ . '/../../../../public/text.txt'));
        $text = explode(" ", $text);
        $this->text = array_map(function ($word) {
            return ucfirst(trim(str_replace(['.', ','], '', $word)));
        }, $text);
        $this->text = array_values(array_filter($this->text, function ($word) {
            return mb_strlen($word, 'UTF-8') >= 3;
        }));


        $rootElement = new Element();
        $rootElement->setName($this->getRandomWord());
        $rootElement->setParentId(0);
        $this->db->persist($rootElement);
        $this->db->flush();

        $rootId = $rootElement->getId();

        $this->count = 499;
        while ($this->count > 0) {
            $this->count--;
            $this->generateElement($rootId);
        }

        exit;
    }

    public function updateAction() {
        $id = $_GET['id'];
        $parentId = $_GET['parent_id'];

        /**
         * @var $element Element
         */
        $element = $this->db->getRepository(Element::class)->find($id);
        if (!$element) return;

        $element->setParentId($parentId);
        $this->db->flush();

        echo 1;
        exit;
    }

}
