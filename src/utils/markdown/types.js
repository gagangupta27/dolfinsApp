/* @flow */

// AST Nodes

let CodeBlockNode = {
  lang: "",
  content: "",
};

let EmptyNode = {};

let HeadingNode = {
  level: 0,
  content: {},
};

let ImageNode = {
  alt: "",
  target: "",
  title: "",
  width: undefined,
  height: undefined,
};

let InlineContentNode = {
  content: {},
};

let LinkNode = {
  content: {},
  target: "",
  title: undefined,
};

let ListNode = {
  ordered: false,
  start: 0,
  items: [],
};

let TableAlign = null;

let TableNode = {
  header: [],
  align: TableAlign,
  cells: [],
};

let TextNode = {
  content: "",
};

let InlineNode =
  EmptyNode || ImageNode || InlineContentNode || LinkNode || TextNode;

let Node = InlineNode || CodeBlockNode || HeadingNode || ListNode || TableNode;

// Rules

let RegexComponents = [];
let NestedParseFunction = function (input, any) {
  return null;
};
let ParseState = {};

let ParseFunction = function (
  RegexComponents,
  NestedParseFunction,
  ParseState
) {
  return null;
};

let NodeKey = "";
let OutputFunction = function (Node, Object) {
  return null;
};
let RenderState = {
  key: "",
  onLinkPress: null,
};
let RenderStyle = {};
let RenderStyles = {};

let RenderFunction = function (Node, OutputFunction, RenderState, RenderStyle) {
  return null;
};

let Rule = {
  order: undefined,
  match: undefined,
  parse: undefined,
  render: undefined,
};
let Rules = {};

// Styles

let Styles = {};

export {
  CodeBlockNode,
  EmptyNode,
  HeadingNode,
  ImageNode,
  InlineContentNode,
  LinkNode,
  ListNode,
  TableAlign,
  TableNode,
  TextNode,
  InlineNode,
  Node,
  RegexComponents,
  NestedParseFunction,
  ParseState,
  ParseFunction,
  NodeKey,
  OutputFunction,
  RenderState,
  RenderStyle,
  RenderStyles,
  RenderFunction,
  Rule,
  Rules,
  Styles,
};
