import Method from './method';

export default function SourceMethod(conf) {
  let {
    requestStruct,
    serialize,
    unserialize,
    responseStruct,
    cache
  } = conf;

  return Method(conf.api, [
    requestStruct,
    serialize,
  ], [
    unserialize,
    responseStruct
  ]);
};
