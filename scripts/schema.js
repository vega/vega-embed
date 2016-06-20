function spec(name, props) {
  var p = {};
  for (var key in props) {
    p[key] = props[key];
  }
  p.parameters = { "$ref": "#/refs/parameters" };
  p.parameter_el = { "type": "string" };
  p.renderer = { "enum": ["canvas", "svg"] };
  p.mode = { "enum": ["vega", "vega-lite"] };
  p.config = {
    "oneOf": [{"type": "string"}, {"type": "object"}]
  };
  p.actions = {
    "oneOf": [
      { "type": "boolean" },
      {
        "type": "object",
        "properties": {
          "export": { "type": "boolean" },
          "source": { "type": "boolean" },
          "editor": { "type": "boolean" }
        }
      }
    ]
  };

  return {
    type: "object",
    properties: p,
    required: [name],
    additionalProperties: false
  };
}

function param(type, props, req, additional) {
  var o = {
    "type": "object",
    "properties": {
      "type": type ? { "enum": [type] } : "string",
      "signal": { "type": "string" },
      "name": { "type": "string" },
      "rewrite": {
        "type": "array",
        "items": { "type": "string" }
      }
    },
    "required": ["type", "signal"],
    "additionalProperties": !!additional
  };
  for (var key in props) {
    o.properties[key] = props[key];
  }
  if (req) {
    o.required = o.required.concat(req);
  }
  return o;
}

var schema = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "Vega Embedded Web Components Specification Language",
  "oneOf": [
    spec("source", {"source": { "type": "string" }}),
    spec("url", {"url": { "type": "string", "format": "uri" }}),
    spec("spec", {"spec": { "type": "object" } })
    // External URLs are not (directly) supported by tv4
    // Moreover, spec formats differ by mode
    // $ref": "http://vega.github.io/vega/vega-schema.json"
    // $ref": "http://vega.github.io/vega-lite/vega-lite-schema.json"
  ],
  "refs": {
    "parameters": {
      "type": "array",
      "items": { "$ref": "#/refs/parameter" }
    },

    "parameter": {
      "oneOf": [
        { "$ref": "#/refs/parameter-checkbox" },
        { "$ref": "#/refs/parameter-select" },
        { "$ref": "#/refs/parameter-radio" },
        { "$ref": "#/refs/parameter-range" },
        { "$ref": "#/refs/parameter-input" }
      ]
    },

    "parameter-checkbox": param('checkbox', {
      "value": { "type": "boolean", "default": false }
    }),

    "parameter-select": param('select', {
      "value": { "type": ["string", "number", "boolean"] },
      "options": {
        "type": "array",
        "items": { "type": ["string", "number", "boolean"] }
      }
    }, ["options"]),

    "parameter-radio": param('radio', {
      "value": { "type": ["string", "number", "boolean"] },
      "options": {
        "type": "array",
        "items": { "type": ["string", "number", "boolean"] }
      }
    }, ["options"]),

    "parameter-range": param('range', {
      "value": { "type": "number" },
      "min": { "type": "number" },
      "max": { "type": "number" },
      "step": { "type": "number" },
    }, ["min", "max"]),

    "parameter-input": param('text', {
      "value": { "type": ["string", "number", "boolean"], "default": "" }
    }, null, true),
  }
};

process.stdout.write(JSON.stringify(schema, null, 2));
