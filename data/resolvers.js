import { find, filter, omitBy, indexOf, map, mapValues, first, get, isNil, findIndex } from 'lodash';
import rp from 'request-promise';
import { data } from './services.js';
const langs = [
  { name: "ruby", description: "a scripted language", likes: 2 },
  { name: "python", description: "a scripted language", likes: 2 },
  { name: "scala", description: "a language vm language on java vm", likes: 2 },
];

function langRequest(name){
  let service = data.services[name];
  if(isNil(service)){
    return undefined;
  }
  let port = service.port;
  let address = service.address;
  console.log(service);
  if(isNil(port) || isNil(address)){
    return undefined;
  }
  return `http://${address}:${port}/language`;
}

function langLikeRequest(name){
  let service = data.services[name];
  if(isNil(service)){
    return undefined;
  }
  let port = service.port;
  let address = service.address;
  console.log(service);
  if(isNil(port) || isNil(address)){
    return undefined;
  }
  return `http://${address}:${port}/language/like`;
}


const resolveFunctions = {
  Query: {
    lang(_, { name }) {
      let req = langRequest(name);
      if (isNil(req)){
        throw new Error(`language with name: ${name} is not registered`);
      }
      return rp({
        method: 'GET',
        uri: req,
        json: 'true'
      });
    },
  },
  Mutation: {
    likeLang(_, { name }) {
      let req = langLikeRequest(name);
      const lang = find(langs, { name: name });
      if (isNil(req)){
        throw new Error(`language with name: ${name} is not registered`);
      }
      return rp({
        method: 'POST',
        uri: req,
        json: 'true'
      });
    },
  },
  Lang: {
    /*
    posts(author) {
      return filter(posts, { authorId: author.id });
    },
    */
  },
};
export default resolveFunctions;

