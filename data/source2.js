import deepExtend from '../util/deep-extend';
import transpose from '../util/transpose';
import SourceMethod from './source-method';


function protoReduce(obj, callback, state) {
  let cur = obj;
  
  do {
    state = callback(state, cur);
    cur = cur.__proto__;
  } while (cur);

  return state;
}

function mergeResourceConfigs(obj) {
  function add(state, obj) {
    if(obj.hasOwnProperty('createResource')) {
      return deepExtend(state, obj.createResource.call(this));
    }
    return state;
  }
  return protoReduce(obj, add, {});
}


function buildResource(config) {
  var configByMethod = transpose(config);
  let resource = {};

  Object.keys(configByMethod)
    .forEach((methodName) => {
      let methodConf = configByMethod[methodName];
      if (methodConf.props) {
        resource[methodName] = methodConf.props;
      } else {
        resource[methodName] = SourceMethod(configByMethod[methodName]);
      }
    });
  return resource;
}


export default class DataSource {
  constructor(options={}) {
    this.options = options;
    let resourceConf = mergeResourceConfigs(this);
    this.resource = buildResource(resourceConf);
  }
}
