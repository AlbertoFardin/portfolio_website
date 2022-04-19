import concat from "lodash-es/concat";
import isEmpty from "lodash-es/isEmpty";
import without from "lodash-es/without";
import * as React from "react";
import Annotation from "@warda/react-image-annotation";
import LoadingMask from "../LoadingMask";
import { emptyFn } from "../utils/common";
import AnnotationPopover from "./AnnotationPopover";
import getCursor from "./getCursor";
import getSelector from "./getSelector";
import { draftId, IAnnotation, IAnnotationData } from "./interfaces";
import * as s from "./selectors";
import getAnnotationFromPoint from "./utils/getAnnotationFromPoint";
import getCoordPercentage from "./utils/getCoordPercentage";
import IImageAnnotation from "./IImageAnnotation";
import IUser from "../IUser";

const ImageAnnotation = ({
  annotations: allAnnotations = [],
  annotationEditable = {
    color: false,
    resolved: false,
    value: false,
    delete: false,
  },
  className,
  colorTheme,
  colors = ["#ff0000"],
  colorsEnabled = false,
  imageUrl,
  imageWidth,
  imageHeight,
  loading = false,
  onCreate = emptyFn,
  onDelete = emptyFn,
  onEdit = emptyFn,
  readOnly = false,
  selector = s.PointSelector.TYPE,
  selectors = [
    s.OvalSelector,
    s.PointSelector,
    s.RectangleSelector,
    s.FreehandSelector,
  ],
  style,
  users,
  userId,
}: IImageAnnotation) => {
  const user = users.find(({ id }) => id === userId);
  const annotationDefault = React.useMemo(
    () => ({
      data: { id: draftId },
      editable: annotationEditable,
      user,
      mentions: [],
      geometry: {
        type: "",
        x: 0,
        y: 0,
      },
    }),
    [annotationEditable, user]
  );
  const rootRef = React.useRef(null);
  const [annotationOpen, setAnnotationOpen] = React.useState(false);
  const [annotation, setAnnotation] = React.useState(
    annotationDefault as IAnnotation
  );
  const [mousehoverId, setMousehoverId] = React.useState("");
  const [writing, setWriting] = React.useState(false);
  const annotationId = annotation.data.id;
  const annotationIsDraft = annotationId === draftId;
  const annotations = allAnnotations.reduce((acc, cur: IAnnotation) => {
    // check if component have selector to show annotation TYPE
    const haveType = !!selectors.find((sel) => sel.TYPE === cur.geometry.type);
    if (haveType && !!cur.data.id) acc.push(cur);
    return acc;
  }, []);
  let popoverPosition = { left: 0, top: 0 };
  const onChange = React.useCallback(
    (a: IAnnotation) => {
      // fix because Freehand fire "onChange" on "onMouseMove"
      if (a.geometry.type) {
        if (selector !== s.FreehandSelector.TYPE) setWriting(true);
        // define a new draft
        setAnnotation(a);
      }
    },
    [selector]
  );
  const renderOverlay = React.useCallback(() => {
    setMousehoverId("");
    // override default component
    return null;
  }, []);
  const renderEditor = React.useCallback(() => {
    return null;
  }, []);
  const renderContent = React.useCallback((a) => {
    setMousehoverId(a.annotation.data.id);
    // override default component
    return null;
  }, []);
  const renderHighlight = React.useCallback(
    (a) => {
      const ann: IAnnotation = a.annotation;
      const annId = ann.data.id;
      const annResolved = ann.data.resolved;
      const annColor = ann.data.color;
      const annMousehover = annId === mousehoverId;
      return getSelector({
        key: a.key,
        annotation: ann,
        color:
          colorsEnabled && (!annResolved || annMousehover)
            ? annColor || colors[0]
            : "#9a9a9a",
        imageWidth,
        imageHeight,
        active: writing || annResolved ? false : annMousehover,
      });
    },
    [colors, colorsEnabled, imageHeight, imageWidth, mousehoverId, writing]
  );
  const renderSelector = React.useCallback(
    (a) => {
      const ann: IAnnotation = a.annotation;
      const annColor = ann.data.color;
      return getSelector({
        key: a.key,
        annotation: ann,
        color: annColor || colors[0],
        imageWidth,
        imageHeight,
        active: true,
      });
    },
    [colors, imageHeight, imageWidth]
  );
  const onClick = React.useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      setWriting(false);

      // check if user click an annotation selector
      const mousePoint = getCoordPercentage(event);
      const annotationClicked = getAnnotationFromPoint(mousePoint, annotations);

      if (!!annotationClicked && !writing) {
        // user want READ an annotation
        setAnnotation(annotationClicked);
        setAnnotationOpen(true);
      } else {
        // user want WRITE an annotation
        // eslint-disable-next-line no-lonely-if
        if (
          // tslint:disable-next-line:max-line-length
          (selector === s.FreehandSelector.TYPE &&
            !isEmpty(annotation.geometry.points) &&
            annotation.geometry.points.length > 5) ||
          selector === s.PointSelector.TYPE
        ) {
          setAnnotation({
            ...annotation,
            data: {
              ...annotation.data,
              id: draftId,
              color: colors[0],
              value: "",
            },
            geometry: {
              ...annotation.geometry,
              type: selector,
              ...mousePoint,
            },
          });
          setAnnotationOpen(true);
        } else {
          setAnnotation(annotationDefault);
        }
      }
    },
    [annotation, annotationDefault, annotations, colors, selector, writing]
  );
  const onAnnotationClose = React.useCallback(() => {
    setAnnotationOpen(false);
  }, []);
  const onAnnotationExited = React.useCallback(() => {
    setAnnotation(annotationDefault);
  }, [annotationDefault]);
  const onAnnotationChange = React.useCallback(
    (a: IAnnotationData, mentions: IUser[]) => {
      setAnnotation({
        ...annotation,
        mentions,
        data: {
          ...annotation.data,
          ...a,
        },
      });
    },
    [annotation]
  );
  const onAnnotationConfirm = React.useCallback(
    (a: IAnnotationData, close = false) => {
      const ann = {
        user: annotation.user,
        mentions: annotation.mentions,
        geometry: annotation.geometry,
        editable: annotation.editable,
        data: {
          ...annotation.data,
          ...a,
        },
      };
      const annIndex = annotations.findIndex(
        ({ data }: IAnnotation) => annotationId === data.id
      );
      const newAnns = concat([], annotations);

      if (annotationIsDraft) {
        // is a new annotation, so add it
        newAnns.push(ann);
        onCreate(ann, newAnns);
      } else {
        // is a exist annotation, so edit it
        newAnns.splice(annIndex, 1, ann);
        onEdit(ann, newAnns);
      }

      if (close) setAnnotationOpen(false);
    },
    [
      annotation.data,
      annotation.editable,
      annotation.geometry,
      annotation.mentions,
      annotation.user,
      annotationId,
      annotationIsDraft,
      annotations,
      onCreate,
      onEdit,
    ]
  );
  const onAnnotationDelete = React.useCallback(() => {
    const newAnns = without(annotations, annotation);
    onDelete(annotation, newAnns);
    setAnnotationOpen(false);
  }, [annotation, annotations, onDelete]);

  if (!!rootRef && !!rootRef.current) {
    const offset = 10;
    const rootRect = rootRef.current.getBoundingClientRect();
    popoverPosition = {
      left: (imageWidth / 100) * annotation.geometry.x + rootRect.left + offset,
      top: (imageHeight / 100) * annotation.geometry.y + rootRect.top + offset,
    };
  }

  React.useEffect(() => {
    // press ESC
    const keydownHandle = (event) =>
      event.keyCode === 27 ? setAnnotationOpen(false) : null;
    window.addEventListener("keydown", keydownHandle);
    return () => window.removeEventListener("keydown", keydownHandle);
  });

  return (
    <div ref={rootRef} style={{ position: "relative" }}>
      <Annotation
        src={imageUrl}
        annotations={annotations}
        selectors={selectors}
        type={selector}
        value={annotation}
        renderOverlay={renderOverlay}
        onChange={onChange}
        // override default component
        renderEditor={renderEditor}
        renderContent={renderContent}
        renderHighlight={renderHighlight}
        renderSelector={renderSelector}
        onClick={onClick}
        disableAnnotation={readOnly}
        className={className}
        style={{
          ...style,
          width: imageWidth,
          height: imageHeight,
          cursor: getCursor(selector, readOnly),
        }}
      />
      <AnnotationPopover
        users={users}
        open={annotationOpen}
        anchorPosition={popoverPosition}
        colorTheme={colorTheme}
        colors={colors}
        readOnly={readOnly}
        annotation={annotation}
        annotationOriginal={annotations.find(
          ({ data: { id } }: IAnnotation) => id === annotationId
        )}
        onClose={onAnnotationClose}
        onExited={onAnnotationExited}
        onChange={onAnnotationChange}
        onConfirm={onAnnotationConfirm}
        onDelete={onAnnotationDelete}
      />
      <LoadingMask open={loading} />
    </div>
  );
};

export default ImageAnnotation;
