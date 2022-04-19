import * as React from "react";
import ImageAnnotation, {
  IAnnotation,
} from "../../../../../../componentsBase/ImageAnnotation";
import apiUrls from "../../../../../../api/endpoints";
import {
  IMedia,
  INPayloadMentionImgSc,
  NotificationType,
  Service,
} from "../../../../../../interfaces";
import { ContextCurrentUser, ContextUsers } from "../../../../../contexts";
import { ACT_VPORT } from "../../../../reducer";
import { ACT_DETAIL } from "../../../reducer";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_MEDIA_ANNOTATIONS,
  ADD_ANNOTATION,
  REMOVE_ANNOTATION,
  RESOLVE_ANNOTATION,
  UPDATE_RESOLVE,
} from "./gqlQuery";
import {
  formatMediaAnnotationsByViews,
  getFileIdResolved,
} from "../../../../../../api/graphqlAPI";
import { createNotification } from "../../../../../../api/fetchesApi";
import { isEmpty } from "lodash-es";
import { ACTION, AnnotationAction } from "./reducer";
import { colorTheme } from "../../../../../../constants";
import {
  ContextDispatchDetail,
  ContextDispatchViewport,
} from "../../../../contexts";

const getDataToSave = ({
  geometry,
  mentions,
  data: { color, value, dateCreated, dateUpdated },
}: IAnnotation) => ({
  geometry,
  mentionsIds: mentions.map((user) => user.id),
  color,
  value,
  dateCreated,
  dateUpdated,
});

interface IPreviewImageAnnotation {
  dispatchPreview: React.Dispatch<unknown>;
  itemId: string;
  annotationsSelector?: string;
  media: IMedia;
  required: boolean;
  annotationAction: AnnotationAction;
  annotationPending: IAnnotation;
  imgWidth: number;
  imgHeight: number;
}

const annotationEditable = {
  color: true,
  resolved: true,
  value: true,
  delete: true,
};

