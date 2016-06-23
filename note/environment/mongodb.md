'mongodb' => [
    'class' => '\yii\mongodb\Connection',
    'dsn' => 'mongodb://'.MONGO_USER_NAME.':'.MONGO_USER_PASSWORD.'@'.MONGO_HOSTS.'/'.MONGO_DATABASE,
    'options' => [
        'replicaSet' => MONGO_REPLSET,
    ]
],