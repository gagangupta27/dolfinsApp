/* @flow */

import React from "react";

import { Image, Text, View } from "react-native";

import { Cell, Grid, Row } from "react-native-tabular-grid-markdown-view";


function renderImage(node, output, state, styles) {
  const { imageWrapper: wrapperStyle, image: imageStyle } = styles;
  return (
    <View
      key={state.key}
      style={
        node.width || node.height
          ? [wrapperStyle, paddedSize(node, wrapperStyle)]
          : wrapperStyle
      }
    >
      <Image source={{ uri: node.target }} style={imageStyle} />
    </View>
  );
}

function renderTableCell(
  cell,
  row,
  column,
  rowCount,
  columnCount,
  output,
  state,
  styles
) {
  const cellStyle = [styles.tableCell];
  const contentStyle = [styles.tableCellContent];

  if (row % 2 == 0) {
    cellStyle.push(styles.tableCellEvenRow);
    contentStyle.push(styles.tableCellContentEvenRow);
  } else {
    cellStyle.push(styles.tableCellOddRow);
    contentStyle.push(styles.tableCellContentOddRow);
  }

  if (column % 2 == 0) {
    cellStyle.push(styles.tableCellEvenColumn);
    contentStyle.push(styles.tableCellContentEvenColumn);
  } else {
    cellStyle.push(styles.tableCellOddColumn);
    contentStyle.push(styles.tableCellContentOddColumn);
  }

  if (row == 1) {
    cellStyle.push(styles.tableHeaderCell);
    contentStyle.push(styles.tableHeaderCellContent);
  } else if (row == rowCount) {
    cellStyle.push(styles.tableCellLastRow);
    contentStyle.push(styles.tableCellContentLastRow);
  }

  if (column == columnCount) {
    cellStyle.push(styles.tableCellLastColumn);
    contentStyle.push(styles.tableCellContentLastColumn);
  }

  return (
    <Cell rowId={row} id={column} key={column} style={cellStyle}>
      <Text style={contentStyle}>{output(cell, state)}</Text>
    </Cell>
  );
}

function paragraphRenderer() {
  var renderText = textContentRenderer("paragraph");

  return (node, output, state, styles) => {
    if (
      node.content instanceof Array &&
      node.content.length === 1 &&
      node.content[0].type === "image"
    ) {
      const imageNode = node.content[0];
      return renderImage(imageNode, output, state, styles);
    } else {
      return renderText(node, output, state, styles);
    }
  };
}

function textContentRenderer(styleName, styleName2) {
  return (node, output, state, styles) => (
    <Text
      key={state.key}
      style={
        styleName2 ? [styles[styleName], styles[styleName2]] : styles[styleName]
      }
    >
      {typeof node.content === "string"
        ? node.content
        : output(node.content, state)}
    </Text>
  );
}

function paddedSize(size, style) {
  function either(a, b) {
    return a === undefined ? b : a;
  }

  const {
    padding = 0,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingBottom,
  } = style;

  return {
    width:
      size.width + either(paddingLeft, padding) + either(paddingRight, padding),
    height:
      size.height +
      either(paddingTop, padding) +
      either(paddingBottom, padding),
  };
}

export default Object.freeze({
  blockQuote: textContentRenderer("blockQuote"),
  br: (node, output, state, styles) => (
    <Text key={state.key} style={styles.br}>
      {"\n\n"}
    </Text>
  ),
  codeBlock: textContentRenderer("codeBlock"),
  del: textContentRenderer("del"),
  em: textContentRenderer("em"),
  heading: (node, output, state, styles) =>
    textContentRenderer("heading", "heading" + node.level)(
      node,
      output,
      state,
      styles
    ),
  hr: (node, output, state, styles) => (
    <View key={state.key} style={styles.hr} />
  ),
  image: renderImage,
  inlineCode: textContentRenderer("inlineCode"),
  link: (node, output, state, styles) => {
    const onPress = state.onLinkPress;
    return (
      <Text
        key={state.key}
        style={styles.link}
        onPress={onPress ? () => onPress(node.target) : null}
      >
        {typeof node.content === "string"
          ? node.content
          : output(node.content, state)}
      </Text>
    );
  },
  list: (node, output, state, styles) => (
    <View key={state.key} style={styles.list}>
      {node.items.map((item, i) => (
        <View key={i} style={styles.listItem}>
          {node.ordered ? (
            <Text style={styles.listItemNumber}>{`${i + 1}.`}</Text>
          ) : (
            <Text style={styles.listItemBullet}>
              {styles.listItemBullet && styles.listItemBullet.content
                ? styles.listItemBullet.content
                : "\u25cf"}
            </Text>
          )}
          <Text
            style={
              node.ordered
                ? styles.listItemOrderedContent
                : styles.listItemUnorderedContent
            }
          >
            {output(item, state)}
          </Text>
        </View>
      ))}
    </View>
  ),
  newline: (node, output, state, styles) => (
    <Text key={state.key} style={styles.newline}>
      {"\n"}
    </Text>
  ),
  paragraph: paragraphRenderer(),
  strong: textContentRenderer("strong"),
  table: (node, output, state, styles) => (
    <Grid key={state.key} style={styles.table}>
      {[
        <Row id={1} key={1}>
          {node.header.map((cell, column) =>
            renderTableCell(
              cell,
              1,
              column + 1,
              node.cells.length + 1,
              node.header.length,
              output,
              state,
              styles
            )
          )}
        </Row>,
      ].concat(
        node.cells.map((cells, row) => (
          <Row id={row + 2} key={row + 2}>
            {cells.map((cell, column) =>
              renderTableCell(
                cell,
                row + 2,
                column + 1,
                node.cells.length + 1,
                cells.length,
                output,
                state,
                styles
              )
            )}
          </Row>
        ))
      )}
    </Grid>
  ),
  text: textContentRenderer("text"),
  u: textContentRenderer("u"),
});
