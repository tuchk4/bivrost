import deepExtend from '../util/deep-extend';
import transpose from '../util/transpose';
import SourceMethod from './source-method';

function makeDs(config = {}) {
  var configByMethod = transpose(config);

  var DS = function(options = {}) {
    let source = {options};

    Object.keys(configByMethod)
      .forEach((methodName) => {
        let methodConf = configByMethod[methodName];
        if (methodConf.props) {
          source[methodName] = methodConf.props;
        } else {
          source[methodName] = SourceMethod(configByMethod[methodName]);
        }
      });
    return source;
  };

  DS.extend = function(newConfig) {
    return makeDs(deepExtend(config, newConfig));
  };

  return DS;
};

const DS = makeDs();

export default DS;
