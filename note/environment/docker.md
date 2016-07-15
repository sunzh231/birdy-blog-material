### 安装docker compose
apt-get install python-pip python-dev
pip install -U docker-compose

#### 导出容器
docker export 4bba2493a509 > ubuntu-16.04.tar

#### 导入本地快照为镜像
cat ubuntu-16.04.tar | docker import - birdy/ubuntu:16.04
docker import http://example.com/export.tar

#### 从镜像生成容器
docker run -it -v /home/richard/work:/src birdy/ubuntu:16.04 /bin/bash
docker run -d -p 3306:3306 birdy/mysql-server:16.04 service mysql start
docker run --name mysqlserver -it -p 3306:3306 birdy/mysql-server:16.04 /bin/bash

#### 容器以守护态运行
docker run --name mysqlserver -d -p 127.0.0.1:3306:3306 -v /data/var/mysql/:/var/lib/mysql -v /home/richard/work/birdy/birdy-docker/mysql/my.cnf:/etc/mysql//my.cnf birdy/mysql:14.04-5.5 /bin/sh -c "while true; do echo helloworld; sleep 1; done"

#### 进入容器
docker exec -it bb2 /bin/sh
