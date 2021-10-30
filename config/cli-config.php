<?php

use Doctrine\ORM\EntityManager;
use Doctrine\ORM\Tools\Console\ConsoleRunner;
use Doctrine\ORM\Tools\Setup;

//require_once __DIR__ . '/../public/index.php';

$dbParams = [
    'driver' => 'mysqli',
    'user' => 'root',
    'password' => 'root',
    'dbname' => 'test',
];
$config = Setup::createAnnotationMetadataConfiguration([__DIR__ . "/../module/Application/src/Models"], true, null, null, false);
$entityManager = EntityManager::create($dbParams, $config);

return ConsoleRunner::createHelperSet($entityManager);