const PreviewImageAnnotation = ({
  dispatchPreview,
  itemId,
  annotationsSelector,
  media,
  required,
  annotationAction,
  annotationPending,
  imgWidth,
  imgHeight,
}: IPreviewImageAnnotation) => {
  const dispatchDetail = React.useContext(ContextDispatchDetail);
  const dispatchViewport = React.useContext(ContextDispatchViewport);
  const users = React.useContext(ContextUsers);
  const userProfile = React.useContext(ContextCurrentUser);

  const userId = userProfile.id;

  const { fileId, view } = media;
  const { loading: loadingAnnotations, data, refetch } = useQuery(
    GET_MEDIA_ANNOTATIONS,
    {
      variables: { fileId, entityId: itemId },
    }
  );
  const imageUrl = apiUrls.getRendition.url(fileId, Service.SEECOMMERCE, "xxl");
  const getAnnotations = React.useCallback(
    (
      res: {
        id: string;
        createdby: string;
        data: undefined;
        resolved: boolean;
      }[]
    ): IAnnotation[] =>
      res.map(({ id, createdby, data, resolved }) => {
        const {
          dateCreated,
          dateUpdated,
          geometry,
          value,
          color,
          mentionsIds,
        } = JSON.parse(data);
        return {
          user: users.find((user) => user.id === createdby),
          geometry,
          mentions: mentionsIds.map((idM) => {
            return users.find((user) => {
              return user.id === idM;
            });
          }),
          editable: annotationEditable,
          data: {
            resolved,
            color,
            id,
            value,
            dateCreated,
            dateUpdated,
          },
        };
      }),
    [users]
  );
  const [addAnnotation] = useMutation(ADD_ANNOTATION);
  const [removeAnnotation] = useMutation(REMOVE_ANNOTATION);
  const [resolveAnnotation] = useMutation(RESOLVE_ANNOTATION);
  const [updateAnnotation] = useMutation(UPDATE_RESOLVE);
  const cbOnAnnUpdate = React.useCallback(
    (annotation: IAnnotation) => {
      dispatchPreview({
        type: ACTION.ANNOTATION_PENDING,
        action: AnnotationAction.UPDATE,
        annotation,
      });
    },
    [dispatchPreview]
  );
  const cbOnAnnRemove = React.useCallback(
    (annotation: IAnnotation) => {
      dispatchPreview({
        type: ACTION.ANNOTATION_PENDING,
        action: AnnotationAction.REMOVE,
        annotation,
      });
    },
    [dispatchPreview]
  );
  const cbOnAnnCreate = React.useCallback(
    (annotation: IAnnotation) => {
      dispatchPreview({
        type: ACTION.ANNOTATION_PENDING,
        action: AnnotationAction.CREATE,
        annotation,
      });
    },
    [dispatchPreview]
  );

  React.useEffect(() => {
    (async () => {
      if (!loadingAnnotations && data) {
        const annotations = getAnnotations(data.getAnnotationByCid3);

        const fileIdResolved = getFileIdResolved(
          formatMediaAnnotationsByViews({
            listResolvedByMedia: data.listCid2Cid3AnnotationCountResolved,
            listUnResolvedByMedia: data.listCid2Cid3AnnotationCountNotResolved,
          })
        );

        dispatchViewport({
          type: ACT_VPORT.DETAIL_ANNOTATIONS_LOADED,
          fileId,
          itemId,
          annotations,
          fileIdResolved,
        });

        dispatchDetail({
          type: ACT_DETAIL.ANNOTATIONS_UPDATE,
          fileId,
          itemId,
          annotations,
          fileIdResolved,
        });
      }
    })();
  }, [
    data,
    dispatchDetail,
    dispatchViewport,
    fileId,
    getAnnotations,
    itemId,
    loadingAnnotations,
  ]);

  // UPDATE annotation
  React.useEffect(() => {
    (async () => {
      if (
        annotationAction === AnnotationAction.UPDATE &&
        !isEmpty(annotationPending)
      ) {
        dispatchPreview({ type: ACTION.ANNOTATION_RESET });
        const annData = annotationPending.data;
        const prevAnnotation = media.annotations
          ? media.annotations.find((a) => a.data.id === annData.id)
          : null;
        const { id, resolved } = annData;
        if (prevAnnotation.data.resolved !== annData.resolved) {
          await resolveAnnotation({ variables: { id, resolved } });
        } else {
          await updateAnnotation({
            variables: {
              id,
              data: JSON.stringify(getDataToSave(annotationPending)),
            },
          });
        }
        await refetch();
      }
    })();
  }, [
    annotationAction,
    annotationPending,
    media.annotations,
    refetch,
    resolveAnnotation,
    updateAnnotation,
    dispatchPreview,
  ]);

  // REMOVE annotation
  React.useEffect(() => {
    (async () => {
      if (
        annotationAction === AnnotationAction.REMOVE &&
        !isEmpty(annotationPending)
      ) {
        dispatchPreview({ type: ACTION.ANNOTATION_RESET });
        const {
          data: { id },
        } = annotationPending;
        await removeAnnotation({
          variables: {
            id,
          },
        });
        await refetch();
      }
    })();
  }, [
    annotationAction,
    annotationPending,
    refetch,
    removeAnnotation,
    dispatchPreview,
  ]);

  // CREATE annotation
  React.useEffect(() => {
    (async () => {
      if (
        annotationAction === AnnotationAction.CREATE &&
        !isEmpty(annotationPending)
      ) {
        try {
          dispatchPreview({ type: ACTION.ANNOTATION_RESET });
          await addAnnotation({
            variables: {
              cid1: itemId,
              cid2: view,
              cid3: fileId,
              data: JSON.stringify(getDataToSave(annotationPending)),
            },
          });

          if (!isEmpty(annotationPending.mentions)) {
            const payload: INPayloadMentionImgSc = {
              entityId: itemId,
              annotation: annotationPending.data.value,
              mediaView: media.view,
              mediaViewRequired: required,
              mediaFileId: media.fileId,
              mediaUploaded: media.uploaded,
            };
            await createNotification({
              toUsers: annotationPending.mentions.map((u) => u.id),
              type: NotificationType.MENTION_IMG_SC,
              payload,
            });
          }
        } catch (err) {
          console.warn("create new annotation: ", err);
        }

        await refetch();
      }
    })();
  }, [
    addAnnotation,
    annotationAction,
    annotationPending,
    fileId,
    itemId,
    media.fileId,
    media.uploaded,
    media.view,
    refetch,
    required,
    view,
    dispatchPreview,
  ]);

  return (
    <>
      <div style={{ flex: 1 }} />
      <ImageAnnotation
        colorTheme={colorTheme}
        selector={annotationsSelector}
        imageUrl={imageUrl}
        imageWidth={imgWidth}
        imageHeight={imgHeight}
        loading={loadingAnnotations}
        readOnly={loadingAnnotations}
        colors={[
          "#9A26ED",
          "#1EC8A0",
          "#F2D822",
          "#ED3A69",
          "#002BFF",
          "#1A1A1A",
        ]}
        colorsEnabled
        userId={userId}
        users={users}
        annotations={
          media.annotations
            ? media.annotations
                .filter((a) => a.user)
                .map((ann: IAnnotation) => {
                  // user can edit only their annotations
                  const isMyAnnotation = ann.user.id === userId;
                  return {
                    ...ann,
                    editable: {
                      color: true,
                      resolved: true,
                      value: isMyAnnotation,
                      delete: isMyAnnotation,
                    },
                  };
                })
            : []
        }
        annotationEditable={annotationEditable}
        onCreate={cbOnAnnCreate}
        onEdit={cbOnAnnUpdate}
        onDelete={cbOnAnnRemove}
      />
      <div style={{ flex: 1 }} />
    </>
  );
};

export default PreviewImageAnnotation;
