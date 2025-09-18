import fastJson from 'fast-json-stringify';

const stringify = fastJson({
  title: 'AnyValue',
  type: 'object',
  additionalProperties: true,
});

export function safeStringify(value: any) {
  if (value !== null && typeof value === 'object') {
    return stringify(
      JSON.parse(
        JSON.stringify(value, (_, v) =>
          typeof v === 'bigint' ? v.toString() : v
        )
      )
    );
  }
  return JSON.stringify(
    value,
    (_, v) => (typeof v === 'bigint' ? v.toString() : v),
    2
  );
}
