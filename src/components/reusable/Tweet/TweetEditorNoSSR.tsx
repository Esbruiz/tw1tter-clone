import { useMemo } from "react";
import type { Options } from "easymde";
import SimpleMDE from "react-simplemde-editor";

const TweetEditorNoSSR = ({
  onChange,
  value,
}: {
  onChange: (value: string) => void;
  value: string;
}) => {
  const simpleMDEOptions = useMemo(() => {
    return {
      spellChecker: false,
      sideBySideFullscreen: false,
      maxHeight: "150px",
      status: false,
      toolbar: [
        "bold",
        "heading",
        "italic",
        "image",
        "link",
        "|",
        "preview",
        "fullscreen",
        "guide",
      ],
    } as Options;
  }, []);
  return (
    <SimpleMDE
      value={value}
      onChange={onChange}
      options={simpleMDEOptions}
      className="w-full"
    />
  );
};

export default TweetEditorNoSSR;
