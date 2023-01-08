import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { MDXRemote } from "next-mdx-remote";
import React from "react";

type Props = {
  source: MDXRemoteSerializeResult;
};
const MDXRemoteComponent = ({ source }: Props) => {
  const components = {
    p: (props: any) => (
      <p className={"mt-2 space-y-4 text-sm text-gray-700"} {...props} />
    ),
    h2: (props: any) => (
      <h2 className={"mt-4 text-base font-medium text-gray-900"} {...props} />
    ),
  };
  return <MDXRemote {...source} components={components} />;
};

export default MDXRemoteComponent;