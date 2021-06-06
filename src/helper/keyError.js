export default function keyError(schema) {
  let errors = {};
  Object.keys(schema).map((key) => {
    Object.keys(schema[key]).map((rule) => {
      let resRule = schema[key][rule]();
      if (!!resRule) errors[key] = resRule;
    });
  });

  return Object.keys(errors).length === 0 ? false : errors;
}
