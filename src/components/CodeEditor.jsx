import { useRef, useState, useEffect } from "react";
import { Box, HStack } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";
import * as YJS from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "y-monaco";

const CodeEditor = ({ isDarkMode }) => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [editorTheme, setEditorTheme] = useState(isDarkMode ? "vs-dark" : "light");

  useEffect(() => {
    setEditorTheme(isDarkMode ? "vs-dark" : "light");
  }, [isDarkMode]);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
    const document = new YJS.Doc();
    const RtcProvider = new WebrtcProvider("EDITOR-ROOM", document);
    new MonacoBinding(
      document.getText("monacoEditor"),
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      RtcProvider.awareness
    );
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  return (
    <Box>
      <HStack spacing={4}>
        <Box w="50%">
        <LanguageSelector language={language} onSelect={onSelect} isDarkMode={isDarkMode} />

          <Editor
            options={{ minimap: { enabled: false } }}
            height="75vh"
            theme={editorTheme}
            language={language}
            defaultValue={CODE_SNIPPETS[language]}
            onMount={onMount}
            value={value}
            onChange={(value) => setValue(value)}
          />
        </Box>
        <Output editorRef={editorRef} language={language} isDarkMode={isDarkMode} />
      </HStack>
    </Box>
  );
};

export default CodeEditor;
