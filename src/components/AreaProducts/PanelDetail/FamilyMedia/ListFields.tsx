import FieldText from "../../../../componentsBase/Field/FieldText";
import * as React from "react";
import {
  IUserProfile,
  IProduct,
  IMedia,
  IReady,
  ContentType,
  IMediaInfo,
  IM2m,
} from "../../../../interfaces";
import getUser from "../../../../utils/getUser";
import { KEY_READY } from "../../../../constants";
import sortByKey from "../../../../utils/sortByKey";
import isEmpty from "lodash-es/isEmpty";
import formatHoursMinutes from "../../../../utils/formatHoursMinutes";

const getReady = (readyArray: IReady[], fileId: string): IReady => {
  const array = sortByKey(Array.from(readyArray || []), "instant");
  array.reverse();
  return array.find(({ contentId, contentType }) => {
    return contentId === fileId && contentType === ContentType.MEDIA;
  });
};

interface IField {
  label: string;
  value: string;
  placeholder?: string;
  adornmentIcon?: string;
  adornmentAvatar?: string;
}
interface IGetFields {
  media: IMedia;
  mediaData: IMediaInfo;
  ready: IReady[];
  users: IUserProfile[];
  m2ms: IM2m[];
}
const getFields = ({
  media,
  mediaData,
  ready = [],
  users,
  m2ms,
}: IGetFields): IField[] => {
  const { uploader, uploaded, filename, mimeType, fileId } = media;
  const user = getUser(uploader, { users, m2ms });
  const mediaReady = getReady(ready, fileId);

  const fields: IField[] = [
    {
      label: "File name",
      value: filename,
    },
    {
      label: "Type",
      value: mimeType,
    },
    {
      label: "Uploaded by",
      value: user.name,
      placeholder: user.placeholder,
      adornmentAvatar: user.picture,
    },
    {
      label: "Upload date",
      value: formatHoursMinutes(uploaded),
    },
  ];

  if (mediaReady) {
    const userReady = getUser(mediaReady.user, { users, m2ms });
    fields.push({
      label: "Last “Ready Status” set by",
      value: userReady.name,
      placeholder: userReady.placeholder,
      adornmentAvatar: userReady.picture,
    });
    fields.push({
      label: "Last “Ready Status” date",
      value: formatHoursMinutes(mediaReady.instant),
    });
  }

  if (!isEmpty(mediaData)) {
    fields.push({
      label: "Dimensions",
      value: `${mediaData.geometry.width} x ${mediaData.geometry.height} px`,
    });

    fields.push({
      label: "Size",
      value: String(mediaData.filesize),
    });
  }

  return fields;
};

interface IListFields {
  assetData: IProduct;
  media: IMedia;
  users: IUserProfile[];
  m2ms: IM2m[];
  fieldStyle?: React.CSSProperties;
  fieldClassName?: string;
  mediaData: IMediaInfo;
}

const ListFields = ({
  assetData,
  media,
  users,
  m2ms,
  fieldStyle,
  fieldClassName,
  mediaData,
}: IListFields) => {
  const fields = getFields({
    users,
    m2ms,
    ready: assetData[KEY_READY],
    media,
    mediaData,
  });

  return (
    <>
      {fields.map((f, index) => (
        <FieldText
          key={index}
          readOnly
          {...f}
          style={fieldStyle}
          className={fieldClassName}
        />
      ))}
    </>
  );
};

export default ListFields;
