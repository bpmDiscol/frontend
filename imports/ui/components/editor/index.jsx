import React from "react";
import {
  Editor,
  EditorState,
  convertToRaw,
  convertFromRaw,
  RichUtils,
  getDefaultKeyBinding,
} from "draft-js";

import "./editor.css";
import "draft-js/dist/Draft.css";
import { Flex, Tooltip } from "antd";

import { stateFromHTML } from "draft-js-import-html";
export default function BPMEditor({
  requestData,
  update,
  field,
  heigth = "50dvh",
}) {
  const [observations, setObservations] = React.useState(() =>
    initializeEditorState(requestData)
  );

  function initializeEditorState(data) {
    if (!data) {
      return EditorState.createEmpty();
    }

    try {
      if (typeof data === "object")
        return EditorState.createWithContent(convertFromRaw(data));
      const parsedData = JSON.parse(data);
      return EditorState.createWithContent(convertFromRaw(parsedData));
    } catch (e) {
      // No es un JSON válido, así que asumimos que es HTML
      const contentState = stateFromHTML(data);
      return EditorState.createWithContent(contentState);
    }
  }

  function updateText(value) {
    setObservations(value);
    if (field !== "local")
      update(field, convertToRaw(value.getCurrentContent()));
    else update(JSON.stringify(convertToRaw(value.getCurrentContent())));
  }

  function handleKeyCommand(command, observations) {
    const newState = RichUtils.handleKeyCommand(observations, command);
    if (newState) {
      setObservations(newState);
      return "handled";
    }
    return "not-handled";
  }

  function mapKeyToEditorCommand(e) {
    if (e.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(e, observations, 4 /* maxDepth */);
      if (newEditorState !== editorState) {
        setObservations(newEditorState);
      }
      return;
    }
    return getDefaultKeyBinding(e);
  }

  function toggleBlockType(blockType) {
    setObservations(RichUtils.toggleBlockType(observations, blockType));
  }

  function toggleInlineStyle(inlineStyle) {
    setObservations(RichUtils.toggleInlineStyle(observations, inlineStyle));
  }

  function BlockStyleControls(props) {
    const { editorState } = props;
    const selection = editorState.getSelection();
    const blockType = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();

    return (
      <Flex className="RichEditor-controls">
        {BLOCK_TYPES.map((type) => (
          <Tooltip title={type.label} key={type.label}>
            <Flex>
              <StyleButton
                active={type.style === blockType}
                label={type.label}
                onToggle={props.onToggle}
                style={type.style}
                icon={type.icon}
              />
            </Flex>
          </Tooltip>
        ))}
      </Flex>
    );
  }

  function InlineStyleControls(props) {
    const currentStyle = props.editorState.getCurrentInlineStyle();

    return (
      <Flex className="RichEditor-controls">
        {INLINE_STYLES.map((type) => (
          <Tooltip title={type.label} key={type.label}>
            <Flex>
              <StyleButton
                active={currentStyle.has(type.style)}
                label={type.label}
                onToggle={props.onToggle}
                style={type.style}
                icon={type.icon}
              />
            </Flex>
          </Tooltip>
        ))}
      </Flex>
    );
  }

  function StyleButton(props) {
    const onToggle = (e) => {
      e.preventDefault();
      props.onToggle(props.style);
    };

    let className = "RichEditor-styleButton";
    if (props.active) {
      className += " RichEditor-activeButton";
    }

    return (
      <span className={className} onMouseDown={onToggle}>
        {props.icon}
      </span>
    );
  }

  const BLOCK_TYPES = [
    {
      label: "H1",
      style: "header-one",
      icon: <img src="/icons/IconParkOutlineH1.svg" />,
    },
    {
      label: "H2",
      style: "header-two",
      icon: <img src="/icons/IconParkOutlineH2.svg" />,
    },
    {
      label: "H3",
      style: "header-three",
      icon: <img src="/icons/IconParkOutlineH3.svg" />,
    },
    {
      label: "Blockquote",
      style: "blockquote",
      icon: <img src="/icons/MingcuteBlockquoteFill.svg" />,
    },
    {
      label: "Viñeta",
      style: "unordered-list-item",
      icon: <img src="/icons/OcticonListUnordered.svg" />,
    },
    {
      label: "Numeración",
      style: "ordered-list-item",
      icon: <img src="/icons/FlowbiteOrderedListOutline.svg" />,
    },
    {
      label: "Código",
      style: "code-block",
      icon: <img src="/icons/MaterialSymbolsCodeBlocks.svg" />,
    },
  ];

  const INLINE_STYLES = [
    { label: "Negrita", style: "BOLD", icon: <img src="/icons/FeBold.svg" /> },
    {
      label: "Cursiva",
      style: "ITALIC",
      icon: <img src="/icons/GridiconsItalic.svg" />,
    },
    {
      label: "Subrayado",
      style: "UNDERLINE",
      icon: <img src="/icons/GridiconsUnderline.svg" />,
    },
  ];

  return (
    <div>
      {update && (
        <Flex>
          <BlockStyleControls
            editorState={observations}
            onToggle={toggleBlockType}
          />
          <InlineStyleControls
            editorState={observations}
            onToggle={toggleInlineStyle}
          />
        </Flex>
      )}
      <div
        style={{
          border: "1px solid black",
          padding: "10px",
          height: heigth,
          overflowX: "auto",
          flex: 1,
        }}
      >
        <Editor
          editorState={observations}
          onChange={updateText}
          readOnly={!update}
          handleKeyCommand={handleKeyCommand}
        />
      </div>
    </div>
  );
}
