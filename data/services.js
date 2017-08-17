import { find, filter, omitBy, indexOf, map, mapValues, first, get, isNil, findIndex, merge } from 'lodash';
import consulLib from 'consul';

const consul_host = process.env.CONSUL_HOST;
const consul_port = process.env.CONSUL_PORT;

if(isNil(consul_host) || isNil(consul_port)){
  console.log('CONSUL_HOST & CONSUL_PORT environment variables must be specified');
  process.exit(1);
}

const consul = consulLib({
  host: `${consul_host}`,
  port: `${consul_port}`
});

var services = {};
var data = { services: services };

const FILTER_TAG = 'language';
const watch = consul.watch({ method: consul.catalog.service.list, options: {}});
 
watch.on('change', function(data, res) {
  var trackedServices = mapValues(
    omitBy(data, (value, key) => {
      return indexOf(value,'language') === -1;
    }), 
    (serviceTags) => {
      return {
        tags: serviceTags
      };
    }
  );
  //services = trackedServices;
  for (let service in trackedServices) {
    let value = services[service];
    if (isNil(value)){
      services[service] = trackedServices[service];
    } else {
      merge(services[service], trackedServices[service]);
    }
  }
  // check services health
  console.log('currently tracking services:', services);
});

watch.on('error', function(err) {
  console.log('error:', err);
});

//function checkServiceHealth()

function checkServicesHealth(){
  for (let service in services) {
    let value = services[service];
    console.log('key:', service);
    console.log('value:', value);
    consul.health.service({service: service, tag: FILTER_TAG }, (err, res) => {
      if (err) throw err;
      let health = first(res);
      if (isNil(health)) throw new Error("Service "+service+" does not exist");
      //console.log(health.Checks, service);
      let checkIndex = findIndex(health.Checks, (check) => {
        //console.log(check);
        return get(check, 'ServiceName', '') == service;
      }); 
      if (checkIndex === -1) {
        services[service].health = 'unhealthy'; 
        console.log("Service "+service+" does not have any health checks"+checkIndex);
        return;
      }
      if (get(health.Checks[checkIndex], 'Status', 'critical') === 'passing') {
        services[service].health = 'healthy'; 
        services[service].port = health.Service.Port;
        services[service].address = health.Service.Address;
        return;
      }
      services[service].health = 'unhealthy'; 
    }); 
  }
}

setInterval(checkServicesHealth, 5000);

export {data};
