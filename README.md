# entry 

This is a program written in javascript (it's a GraphQL API). It will check the status of services in [consul](https://www.consul.io), and if there are any tagged with `language` it will redirect all queries to those APIs, else it will show an error that language has not be registered.

## requirements

* Install [yarn](https://yarnpkg.com/en/docs/install)

## running program

You can use the following commands on a bash shell to get the program running.

```bash
# install package.json requirements
yarn install
# start the application must have consul running
export CONSUL_PORT=locahost
export CONSUL_HOST=8500
npm start 
# or try docker-compose.yaml with the following
docker-compose up
```

## dockerize program

```bash
docker build -t <dockerhub-user>/entry:latest .
# to run also add env variables docker run -p 8080:8080 <dockerhub-user>/entry
```
