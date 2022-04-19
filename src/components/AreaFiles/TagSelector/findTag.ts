import { ITag, TagType } from "../../../interfaces";

const findTag = (tags: ITag[], name: string, type: TagType) => {
  return tags.find((t) => name === t.name && type === t.type);
};

export default findTag;
